import type { AuthResponse, Profile, SwipeResponse, Match, Message } from '../types/types';

const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// Auth API
export const authApi = {
    async register(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(error.message || 'Registration failed');
        }
        return res.json();
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message || 'Login failed');
        }
        return res.json();
    }
};

// Profile API
export const profileApi = {
    async getMyProfile(): Promise<Profile> {
        const res = await fetch(`${API_BASE}/users/me`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        const res = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
    },

    async getProfiles(minAge?: number, maxAge?: number, maxDistance?: number | null): Promise<Profile[]> {
        // Build query parameters
        const params = new URLSearchParams();

        if (minAge !== undefined && minAge !== 18) {
            params.append('minAge', minAge.toString());
        }

        if (maxAge !== undefined && maxAge !== 99) {
            params.append('maxAge', maxAge.toString());
        }

        if (maxDistance !== null && maxDistance !== undefined) {
            params.append('maxDistance', maxDistance.toString());
        }

        const queryString = params.toString();
        const url = `${API_BASE}/users/discover${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch profiles');
        return res.json();
    }
};

// Swipe API
export const swipeApi = {
    async swipe(swipedUserId: number, action: 'LIKE' | 'PASS'): Promise<SwipeResponse> {
        const res = await fetch(`${API_BASE}/swipes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ swipedUserId, action })
        });
        if (!res.ok) throw new Error('Swipe failed');
        return res.json();
    }
};

// Match API
export const matchApi = {
    async getMatches(): Promise<Match[]> {
        const res = await fetch(`${API_BASE}/matches`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch matches');
        return res.json();
    },

    async getMatch(matchId: number): Promise<Match> {
        const res = await fetch(`${API_BASE}/matches/${matchId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch match');
        return res.json();
    }
};

// Message API
export const messageApi = {
    async getMessages(matchId: number): Promise<Message[]> {
        const res = await fetch(`${API_BASE}/messages/${matchId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
    },

    async sendMessage(matchId: number, content: string): Promise<Message> {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ matchId, content })
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    },

    async getUnreadCount(matchId: number): Promise<number> {
        const res = await fetch(`${API_BASE}/messages/${matchId}/unread`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch unread count');
        return res.json();
    }
};