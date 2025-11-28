export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
}

export interface UserRole {
  user_id: string;
  role: 'admin' | 'agent';
  created_at?: string;
}

export interface FEUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  id?: string; // For updates
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'agent';
}