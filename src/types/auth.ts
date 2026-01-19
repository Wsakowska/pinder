export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  age?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}