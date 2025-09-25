import React from 'react';
import { signInWithGoogle } from '../services/firebase';
import { GoogleIcon } from './icons/GoogleIcon';
import { useI18n } from '../contexts/i18n';

export const LoginScreen: React.FC = () => {
    const { t } = useI18n();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Error during sign in:", error);
            alert(t('loginError')); // Simple error feedback
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center p-4">
            <div className="w-16 h-16 mb-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl"></div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">{t('welcomeTitle')}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">{t('signInPrompt')}</p>
            
            <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <GoogleIcon className="w-6 h-6" />
                <span className="text-md font-medium text-gray-800 dark:text-gray-200">{t('signInWithGoogle')}</span>
            </button>
        </div>
    );
};