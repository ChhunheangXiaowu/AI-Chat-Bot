export type Role = 'USER' | 'MODEL';

export interface Message {
  role: Role;
  text: string;
  image?: string; // base64 data URL
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface ImageFile {
  file: File;
  type: string;
}

export type ThinkingMode = 'Light' | 'Deep Thought' | 'Code Master' | 'Search';

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
}

export interface ImageHistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
}
