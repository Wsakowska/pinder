import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, swipeApi } from '../api/api';
import { Profile } from '../types/types';
import SwipeCard from '../components/SwipeCard';
import { Beer, LogOut, MessageCircle, User, SlidersHorizontal } from 'lucide-react';

export default function DashboardPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [myProfile, setMyProfile] = useState<Profile | null>(null);
    const [showMatch, setShowMatch] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [minAge, setMinAge] = useState<number>(18);
    const [maxAge, setMaxAge] = useState<number>(99);
    const [maxDistance, setMaxDistance] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const profileData = await profileApi.getMyProfile();
            setMyProfile(profileData);

            // Initial load without filters
            const profilesData = await profileApi.getProfiles();
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

    const loadProfiles = async () => {
        try {
            const profilesData = await profileApi.getProfiles(minAge, maxAge, maxDistance);
            setProfiles(profilesData);
            setCurrentIndex(0);
        } catch (err) {
            console.error('Failed to load profiles:', err);
        }
    };

    const applyFilters = async () => {
        setLoading(true);
        await loadProfiles();
        setLoading(false);
        setShowFilters(false);
    };

    const clearFilters = async () => {
        setMinAge(18);
        setMaxAge(99);
        setMaxDistance(null);
        setLoading(true);
        await loadProfiles();
        setLoading(false);
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
    const hasActiveFilters = minAge !== 18 || maxAge !== 99 || maxDistance !== null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Beer className="w-10 h-10 text-amber-600" />
                    <h1 className="text-3xl font-bold text-amber-800">BeerFinder</h1>
                </div>

                <div className="flex gap-3">
                    {/* Filters */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:shadow-md transition ${
                            hasActiveFilters
                                ? 'bg-amber-600 text-white'
                                : 'bg-white text-gray-900'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span className="font-medium">Filtry</span>
                        {hasActiveFilters && (
                            <span className="bg-white text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                !
                            </span>
                        )}
                    </button>

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

            {/* Filters Panel */}
            {showFilters && (
                <div className="max-w-md mx-auto mb-8 bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Filtry</h3>

                    {/* Age Range */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Wiek: {minAge} - {maxAge}
                        </label>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Minimalny wiek
                                </label>
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={minAge}
                                    onChange={(e) => setMinAge(parseInt(e.target.value))}
                                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Maksymalny wiek
                                </label>
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={maxAge}
                                    onChange={(e) => setMaxAge(parseInt(e.target.value))}
                                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Distance */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksymalna odległość (km)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="1"
                                max="500"
                                value={maxDistance || ''}
                                onChange={(e) => setMaxDistance(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="Bez limitu"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            {maxDistance && (
                                <button
                                    onClick={() => setMaxDistance(null)}
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Wyczyść
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Pozostaw puste dla wszystkich odległości
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={applyFilters}
                            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                        >
                            Zastosuj
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Wyczyść
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Swipe Card */}
            <div className="max-w-md mx-auto">
                {currentProfile ? (
                    <SwipeCard profile={currentProfile} onSwipe={handleSwipe} />
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Brak więcej profili!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {hasActiveFilters
                                ? 'Spróbuj zmienić filtry'
                                : 'Wróć później po nowe profile 🍺'
                            }
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                            >
                                Wyczyść filtry
                            </button>
                        )}
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