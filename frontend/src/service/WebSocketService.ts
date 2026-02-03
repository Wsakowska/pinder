import { Client, IMessage } from '@stomp/stompjs';

export interface ChatMessage {
    messageId: number;  // Changed from 'id' to match backend
    matchId: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;  // Changed from 'sentAt' to match backend
}

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<number, (message: ChatMessage) => void> = new Map();

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

    unsubscribeFromMatch(matchId: number): void {
        this.subscriptions.delete(matchId);
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

    isConnected(): boolean {
        return this.client !== null && this.client.connected;
    }
}

// Singleton instance
export const webSocketService = new WebSocketService();