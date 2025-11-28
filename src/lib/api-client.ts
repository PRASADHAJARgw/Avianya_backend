const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = {
  async post(endpoint: string, data: FormData | Record<string, unknown>) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    let body: FormData | string;
    const headers: Record<string, string> = {};
    
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response;
  },

  async get(endpoint: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response;
  }
};