
import React from 'react';
import { NewChatIcon } from './icons/NewChatIcon';

interface HeaderProps {
    onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm z-10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg"></div>
        <h1 className="text-xl font-bold text-gray-200">Gemini AI Chat</h1>
      </div>
      <button 
        onClick={onNewChat}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        <NewChatIcon className="w-4 h-4" />
        <span>New Chat</span>
      </button>
    </header>
  );
};
