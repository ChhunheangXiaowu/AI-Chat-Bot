import React from 'react';
import type { ThinkingMode } from '../types';
import { useI18n } from '../contexts/i18n';

const examplePrompts = [
    "Explain quantum computing in simple terms",
    "Write a short story about a robot who discovers music",
    "What are the best practices for writing React code?",
    "Give me a 7-day workout plan",
];

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    thinkingMode: ThinkingMode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSendMessage, thinkingMode }) => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 mb-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl"></div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">{t('welcomeTitle')}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('welcomeSubtitle')}</p>
            
            <div className="h-10 flex items-center justify-center">
                 {thinkingMode === 'Search' && (
                    <p className="text-sm text-gray-500">
                        {t('welcomeSearchNote')}
                    </p>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {examplePrompts.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => onSendMessage(prompt)}
                        className="p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors text-gray-700 dark:text-gray-300"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
