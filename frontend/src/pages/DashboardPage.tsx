import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, swipeApi } from '../api/api';
import { Profile } from '../types/types';
import SwipeCard from '../components/SwipeCard';
import { Beer, LogOut, MessageCircle, User } from 'lucide-react';

export default function DashboardPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [showMatch, setShowMatch] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileData, profilesData] = await Promise.all([
                profileApi.getMyProfile(),
                profileApi.getProfiles()
            ]);
            setMyProfile(profileData);
            setProfiles(profilesData);
        } catch (err) {
            console.error('Failed to load data:', err);
            // If unauthorized, redirect to login
            if (err instanceof Error && err.message.includes('401')) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (action: 'LIKE' | 'PASS') => {
        if (currentIndex >= profiles.length) return;

        const currentProfile = profiles[currentIndex];

        try {
            const result = await swipeApi.swipe(currentProfile.userId, action);

            if (result.match) {
                setShowMatch(true);
                setTimeout(() => setShowMatch(false), 3000);
            }

            setCurrentIndex(prev => prev + 1);
        } catch (err) {
            console.error('Swipe failed:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-2xl font-bold text-amber-800">Loading...</div>
            </div>
        );
    }

    const currentProfile = profiles[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Beer className="w-10 h-10 text-amber-600" />
                    <h1 className="text-3xl font-bold text-amber-800">BeerFinder</h1>
                </div>

                <div className="flex gap-3">
                    {/* My Profile */}
                    <button
                        onClick={() => navigate('/edit-profile')}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        {myProfile?.profilePhoto ? (
                            <img
                                src={myProfile.profilePhoto}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {myProfile?.name?.[0] || 'U'}
                </span>
                            </div>
                        )}
                        <span className="font-medium">{myProfile?.name || 'Profile'}</span>
                    </button>

                    {/* Messages */}
                    <button
                        onClick={() => navigate('/matches')}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Messages</span>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Swipe Card */}
            <div className="max-w-md mx-auto">
                {currentProfile ? (
                    <SwipeCard profile={currentProfile} onSwipe={handleSwipe} />
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Brak więcej profili!
                        </h2>
                        <p className="text-gray-600">Wróć później po nowe profile 🍺</p>
                    </div>
                )}
            </div>

            {/* Match Popup */}
            {showMatch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 text-center animate-bounce max-w-md">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            To match!
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Możesz teraz wysłać wiadomość!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}