
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
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = 'http://localhost:8080/api/v2';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

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
        // Optional: Call backend logout endpoint
        const { token } = get();
        if (token) {
          fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).catch(console.error);
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate rehydrated state - fix inconsistencies
        if (state) {
          console.log('🔄 Rehydrating auth state:', state);
          
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
