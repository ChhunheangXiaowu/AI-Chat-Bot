import React from 'react';
import { useI18n } from '../contexts/i18n';
import { XIcon } from './icons/XIcon';

type Theme = 'light' | 'dark';
type Language = 'en' | 'km';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Theme Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('theme')}</h3>
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            {(['light', 'dark'] as Theme[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onThemeChange(mode)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  theme === mode
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {t(mode)}
              </button>
            ))}
          </div>
        </div>

        {/* Language Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('language')}</h3>
          <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            {(['en', 'km'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  language === lang
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {t(lang === 'en' ? 'english' : 'khmer')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
