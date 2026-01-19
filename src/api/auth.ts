// src/api/auth.ts
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

// FAKE TOKEN (dla mocków)
const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Symuluj opóźnienie
    await new Promise(r => setTimeout(r, 800));

    // Fake sukces
    console.log('Rejestracja (mock):', data.email);
    return {
      token: FAKE_TOKEN,
      user: { id: 1, email: data.email }
    };
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 800));

    if (data.email && data.password) {
      console.log('Logowanie (mock):', data.email);
      return {
        token: FAKE_TOKEN,
        user: { id: 1, email: data.email }
      };
    }

    throw new Error('Nieprawidłowy email lub hasło');
  },

  async test(): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    if (token === FAKE_TOKEN) {
      return { message: 'Mock: Połączenie działa!' };
    }
    throw new Error('Brak tokenu');
  },
};