import { Profile } from '../types/types.ts';
import { Heart, X } from 'lucide-react';

interface SwipeCardProps {
    profile: Profile;
    onSwipe: (action: 'LIKE' | 'PASS') => void;
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Photo */}
            <div className="relative h-96 bg-gradient-to-br from-amber-200 to-orange-200">
                {profile.profilePhoto ? (
                    <img
                        src={profile.profilePhoto}
                        alt={profile.name || 'Profile'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-bold text-white">
              {profile.name?.[0] || 'U'}
            </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {profile.name || 'Anonymous'}
                    </h2>
                    {profile.age && (
                        <span className="text-2xl text-gray-600">{profile.age}</span>
                    )}
                </div>

                {profile.occupation && (
                    <p className="text-gray-700 font-medium mb-2">{profile.occupation}</p>
                )}

                {profile.bio && (
                    <p className="text-gray-600 mb-4">{profile.bio}</p>
                )}

                {profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {profile.interests.map((interest) => (
                            <span
                                key={interest}
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                            >
                {interest}
              </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => onSwipe('PASS')}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                    >
                        <X className="w-8 h-8 text-gray-600" />
                        <span className="text-lg font-semibold text-gray-700">Pass</span>
                    </button>

                    <button
                        onClick={() => onSwipe('LIKE')}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-xl transition"
                    >
                        <Heart className="w-8 h-8 text-white" />
                        <span className="text-lg font-semibold text-white">Like</span>
                    </button>
                </div>
            </div>
        </div>
    );
}