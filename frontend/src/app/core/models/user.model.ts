export interface User {
  id: number;
  email: string;
  title?: string;
  first_name: string;
  maiden_name?: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  email_confirmed_at?: string;
  banned_at?: string;
  activated_at?: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
}

export type UserRole = 'admin' | 'rider' | 'club' | 'show_holding_body' | 'saef_admin' | 'official';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  title?: string;
  role?: UserRole;
}

