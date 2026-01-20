import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchApi } from '../api/api';
import { Match } from '../types/types';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            const data = await matchApi.getMatches();
            console.log('Matches loaded:', data);
            setMatches(data);
        } catch (err) {
            console.error('Failed to load matches:', err);
        } finally {
            setLoading(false);
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
                            // Backend zwraca matchedUser zamiast profile
                            const user = match.matchedUser || {};
                            const name = user.name || 'Anonymous';
                            const photo = user.profilePhoto;
                            const age = user.age;
                            const occupation = user.occupation;

                            return (
                                <button
                                    key={match.matchId}  // ✅ Backend używa matchId
                                    onClick={() => navigate(`/chat/${match.matchId}`)}  // ✅ matchId
                                    className="w-full bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center gap-4"
                                >
                                    {/* Profile Photo */}
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
                                    </div>

                                    {/* Message Icon */}
                                    <MessageCircle className="w-6 h-6 text-amber-600" />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}