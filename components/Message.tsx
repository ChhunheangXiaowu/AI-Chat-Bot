import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserIcon } from './icons/UserIcon';
import { ModelIcon } from './icons/ModelIcon';
import type { Message as MessageType } from '../types';
import { useI18n } from '../contexts/i18n';

interface MessageProps {
  message: MessageType;
  isStreaming: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'USER';
  const { t } = useI18n();

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-purple-600'}`}>
        {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <ModelIcon className="w-5 h-5 text-white" />}
      </div>
      <div className={`max-w-2xl px-5 py-3 rounded-2xl text-gray-900 dark:text-gray-200 ${isUser ? 'bg-blue-500 text-white dark:bg-blue-600/80 rounded-br-none' : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'}`}>
        {message.image && (
          <img src={message.image} alt="User upload" className="max-w-xs rounded-lg mb-3 border-2 border-gray-300 dark:border-gray-600" />
        )}
        <div className="prose prose-sm prose-p:text-gray-800 prose-li:text-gray-800 dark:prose-p:text-gray-200 dark:prose-li:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900/70 prose-pre:p-4 prose-pre:rounded-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
            {isStreaming && <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />}
        </div>
         {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-700/50">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('sources')}</h4>
            <ol className="list-decimal list-inside space-y-1">
              {message.sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate hover:underline"
                    title={source.uri}
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};