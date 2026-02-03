import { Client, IMessage } from '@stomp/stompjs';

export interface ChatMessage {
    messageId: number;  // Changed from 'id' to match backend
    matchId: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;  // Changed from 'sentAt' to match backend
}

export interface TypingIndicator {
    matchId: number;
    userId: number;
    userName: string;
    isTyping: boolean;
}

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<number, (message: ChatMessage) => void> = new Map();
    private typingSubscriptions: Map<number, (indicator: TypingIndicator) => void> = new Map();

    connect(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('WebSocket connected');
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    reject(new Error('WebSocket connection failed'));
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                },
                onWebSocketClose: () => {
                    console.log('WebSocket closed');
                }
            });

            this.client.activate();
        });
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.subscriptions.clear();
            this.typingSubscriptions.clear();
        }
    }

    subscribeToMatch(matchId: number, callback: (message: ChatMessage) => void): void {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return;
        }

        // Unsubscribe previous callback if exists
        this.unsubscribeFromMatch(matchId);

        // Subscribe to the match topic
        this.client.subscribe(`/topic/matches/${matchId}`, (message: IMessage) => {
            try {
                const chatMessage: ChatMessage = JSON.parse(message.body);
                callback(chatMessage);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        this.subscriptions.set(matchId, callback);
    }

    subscribeToTyping(matchId: number, callback: (indicator: TypingIndicator) => void): void {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return;
        }

        // Subscribe to typing indicators for this match
        this.client.subscribe(`/topic/matches/${matchId}/typing`, (message: IMessage) => {
            try {
                const typingIndicator: TypingIndicator = JSON.parse(message.body);
                callback(typingIndicator);
            } catch (error) {
                console.error('Failed to parse typing indicator:', error);
            }
        });

        this.typingSubscriptions.set(matchId, callback);
    }

    unsubscribeFromMatch(matchId: number): void {
        this.subscriptions.delete(matchId);
    }

    unsubscribeFromTyping(matchId: number): void {
        this.typingSubscriptions.delete(matchId);
    }

    sendMessage(matchId: number, content: string, senderId: number): void {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.client.publish({
            destination: `/app/chat/${matchId}`,
            body: JSON.stringify({
                content,
                senderId  // Include senderId for fallback
            })
        });
    }

    sendTypingIndicator(matchId: number, userId: number, userName: string, isTyping: boolean): void {
        if (!this.client || !this.client.connected) {
            console.debug('WebSocket not connected, cannot send typing indicator');
            return;
        }

        console.log(`Sending typing indicator: ${userName} (${userId}) is ${isTyping ? 'typing' : 'stopped'} in match ${matchId}`);

        this.client.publish({
            destination: `/app/typing/${matchId}`,
            body: JSON.stringify({
                userId,
                userName,
                isTyping
            })
        });
    }

    isConnected(): boolean {
        return this.client !== null && this.client.connected;
    }
}

// Singleton instance
export const webSocketService = new WebSocketService();