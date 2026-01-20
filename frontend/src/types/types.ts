export interface AuthResponse {
    token: string;
    type: string;
    userId: number;
    email: string;
}

export interface Profile {
    id: number;
    userId: number;
    name: string | null;
    age: number | null;
    bio: string | null;
    occupation: string | null;
    interests: string[];
    profilePhoto: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface SwipeResponse {
    match: boolean;
    matchId?: number;
}

export interface Match {
    matchId: number;
    matchedUser: Profile;
    isActive: boolean;
    createdAt: string;
}

export interface Message {
    id: number;
    matchId: number;
    senderId: number;
    content: string;
    sentAt: string;
    senderName: string;
}