import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { matchApi, messageApi, profileApi } from '../api/api';
import { Message, Match, Profile } from '../types/types';
import { ArrowLeft, Send } from 'lucide-react';

export default function ChatPage() {
    const { matchId: matchIdParam } = useParams<{ matchId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [match, setMatch] = useState<Match | null>(null);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    const matchId = matchIdParam ? parseInt(matchIdParam, 10) : NaN;

    useEffect(() => {
        if (!isNaN(matchId)) {
            loadData();
        } else {
            console.error('Invalid matchId:', matchIdParam);
            setLoading(false);
        }
    }, [matchId]);

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
        if (!newMessage.trim() || isNaN(matchId) || sending) return;

        setSending(true);

        try {
            const message = await messageApi.sendMessage(matchId, newMessage.trim());
            console.log('Sent message:', message);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    // Helper function to format time safely
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Just now';
            }
            return date.toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Just now';
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
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Wyślij pierwszą wiadomość! 🍺</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMe = message.senderId === myProfile.userId;
                            return (
                                <div
                                    key={message.id}
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
                                            {formatTime(message.sentAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
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