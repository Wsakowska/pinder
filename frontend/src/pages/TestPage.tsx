// src/pages/TestPage.tsx
import { useEffect, useState } from 'react';
import { authApi } from '../api/auth.ts';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.tsx';

export default function TestPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await authApi.test();
        setMessage(data.message);
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Nie jesteś zalogowany. Przekierowanie...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-amber-700">Test połączenia</h2>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-600"></div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg">
            <strong>Sukces!</strong> {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition"
        >
          Wyloguj się
        </button>
      </div>
    </AuthLayout>
  );
}