import { useNavigate } from 'react-router-dom';
import { mockProfiles } from '../data/mockProfiles';
import { ChatMenu } from '../components/ChatMenu';
import { LogOut, MessageCircle, Home } from 'lucide-react';

export default function ChatMenuPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Convert profiles to chat format - only show matched people (who liked us)
  const chats = mockProfiles
    .filter((profile) => profile.likedUs)
    .map((profile) => ({
      id: profile.id,
      name: profile.name,
      lastMessage: `Hey! I'm ${profile.name}`,
      photo: profile.profilePhoto || '',
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-10 h-10 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-800">Wiadomości</h1>
          </div>
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

        <ChatMenu chats={chats} />
      </div>   
    </div>
  );
}
