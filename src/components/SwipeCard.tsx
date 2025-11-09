// src/components/SwipeCard.tsx
import type { Profile } from '../types/profile';
import { X, Heart } from 'lucide-react';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'PASS') => void;
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-96 relative bg-gray-200">
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-amber-200 flex items-center justify-center">
              <span className="text-6xl text-white font-bold">{profile.name[0]}</span>
            </div>
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
          onClick={() => onSwipe('PASS')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        <button
          onClick={() => onSwipe('LIKE')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
}