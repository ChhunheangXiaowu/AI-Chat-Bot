import React, { useState, useRef, useEffect } from 'react';
import type { ImageFile, ThinkingMode } from '../types';
import { SendIcon } from './icons/SendIcon';
import { ImageIcon } from './icons/ImageIcon';
import { ImagePreview } from './ImagePreview';
import { BoltIcon } from './icons/BoltIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { CodeIcon } from './icons/CodeIcon';
import { useI18n } from '../contexts/i18n';

interface ChatInputProps {
  onSendMessage: (prompt: string, image?: ImageFile) => void;
  isLoading: boolean;
  thinkingMode: ThinkingMode;
  onThinkingModeChange: (mode: ThinkingMode) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, thinkingMode, onThinkingModeChange }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useI18n();

  const modes: { id: ThinkingMode; labelKey: string; descriptionKey: string; icon: React.ReactNode }[] = [
      { id: 'Light', labelKey: 'modeLight', descriptionKey: 'modeLightDesc', icon: <BoltIcon className="w-4 h-4" /> },
      { id: 'Deep Thought', labelKey: 'modeDeepThought', descriptionKey: 'modeDeepThoughtDesc', icon: <SparklesIcon className="w-4 h-4" /> },
      { id: 'Code Master', labelKey: 'modeCodeMaster', descriptionKey: 'modeCodeMasterDesc', icon: <CodeIcon className="w-4 h-4" /> },
      { id: 'Search', labelKey: 'modeSearch', descriptionKey: 'modeSearchDesc', icon: <GlobeIcon className="w-4 h-4" /> },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile({ file, type: file.type });
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim() || imageFile) {
      onSendMessage(prompt.trim(), imageFile || undefined);
      setPrompt('');
      handleRemoveImage();
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  const handleTextareaInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setPrompt(event.currentTarget.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const activeMode = modes.find(m => m.id === thinkingMode);
  const activeModeDescription = activeMode ? t(activeMode.descriptionKey) : '';

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
       <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-2">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    type="button"
                    onClick={() => onThinkingModeChange(mode.id)}
                    title={t(mode.descriptionKey)}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        thinkingMode === mode.id
                            ? 'bg-gray-700 text-white'
                            : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    {mode.icon}
                    <span>{t(mode.labelKey)}</span>
                </button>
            ))}
        </div>
      
       <div className="flex items-end p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700/80 shadow-lg">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <ImageIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="flex-1 flex flex-col items-start mx-2">
            {imageFile && <ImagePreview image={imageFile} onRemove={handleRemoveImage} />}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={t('askMeAnything')}
              className="w-full bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-64"
              rows={1}
              disabled={isLoading}
            />
        </div>

        <button
          type="submit"
          disabled={isLoading || (!prompt.trim() && !imageFile)}
          className="p-2.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <SendIcon className="w-5 h-5 text-white" />
        </button>
      </div>

       <p className="text-center text-xs h-4 text-gray-500">
          {activeModeDescription}
       </p>
    </form>
  );
};
