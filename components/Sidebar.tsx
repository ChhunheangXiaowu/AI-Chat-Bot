import React, { useState, useRef, useEffect } from 'react';
import type { ChatHistory } from '../types';
import { User } from 'firebase/auth';
import { NewChatIcon } from './icons/NewChatIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { VideoIcon } from './icons/VideoIcon';
import { XIcon } from './icons/XIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { useI18n } from '../contexts/i18n';

interface SidebarProps {
  history: ChatHistory[];
  activeChatId: string | null;
  activeView: 'chat' | 'image' | 'video';
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onShowImageGenerator: () => void;
  onShowVideoGenerator: () => void;
  onShowSettings: () => void;
  user: User | null;
  onSignOut: () => void;
  onClose: () => void;
}

const ChatHistoryItem: React.FC<{
  item: ChatHistory;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ item, isActive, onSelect, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 group ${
        isActive ? 'bg-white dark:bg-gray-700/80' : 'hover:bg-white dark:hover:bg-gray-700/50'
      }`}
    >
      <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{item.title || t('newChat')}</p>
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(prev => !prev);
          }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-opacity"
          aria-label="Chat options"
        >
          <DotsVerticalIcon className="w-5 h-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-6 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-md"
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ 
    history, 
    activeChatId, 
    activeView, 
    onNewChat, 
    onSelectChat, 
    onDeleteChat,
    onShowImageGenerator,
    onShowVideoGenerator,
    onShowSettings,
    user,
    onSignOut,
    onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useI18n();

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full sm:w-72 bg-gray-100 dark:bg-gray-900/70 backdrop-blur-md border-r border-gray-200 dark:border-gray-700/50 flex flex-col p-3 flex-shrink-0 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg"></div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('geminiAi')}</h1>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onNewChat}
                className="p-2 bg-white dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 transition-colors duration-200"
                aria-label={t('newChat')}
            >
                <NewChatIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 md:hidden"
                aria-label="Close menu"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4 px-1 space-y-2">
        <button
            onClick={onShowImageGenerator}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
                activeView === 'image' ? 'bg-white dark:bg-gray-700/80' : 'hover:bg-white dark:hover:bg-gray-700/50'
            }`}
        >
            <SparklesIcon className="w-5 h-5 text-purple-500 dark:text-purple-400"/>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('generateImage')}</span>
        </button>
        <button
            onClick={onShowVideoGenerator}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
                activeView === 'video' ? 'bg-white dark:bg-gray-700/80' : 'hover:bg-white dark:hover:bg-gray-700/50'
            }`}
        >
            <VideoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400"/>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('generateVideo')}</span>
        </button>
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">{t('history')}</p>
      <nav className="flex-1 overflow-y-auto pr-1 -mr-1">
        {filteredHistory.map(item => (
          <ChatHistoryItem
            key={item.id}
            item={item}
            isActive={item.id === activeChatId && activeView === 'chat'}
            onSelect={() => onSelectChat(item.id)}
            onDelete={() => onDeleteChat(item.id)}
          />
        ))}
      </nav>
      
      {/* Footer with Settings & User Profile */}
      <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700/50">
        <button
            onClick={onShowSettings}
            className="w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700/50"
        >
            <SettingsIcon className="w-5 h-5"/>
            <span className="text-sm font-medium">{t('settings')}</span>
        </button>
        {user && (
          <div className="flex items-center justify-between p-2 mt-1 rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                  <img src={user.photoURL || undefined} alt="User avatar" className="w-9 h-9 rounded-full flex-shrink-0 border-2 border-gray-300 dark:border-gray-600" />
                  <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.displayName || t('user')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</span>
                  </div>
              </div>
              <button 
                  onClick={onSignOut} 
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                  aria-label={t('signOut')}
                  title={t('signOut')}
              >
                  <LogoutIcon className="w-5 h-5" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};