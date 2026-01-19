import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X, Plus, Home } from 'lucide-react';

interface ProfileFormData {
  name: string;
  age: number;
  occupation: string;
  bio: string;
  interests: string[];
  profilePhoto: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: 'Your Name',
    age: 25,
    occupation: 'Your Job',
    bio: 'Tell us about yourself',
    interests: ['Travel', 'Music', 'Sports'],
    profilePhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
  });

  const [newInterest, setNewInterest] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: e.target.value,
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('userProfile', JSON.stringify(formData));
    alert('Profile saved successfully!');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">Edytuj profil</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <Home className="w-5 h-5" />
              Strona główna
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Profile Photo Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Zdjęcie profilowe</h2>
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {formData.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Prześlij zdjęcie
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Lub link do zdjęcia
                  </span>
                  <input
                    type="url"
                    value={formData.profilePhoto}
                    onChange={handlePhotoUrlChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </label>
              </div>
            </div>
          </div>

          <hr className="my-8" />

          {/* Name and Age */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imię
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wiek
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="np. Inżynier, Projektant, itp."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O mnie / Opis
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Opowiedz nam o sobie..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
            />
          </div>

          {/* Interests/Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zainteresowania / Tagi
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                placeholder="Dodaj zainteresowanie..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button
                onClick={addInterest}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Dodaj
              </button>
            </div>

            {/* Display interests as tags */}
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <div
                  key={interest}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full flex items-center gap-2 text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="hover:text-amber-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
            >
              Zapisz zmiany
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
