import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <Message 
                message={msg} 
                isStreaming={isLoading && index === messages.length - 1} 
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};