import React, { useState, useRef } from 'react';
import type { ImageFile, ImageHistoryItem } from '../types';
import { ImageIcon } from './icons/ImageIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { ImageHistory } from './ImageHistory';
import { useI18n } from '../contexts/i18n';

interface ImageGeneratorProps {
  onGenerate: (prompt: string, aspectRatio: string) => Promise<string[]>;
  onEdit: (prompt: string, image: ImageFile) => Promise<string>;
  imageHistory: ImageHistoryItem[];
  onDeleteImage: (id: string) => void;
}

const aspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onGenerate, onEdit, imageHistory, onDeleteImage }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'generate' | 'history'>('generate');
  const { t } = useI18n();

  // Edit mode state
  const [editImageFile, setEditImageFile] = useState<ImageFile | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const images = await onGenerate(prompt, aspectRatio);
      if (images && images.length > 0) {
        setGeneratedImage(images[0]);
      } else {
        throw new Error("Image generation failed to return an image.");
      }
    } catch (err: any) {
      setError(err.message || t('imageGenError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || !editImageFile || isLoading) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const editedImage = await onEdit(editPrompt, editImageFile);
      setGeneratedImage(editedImage);
      setEditPrompt('');
      setEditImageFile(null);
    } catch (err: any) {
      setError(err.message || t('imageGenError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditImageFile({ file, type: file.type });
      setGeneratedImage(URL.createObjectURL(file));
    }
  };

  const clearEdit = () => {
    setEditImageFile(null);
    setGeneratedImage(null);
    if(editFileInputRef.current) editFileInputRef.current.value = '';
  }

  const handleSelectHistoryImage = (item: ImageHistoryItem) => {
      setPrompt(item.prompt);
      setGeneratedImage(item.imageUrl);
      setView('generate');
  }

  const isEditing = !!editImageFile;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-white dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('imageGeneration')}</h2>
        <button
          onClick={() => setView(v => v === 'generate' ? 'history' : 'generate')}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <HistoryIcon className="w-5 h-5" />
          <span>{view === 'generate' ? t('history') : t('generator')}</span>
        </button>
      </div>

      {view === 'generate' ? (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="relative w-full aspect-square bg-white dark:bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 mb-6">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                    <SparklesIcon className="w-12 h-12 text-purple-400 animate-pulse" />
                    <p className="mt-2 text-lg text-gray-300">{t('generating')}</p>
                    </div>
                )}
                {generatedImage ? (
                    <img src={generatedImage} alt="Generated art" className="object-contain w-full h-full rounded-lg" />
                ) : (
                    <div className="text-center text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>{t('yourImageWillAppear')}</p>
                    </div>
                )}
                {generatedImage && !isLoading && (
                    <a
                        href={generatedImage}
                        download="gemini-image.png"
                        className="absolute bottom-4 right-4 p-2 bg-gray-800/80 rounded-full hover:bg-blue-600 transition-colors"
                        title={t('downloadImage')}
                    >
                        <DownloadIcon className="w-6 h-6 text-white" />
                    </a>
                )}
                </div>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                
                {isEditing ? (
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <textarea
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder={t('editPromptPlaceholder')}
                                className="flex-1 bg-white dark:bg-gray-700/80 p-3 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                rows={2}
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !editPrompt.trim()} className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50 text-white">
                                {t('edit')}
                            </button>
                        </div>
                         <button type="button" onClick={clearEdit} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">{t('cancelEdit')}</button>
                    </form>
                ) : (
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('generatePromptPlaceholder')}
                            className="w-full bg-white dark:bg-gray-700/80 p-3 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows={3}
                            disabled={isLoading}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('aspectRatio')}</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {aspectRatios.map(ar => (
                                        <button
                                            key={ar}
                                            type="button"
                                            onClick={() => setAspectRatio(ar)}
                                            disabled={isLoading}
                                            className={`py-2 rounded-lg text-sm transition-colors text-white ${aspectRatio === ar ? 'bg-purple-600' : 'bg-gray-500 dark:bg-gray-700/80 hover:bg-gray-600 dark:hover:bg-gray-700'}`}
                                        >
                                            {ar}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end">
                                <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                                    <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={isLoading} className="h-[42px] px-5 py-2.5 bg-gray-300 dark:bg-gray-700/80 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-lg font-semibold">{t('edit')}</button>
                                    <input type="file" ref={editFileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    <button type="submit" disabled={isLoading || !prompt.trim()} className="h-[42px] px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50 text-white">
                                        {t('generate')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
            <ImageHistory history={imageHistory} onDelete={onDeleteImage} onSelect={handleSelectHistoryImage} />
        </div>
      )}
    </div>
  );
};