// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { mockProfiles } from '../data/mockProfiles';
import type { Profile } from '../types/profile';
import SwipeCard from '../components/SwipeCard';
import { Beer, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [current, setCurrent] = useState<Profile | null>(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Beer className="w-10 h-10 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-800">BeerFinder</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <LogOut className="w-5 h-5" />
            Wyloguj
          </button>
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