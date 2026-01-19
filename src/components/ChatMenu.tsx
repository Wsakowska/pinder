import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    photo: string;
}

interface ChatMenuProps {
    chats: Chat[];
}

export const ChatMenu: React.FC<ChatMenuProps> = ({ chats }) => {
    const navigate = useNavigate();

    const handleChatClick = (chatId: string) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="space-y-4">
            {chats.map((chat) => (
                <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 text-left"
                >
                    <div className="flex items-center gap-4">
                        {chat.photo ? (
                            <img src={chat.photo} alt={chat.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                        ) : (
                            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl font-bold text-white">{chat.name[0]}</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">{chat.name}</h3>
                            <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};