import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/api';
import { Profile } from '../types/types';
import { ArrowLeft, X, Plus } from 'lucide-react';

export default function EditProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [occupation, setOccupation] = useState('');
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileApi.getMyProfile();
            setProfile(data);
            setName(data.name || '');
            setAge(data.age?.toString() || '');
            setBio(data.bio || '');
            setOccupation(data.occupation || '');
            setInterests(data.interests || []);
            setProfilePhoto(data.profilePhoto || '');
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const addInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const removeInterest = (interest: string) => {
        setInterests(interests.filter(i => i !== interest));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await profileApi.updateProfile({
                name: name.trim() || null,
                age: age ? parseInt(age) : null,
                bio: bio.trim() || null,
                occupation: occupation.trim() || null,
                interests,
                profilePhoto: profilePhoto.trim() || null
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
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
                    <h1 className="text-3xl font-bold text-amber-800">Edytuj profil</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Profile Photo Preview */}
                    <div className="flex justify-center mb-8">
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {name?.[0] || 'U'}
                </span>
                            </div>
                        )}
                    </div>

                    {/* Profile Photo URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link do zdjęcia profilowego
                        </label>
                        <input
                            type="url"
                            value={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    {/* Name & Age */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imię
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Twoje imię"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Wiek
                            </label>
                            <input
                                type="number"
                                min="18"
                                max="100"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    {/* Occupation */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zawód
                        </label>
                        <input
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="np. Developer, Designer"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            O mnie
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                            placeholder="Opowiedz coś o sobie..."
                        />
                    </div>

                    {/* Interests */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zainteresowania
                        </label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Dodaj zainteresowanie..."
                            />
                            <button
                                type="button"
                                onClick={addInterest}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Dodaj
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <div
                                    key={interest}
                                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full flex items-center gap-2 text-sm font-medium"
                                >
                                    {interest}
                                    <button
                                        type="button"
                                        onClick={() => removeInterest(interest)}
                                        className="hover:text-amber-900"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}