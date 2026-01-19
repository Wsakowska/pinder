import { useNavigate, useParams } from 'react-router-dom';
import { mockProfiles } from '../data/mockProfiles.ts';
import { mockMessages } from '../data/mockMessages.ts';
import { LogOut, ArrowLeft, Send, Menu, X, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatMenu } from '../components/ChatMenu.tsx';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const profile = mockProfiles.find((p) => p.id === id);

  // Update messages when the id changes
  useEffect(() => {
    const conversation = mockMessages.find((c) => c.profileId === id);
    setMessages(conversation?.messages || []);
  }, [id]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Chat not found</h2>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: inputValue,
          sender: 'user',
          timestamp: new Date(),
        },
      ]);
      setInputValue('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Convert profiles to chat format for sidebar
  const chats = mockProfiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    lastMessage: `Hey! I'm ${profile.name}`,
    photo: profile.profilePhoto || '',
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Wiadomości</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMenu chats={chats} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <div className="flex items-center gap-3">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{profile.name[0]}</span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
              </div>
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white shadow-md p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
