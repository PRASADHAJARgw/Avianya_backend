// API client for backend communication
const API_BASE_URL = 'http://localhost:8080/api/v2';

// Get token from auth store
const getToken = () => {
  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) return null;
  
  try {
    const { state } = JSON.parse(authStorage);
    return state?.token || null;
  } catch {
    return null;
  }
};

// Generic fetch wrapper with auth
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: (data: {
    email: string;
    password: string;
    name: string;
    organization_name: string;
  }) => apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email: string; password: string }) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => apiFetch('/auth/me'),
};

// User Management API (Admin only)
export const userApi = {
  list: () => apiFetch('/users'),

  create: (data: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'manager' | 'user';
  }) =>
    apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (userId: string) => apiFetch(`/users/${userId}`),

  update: (userId: string, data: {
    name?: string;
    role?: 'admin' | 'manager' | 'user';
    is_active?: boolean;
  }) =>
    apiFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (userId: string) =>
    apiFetch(`/users/${userId}`, {
      method: 'DELETE',
    }),
};

// WhatsApp Chat API
export const chatApi = {
  list: () => apiFetch('/whatsapp/chats'),

  create: (data: {
    chat_name: string;
    phone_number: string;
    is_shared?: boolean;
  }) =>
    apiFetch('/whatsapp/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (chatId: string) => apiFetch(`/whatsapp/chats/${chatId}`),

  update: (chatId: string, data: {
    chat_name?: string;
    phone_number?: string;
    is_shared?: boolean;
  }) =>
    apiFetch(`/whatsapp/chats/${chatId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (chatId: string) =>
    apiFetch(`/whatsapp/chats/${chatId}`, {
      method: 'DELETE',
    }),
};

// Audit Log API (Admin only)
export const auditApi = {
  list: (filters?: {
    action?: string;
    user_id?: string;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return apiFetch(`/audit/logs?${params.toString()}`);
  },

  stats: () => apiFetch('/audit/stats'),
};

export { apiFetch };
