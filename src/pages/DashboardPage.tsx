// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { mockProfiles } from '../data/mockProfiles';
import type { Profile } from '../types/profile';
import SwipeCard from '../components/SwipeCard';
import { Beer, LogOut, User, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [current, setCurrent] = useState<Profile | null>(null);
  const navigate = useNavigate();

  // Get user profile from localStorage
  const userProfile = localStorage.getItem('userProfile')
    ? JSON.parse(localStorage.getItem('userProfile')!)
    : { name: 'User', profilePhoto: 'https://randomuser.me/api/portraits/women/1.jpg' };

  useEffect(() => {
    setProfiles([...mockProfiles]);
    setCurrent(mockProfiles[0] || null);
  }, []);

  const handleSwipe = (action: 'LIKE' | 'PASS') => {
    if (!current) return;
    const next = profiles.slice(1);
    setProfiles(next);
    setCurrent(next[0] || null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 relative">
      {/* User Profile Card - Over Wyloguj Button */}
      <div className="absolute top-4 right-20 bg-white rounded-full shadow-lg p-2 flex items-center gap-3 hover:shadow-xl transition cursor-pointer" onClick={() => navigate('/edit-profile')}>
        {userProfile.profilePhoto ? (
          <img
            src={userProfile.profilePhoto}
            alt={userProfile.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">{userProfile.name[0]}</span>
          </div>
        )}
        <span className="text-sm font-semibold text-gray-800 pr-2">{userProfile.name}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Beer className="w-10 h-10 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-800">BeerFinder</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/messages')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <MessageCircle className="w-5 h-5" />
              Wiadomości
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <LogOut className="w-5 h-5" />
              Wyloguj się
            </button>
          </div>
        </div>

        {current ? (
          <SwipeCard profile={current} onSwipe={handleSwipe} />
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800">Brak więcej profili!</h2>
              <p className="text-gray-600 mt-2">Wróć później</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}