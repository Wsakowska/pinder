import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { matchApi, messageApi, profileApi } from '../api/api';
import { Message, Match, Profile } from '../types/types';
import { ArrowLeft, Send } from 'lucide-react';
import { webSocketService, ChatMessage } from '../service/WebSocketService.ts';

export default function ChatPage() {
    const { matchId: matchIdParam } = useParams<{ matchId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [match, setMatch] = useState<Match | null>(null);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const matchId = matchIdParam ? parseInt(matchIdParam, 10) : NaN;

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let isSubscribed = true;

        if (!isNaN(matchId)) {
            loadData();
            connectWebSocket();
        } else {
            console.error('Invalid matchId:', matchIdParam);
            setLoading(false);
        }

        // Cleanup on unmount or matchId change
        return () => {
            isSubscribed = false;
            if (!isNaN(matchId)) {
                webSocketService.unsubscribeFromMatch(matchId);
            }
        };
    }, [matchId]);

    const connectWebSocket = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            // Connect if not already connected
            if (!webSocketService.isConnected()) {
                await webSocketService.connect(token);
            }

            setWsConnected(true);

            // Subscribe to this match's messages
            webSocketService.subscribeToMatch(matchId, (chatMessage: ChatMessage) => {
                console.log('Received WebSocket message:', chatMessage);

                // Convert ChatMessage to Message format
                const newMsg: Message = {
                    id: chatMessage.messageId,  // messageId -> id
                    matchId: chatMessage.matchId,
                    senderId: chatMessage.senderId,
                    senderName: chatMessage.senderName,
                    content: chatMessage.content,
                    sentAt: chatMessage.timestamp,  // timestamp -> sentAt
                    read: false
                };

                // Add message if not already in list
                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) {
                        return prev;
                    }
                    return [...prev, newMsg];
                });
            });
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            setWsConnected(false);
        }
    };

    const loadData = async () => {
        if (isNaN(matchId)) return;

        try {
            console.log('Loading chat for matchId:', matchId);

            const [matchData, messagesData, profileData] = await Promise.all([
                matchApi.getMatch(matchId),
                messageApi.getMessages(matchId),
                profileApi.getMyProfile()
            ]);

            console.log('Match data:', matchData);
            console.log('Messages data:', messagesData);

            setMatch(matchData);
            setMessages(messagesData);
            setMyProfile(profileData);
        } catch (err) {
            console.error('Failed to load chat:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isNaN(matchId) || sending || !myProfile) return;

        setSending(true);

        try {
            if (wsConnected && webSocketService.isConnected()) {
                // Send via WebSocket with senderId
                webSocketService.sendMessage(matchId, newMessage.trim(), myProfile.userId);
                setNewMessage('');
            } else {
                // Fallback to HTTP POST if WebSocket not connected
                console.warn('WebSocket not connected, using HTTP fallback');
                const message = await messageApi.sendMessage(matchId, newMessage.trim());
                console.log('Sent message via HTTP:', message);
                setMessages([...messages, message]);
                setNewMessage('');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Nie udało się wysłać wiadomości');
        } finally {
            setSending(false);
        }
    };

    // Helper function to format time with relative timestamps
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Teraz';
            }

            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            // Less than 1 minute
            if (diffMins < 1) {
                return 'Teraz';
            }
            // Less than 1 hour
            if (diffMins < 60) {
                return `${diffMins} min temu`;
            }
            // Less than 24 hours
            if (diffHours < 24) {
                return `${diffHours}h temu`;
            }
            // Less than 7 days
            if (diffDays < 7) {
                return `${diffDays}d temu`;
            }
            // Older - show date
            return date.toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'short'
            });
        } catch {
            return 'Teraz';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-2xl font-bold text-amber-800">Loading...</div>
            </div>
        );
    }

    if (isNaN(matchId)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-4">Invalid match ID</div>
                    <button
                        onClick={() => navigate('/matches')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                        Back to Matches
                    </button>
                </div>
            </div>
        );
    }

    if (!match || !myProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-4">Match not found</div>
                    <button
                        onClick={() => navigate('/matches')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                        Back to Matches
                    </button>
                </div>
            </div>
        );
    }

    const user = match.matchedUser || {};
    const name = user.name || 'Anonymous';
    const photo = user.profilePhoto;
    const occupation = user.occupation;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow p-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/matches')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    {/* Match Profile */}
                    <div className="flex items-center gap-3">
                        {photo ? (
                            <img
                                src={photo}
                                alt={name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {name[0] || 'U'}
                </span>
                            </div>
                        )}
                        <div>
                            <h2 className="font-bold text-gray-900">{name}</h2>
                            {occupation && (
                                <p className="text-sm text-gray-600">{occupation}</p>
                            )}
                        </div>
                    </div>

                    {/* WebSocket status */}
                    {wsConnected && (
                        <div className="ml-auto">
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Real-time
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* WebSocket status warning */}
                    {!wsConnected && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Real-time chat disconnected. Messages will be sent via fallback.
                            </p>
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Wyślij pierwszą wiadomość! 🍺</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => {
                                const isMe = message.senderId === myProfile.userId;
                                return (
                                    <div
                                        key={message.messageId}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                                isMe
                                                    ? 'bg-amber-600 text-white'
                                                    : 'bg-white text-gray-900'
                                            }`}
                                        >
                                            <p>{message.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    isMe ? 'text-amber-200' : 'text-gray-500'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Invisible div for scrolling to bottom */}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Napisz wiadomość..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        <span>Wyślij</span>
                    </button>
                </form>
            </div>
        </div>
    );
}