import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchApi, messageApi } from '../api/api';
import { Match } from '../types/types';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface MatchWithUnread extends Match {
    unreadCount?: number;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<MatchWithUnread[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        setLoading(true);
        try {
            const data = await matchApi.getMatches();
            console.log('Matches loaded:', data);

            // Set matches immediately so they display
            setMatches(data.map(match => ({ ...match, unreadCount: 0 })));

            // Then try to load unread counts in background (non-blocking)
            loadUnreadCounts(data);
        } catch (err) {
            console.error('Failed to load matches:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCounts = async (matchList: Match[]) => {
        // Load unread counts one by one, updating state as we go
        for (let i = 0; i < matchList.length; i++) {
            const match = matchList[i];
            try {
                const unreadCount = await messageApi.getUnreadCount(match.matchId);

                // Update only this specific match
                setMatches(prevMatches =>
                    prevMatches.map(m =>
                        m.matchId === match.matchId
                            ? { ...m, unreadCount }
                            : m
                    )
                );
            } catch (err) {
                console.error(`Failed to load unread count for match ${match.matchId}:`, err);
                // Continue with other matches even if one fails
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-2xl font-bold text-amber-800">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition"
                    >
                        <ArrowLeft className="w-6 h-6 text-amber-800" />
                    </button>
                    <h1 className="text-3xl font-bold text-amber-800">Your Matches</h1>
                </div>

                {/* Matches List */}
                {matches.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="text-6xl mb-4">🍺</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Brak matchów
                        </h2>
                        <p className="text-gray-600">
                            Zacznij swipe'ować żeby znaleźć matche!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match) => {
                            const user = match.matchedUser || {};
                            const name = user.name || 'Anonymous';
                            const photo = user.profilePhoto;
                            const age = user.age;
                            const occupation = user.occupation;
                            const unreadCount = match.unreadCount || 0;
                            const hasUnread = unreadCount > 0;

                            return (
                                <button
                                    key={match.matchId}
                                    onClick={() => navigate(`/chat/${match.matchId}`)}
                                    className="w-full bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center gap-4 relative"
                                >
                                    {/* Profile Photo */}
                                    <div className="relative">
                                        {photo ? (
                                            <img
                                                src={photo}
                                                alt={name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">
                                                    {name[0] || 'U'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Unread Badge on Photo - only show if > 0 */}
                                        {hasUnread && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {name}
                                            </h3>
                                            {age && (
                                                <span className="text-gray-600">{age}</span>
                                            )}
                                        </div>
                                        {occupation && (
                                            <p className="text-sm text-gray-600">{occupation}</p>
                                        )}
                                        {hasUnread && (
                                            <p className="text-xs text-amber-600 font-semibold mt-1">
                                                {unreadCount} nowa wiadomość{unreadCount > 1 ? 'i' : ''}
                                            </p>
                                        )}
                                    </div>

                                    {/* Message Icon */}
                                    <div className="relative">
                                        <MessageCircle className="w-6 h-6 text-amber-600" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}