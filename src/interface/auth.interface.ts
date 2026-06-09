export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  created_at: string;
}

export interface UserResponse {
  data: User;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  full_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
