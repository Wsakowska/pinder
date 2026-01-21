import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/api';
import { Profile } from '../types/types';
import { ArrowLeft, X, Plus, Upload, Trash2, MapPin, Loader, Map } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

export default function EditProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [occupation, setOccupation] = useState('');
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    // Photo upload states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Geolocation states
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

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
            setLatitude(data.latitude);
            setLongitude(data.longitude);
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Plik jest za duży. Maksymalny rozmiar to 5MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setUploadError('Można wgrać tylko pliki graficzne.');
            return;
        }

        setSelectedFile(file);
        setUploadError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadPhoto = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadError(null);

        try {
            const photoUrl = await profileApi.uploadProfilePhoto(selectedFile);
            setProfilePhoto(photoUrl);
            setSelectedFile(null);
            setPreviewUrl(null);
            alert('Zdjęcie zostało wgrane!');
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Nie udało się wgrać zdjęcia');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!window.confirm('Czy na pewno chcesz usunąć zdjęcie profilowe?')) {
            return;
        }

        setUploading(true);
        try {
            await profileApi.deleteProfilePhoto();
            setProfilePhoto('');
            alert('Zdjęcie zostało usunięte');
        } catch (err) {
            alert('Nie udało się usunąć zdjęcia');
        } finally {
            setUploading(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Twoja przeglądarka nie obsługuje geolokalizacji');
            return;
        }

        setGettingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setGettingLocation(false);
            },
            (error) => {
                setLocationError('Nie udało się pobrać lokalizacji. Sprawdź uprawnienia.');
                setGettingLocation(false);
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
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
                profilePhoto: profilePhoto.trim() || null,
                latitude,
                longitude
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Nie udało się zapisać profilu');
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
        <>
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
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

                        {/* Profile Photo Section */}
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Zdjęcie profilowe</h2>

                            <div className="flex justify-center mb-6">
                                {previewUrl || profilePhoto ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrl || profilePhoto}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-amber-200"
                                        />
                                        {profilePhoto && !previewUrl && (
                                            <button
                                                type="button"
                                                onClick={handleDeletePhoto}
                                                disabled={uploading}
                                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 bg-amber-200 rounded-full flex items-center justify-center border-4 border-amber-300">
                                        <span className="text-6xl font-bold text-white">
                                            {name?.[0] || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {selectedFile ? (
                                <div className="space-y-3">
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <strong>Wybrany plik:</strong> {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Rozmiar: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleUploadPhoto}
                                            disabled={uploading}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    Wgrywanie...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-5 h-5" />
                                                    Wgraj zdjęcie
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition"
                                >
                                    <Upload className="w-5 h-5" />
                                    Wybierz zdjęcie
                                </button>
                            )}

                            {uploadError && (
                                <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {uploadError}
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Max 5MB • JPG, PNG, GIF, WEBP
                            </p>
                        </div>

                        {/* Basic Info */}
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Podstawowe informacje</h2>

                            <div className="grid grid-cols-2 gap-4 mb-4">
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

                            <div className="mb-4">
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

                            <div>
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
                        </div>

                        {/* Interests */}
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Zainteresowania</h2>

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

                        {/* Location */}
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Lokalizacja</h2>

                            {latitude && longitude ? (
                                <div className="bg-green-50 p-4 rounded-lg mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                📍 Lokalizacja ustawiona
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLatitude(null);
                                                setLongitude(null);
                                            }}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                    <p className="text-sm text-amber-800">
                                        ℹ️ Ustaw swoją lokalizację, aby znaleźć osoby w pobliżu
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                                >
                                    {gettingLocation ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Pobieranie...
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="w-5 h-5" />
                                            Auto
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition"
                                >
                                    <Map className="w-5 h-5" />
                                    Wybierz na mapie
                                </button>
                            </div>

                            {locationError && (
                                <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {locationError}
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Twoja dokładna lokalizacja nie jest udostępniana
                            </p>
                        </div>

                        {/* Submit Buttons */}
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

            {/* Location Picker Modal */}
            {showLocationPicker && (
                <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={(lat, lng) => {
                        setLatitude(lat);
                        setLongitude(lng);
                    }}
                    onClose={() => setShowLocationPicker(false)}
                />
            )}
        </>
    );
}