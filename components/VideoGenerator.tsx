import React, { useState, useEffect } from 'react';
import { VideoIcon } from './icons/VideoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { useI18n } from '../contexts/i18n';

interface VideoGeneratorProps {
  onGenerate: (prompt: string, resolution: string) => Promise<string>;
}

const resolutions = ["480p", "720p", "1080p", "2K", "4K"];

const loadingMessages = [
    'generatingVideoMsg1',
    'generatingVideoMsg2',
    'generatingVideoMsg3',
    'generatingVideoMsg4',
];

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('1080p');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);
  const { t } = useI18n();
  
  useEffect(() => {
    // FIX: The type NodeJS.Timeout is not available in browser environments.
    // Refactored to correctly handle the interval in a React hook, which also resolves the type error.
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 5000); // Change message every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    // Revoke previous blob URL if it exists
    if (generatedVideo) {
        URL.revokeObjectURL(generatedVideo);
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedVideo(null);
    setCurrentLoadingMessageIndex(0);

    try {
      const videoUrl = await onGenerate(prompt, resolution);
      setGeneratedVideo(videoUrl);
    } catch (err: any) {
      setError(err.message || t('videoGenError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-white dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('videoGeneration')}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="relative w-full aspect-video bg-white dark:bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 mb-6">
            {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 p-4 text-center">
                <SparklesIcon className="w-12 h-12 text-blue-400 animate-pulse" />
                <p className="mt-4 text-lg font-semibold text-gray-200">{t('generatingVideo')}</p>
                <p className="mt-2 text-sm text-gray-400">{t(loadingMessages[currentLoadingMessageIndex])}</p>
              </div>
            )}
            {generatedVideo ? (
              <video src={generatedVideo} controls className="object-contain w-full h-full rounded-lg" />
            ) : (
              !isLoading && (
                <div className="text-center text-gray-500">
                  <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                  <p>{t('yourVideoWillAppear')}</p>
                </div>
              )
            )}
            {generatedVideo && !isLoading && (
              <a
                href={generatedVideo}
                download="gemini-video.mp4"
                className="absolute bottom-4 right-4 p-2 bg-gray-800/80 rounded-full hover:bg-blue-600 transition-colors"
                title={t('downloadVideo')}
              >
                <DownloadIcon className="w-6 h-6 text-white" />
              </a>
            )}
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <form onSubmit={handleGenerate} className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('videoPromptPlaceholder')}
              className="w-full bg-white dark:bg-gray-700/80 p-3 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('resolution')}</label>
                <div className="grid grid-cols-5 gap-2">
                  {resolutions.map(res => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      disabled={isLoading}
                      className={`py-2 rounded-lg text-sm transition-colors text-white ${resolution === res ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-700/80 hover:bg-gray-600 dark:hover:bg-gray-700'}`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={isLoading || !prompt.trim()} className="h-[42px] w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 text-white">
                  {t('generate')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};