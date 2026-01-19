import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.ts';

const API_BASE = 'http://localhost:8080/api/auth'; // Zmień na swój backend

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }

    return res.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }

    return res.json();
  },

  async test(): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/test`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Test failed');
    return res.json();
  },
};