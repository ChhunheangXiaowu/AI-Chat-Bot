import React from 'react';
import type { ImageHistoryItem } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useI18n } from '../contexts/i18n';

interface ImageHistoryProps {
  history: ImageHistoryItem[];
  onDelete: (id: string) => void;
  onSelect: (item: ImageHistoryItem) => void;
}

export const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onDelete, onSelect }) => {
  const { t } = useI18n();
  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">{t('imageHistoryEmpty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {history.map((item) => (
        <div key={item.id} className="group relative rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-200">
          <img
            src={item.imageUrl}
            alt={item.prompt}
            className="w-full h-full object-cover cursor-pointer aspect-square bg-gray-300 dark:bg-gray-800"
            onClick={() => onSelect(item)}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
            <p className="text-xs text-white line-clamp-3">{item.prompt}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-1.5 bg-gray-700/80 rounded-full hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
