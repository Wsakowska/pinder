// src/components/SwipeCard.tsx
import type { Profile } from '../types/profile.ts';
import { X, Beer } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'PASS') => void;
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const navigate = useNavigate();
  const [swipeAction, setSwipeAction] = useState<'LIKE' | 'PASS' | null>(null);
  const [showMatch, setShowMatch] = useState(false);

  // Get current user profile from localStorage
  const userProfile = localStorage.getItem('userProfile')
    ? JSON.parse(localStorage.getItem('userProfile')!)
    : { name: 'You', profilePhoto: 'https://randomuser.me/api/portraits/women/1.jpg' };

  const handleSwipe = (action: 'LIKE' | 'PASS') => {
    setSwipeAction(action);
    
    // Show match popup if both liked each other
    if (action === 'LIKE' && profile.likedUs) {
      setTimeout(() => {
        setShowMatch(true);
      }, 150);
    } else {
      // Only proceed to next profile immediately if NOT a match
      setTimeout(() => {
        onSwipe(action);
        setSwipeAction(null);
      }, 300);
    }
  };

  const handleCloseMatch = () => {
    setShowMatch(false);
    setSwipeAction(null);
    // Call onSwipe after closing the match modal
    onSwipe('LIKE');
  };

  const handleSendMessage = () => {
    setShowMatch(false);
    setSwipeAction(null);
    // Navigate to chat with this person
    navigate(`/chat/${profile.id}`);
  };

  return (
    <div className="max-w-md mx-auto relative">
      <style>{`
        @keyframes shine {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shine-text {
          background: linear-gradient(
            90deg,
            #ff6b6b 0%,
            #ffd93d 25%,
            #6bcf7f 50%,
            #4d96ff 75%,
            #ff6b6b 100%
          );
          background-size: 1000px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shine 2s infinite;
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .scale-in {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>

      {/* Match Popup Modal */}
      {showMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="scale-in bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseMatch}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Match Title */}
            <div className="text-center mb-8">
              <div className="text-6xl font-black shine-text mb-4">MATCH!</div>
              <p className="text-gray-600 text-lg">Polubiście się wzajemnie!</p>
            </div>

            {/* Profile Photos */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {/* User Photo */}
              <div className="flex flex-col items-center gap-2">
                {userProfile.profilePhoto ? (
                  <img
                    src={userProfile.profilePhoto}
                    alt={userProfile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-400"
                  />
                ) : (
                  <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center border-4 border-amber-400">
                    <span className="text-4xl font-bold text-white">
                      {userProfile.name[0]}
                    </span>
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-700">{userProfile.name}</p>
              </div>

              {/* Beer Icon */}
              <div className="text-4xl animate-bounce">🍻</div>

              {/* Matched Profile Photo */}
              <div className="flex flex-col items-center gap-2">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-400"
                  />
                ) : (
                  <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center border-4 border-green-400">
                    <span className="text-4xl font-bold text-white">
                      {profile.name[0]}
                    </span>
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-700">{profile.name}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate(`/chat/${profile.id}`)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition"
            >
              Wyślij wiadomość
            </button>
          </div>
        </div>
      )}

      <div
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          swipeAction === 'LIKE'
            ? 'translate-x-64 scale-95'
            : swipeAction === 'PASS'
            ? '-translate-x-64 scale-95'
            : 'translate-x-0'
        }`}
        style={{
          filter:
            swipeAction === 'LIKE'
              ? 'brightness(0.9) drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))'
              : swipeAction === 'PASS'
              ? 'brightness(0.9) drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))'
              : 'brightness(1) drop-shadow(0 0 0px transparent)',
        }}
      >
        <div className="h-96 relative bg-gray-200">
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                swipeAction === 'LIKE' ? 'brightness-125 hue-rotate-12' : swipeAction === 'PASS' ? 'brightness-75 hue-rotate-12' : ''
              }`}
              style={{
                filter:
                  swipeAction === 'LIKE'
                    ? 'hue-rotate(120deg) saturate(1.2)'
                    : swipeAction === 'PASS'
                    ? 'hue-rotate(0deg) saturate(0.8) brightness(0.8)'
                    : 'none',
              }}
            />
          ) : (
            <div className="w-full h-full bg-amber-200 flex items-center justify-center">
              <span className="text-6xl text-white font-bold">{profile.name[0]}</span>
            </div>
          )}
          {/* Overlay shade effect */}
          {swipeAction === 'LIKE' && (
            <div className="absolute inset-0 bg-green-500 opacity-20 pointer-events-none" />
          )}
          {swipeAction === 'PASS' && (
            <div className="absolute inset-0 bg-red-500 opacity-20 pointer-events-none" />
          )}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow">
            <span className="text-sm font-bold text-amber-600">{profile.distance} km</span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900">{profile.name}, {profile.age}</h3>
          <p className="text-amber-600 font-medium">{profile.occupation}</p>
          <p className="text-gray-700 mt-2">{profile.bio}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.interests.map((i, idx) => (
              <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-8">
        <button
          onClick={() => handleSwipe('PASS')}
          disabled={swipeAction !== null || showMatch}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        <button
          onClick={() => handleSwipe('LIKE')}
          disabled={swipeAction !== null || showMatch}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Beer className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
}