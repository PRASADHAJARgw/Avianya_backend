
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  organization_id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null; // Timestamp of last user activity
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  checkTokenExpiration: () => boolean;
  updateLastActivity: () => void;
  checkInactivity: () => boolean;
}

const API_BASE_URL = 'http://localhost:8080/api/v2';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return false; // No expiration set
    
    // Check if token is ACTUALLY expired (no buffer - only logout when truly expired)
    const expiresAt = exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    const isExpired = now > expiresAt; // No buffer time
    if (isExpired) {
      console.log('⏰ Token has expired');
      console.log('   Expired at:', new Date(expiresAt).toLocaleString());
      console.log('   Current time:', new Date(now).toLocaleString());
    }
    return isExpired;
  } catch (error) {
    console.error('❌ Error checking token expiration:', error);
    return true; // Treat invalid tokens as expired
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          
          console.log('📦 Login response data:', data);
          
          // Check if login was successful (server can return 200 with success: false)
          if (!response.ok || data.success === false) {
            throw new Error(data.message || data.error || 'Login failed');
          }
          
          // Only set auth state if we have valid user and token data
          if (!data.user || !(data.AccessToken || data.access_token)) {
            throw new Error('Invalid login response: missing user or token');
          }
          
          // Server returns AccessToken/access_token (handle both formats)
          set({
            user: data.user,
            token: data.AccessToken || data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: Date.now(), // Set initial activity timestamp
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string, organizationName: string) => {
        set({ isLoading: true, error: null });
        try {
          const requestBody: Record<string, string> = {
            email,
            password,
            name,
          };
          
          // Only include organization_name if provided (backend may not use it)
          if (organizationName) {
            requestBody.organization_name = organizationName;
          }
          
          const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          
          console.log('📦 Signup response data:', data);
          
          // Check if signup was successful (server can return 200 with success: false)
          if (!response.ok || data.success === false) {
            throw new Error(data.message || data.error || 'Signup failed');
          }
          
          // Only set auth state if we have valid user and token data
          if (!data.user || !(data.AccessToken || data.access_token)) {
            throw new Error('Invalid signup response: missing user or token');
          }
          
          // Server returns AccessToken/access_token (handle both formats)
          set({
            user: data.user,
            token: data.AccessToken || data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
          throw error;
        }
      },

      logout: () => {
        // Optional: Call backend logout endpoint (silently ignore errors)
        const { token } = get();
        if (token) {
          fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).catch(() => {
            // Silently ignore logout endpoint errors (e.g., CORS, network issues)
            console.log('ℹ️  Backend logout endpoint unavailable (ignored)');
          });
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to refresh user data');
          }

          const data = await response.json();
          set({ user: data.user });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          // Token might be invalid, logout
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      checkTokenExpiration: () => {
        const { token, logout } = get();
        if (!token) {
          return false;
        }

        if (isTokenExpired(token)) {
          console.log('🚨 Token expired - logging out');
          logout();
          return true;
        }
        return false;
      },

      updateLastActivity: () => {
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },

      checkInactivity: () => {
        const { lastActivity, isAuthenticated, logout } = get();
        
        if (!isAuthenticated || !lastActivity) {
          return false;
        }

        const now = Date.now();
        const timeSinceLastActivity = now - lastActivity;

        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          console.log('⏰ Session expired due to inactivity (30 minutes)');
          console.log('   Last activity:', new Date(lastActivity).toLocaleString());
          console.log('   Current time:', new Date(now).toLocaleString());
          logout();
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate rehydrated state - fix inconsistencies
        if (state) {
          console.log('🔄 Rehydrating auth state:', state);
          
          // Check if token is expired
          if (state.token && isTokenExpired(state.token)) {
            console.warn('⚠️  Token expired during rehydration! Clearing auth state...');
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.lastActivity = null;
            console.log('✅ Auth state cleared due to expired token');
            return;
          }

          // Check for inactivity (30 minutes)
          if (state.lastActivity) {
            const now = Date.now();
            const timeSinceLastActivity = now - state.lastActivity;
            
            if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
              console.warn('⚠️  Session expired due to inactivity! Clearing auth state...');
              console.log('   Last activity:', new Date(state.lastActivity).toLocaleString());
              console.log('   Inactive for:', Math.floor(timeSinceLastActivity / 1000 / 60), 'minutes');
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
              state.lastActivity = null;
              console.log('✅ Auth state cleared due to inactivity');
              return;
            }
          }
          
          // If isAuthenticated is true but user or token is missing, fix it
          if (state.isAuthenticated && (!state.user || !state.token)) {
            console.warn('⚠️  Inconsistent auth state detected! Fixing...');
            console.warn('   isAuthenticated:', state.isAuthenticated);
            console.warn('   user:', state.user);
            console.warn('   token:', !!state.token);
            
            // Reset to unauthenticated state
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            console.log('✅ Auth state reset to unauthenticated');
          }
        }
      },
    }
  )
);
