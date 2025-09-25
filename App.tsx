import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ImageGenerator } from './components/ImageGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { LoginScreen } from './components/LoginScreen';
import { MenuIcon } from './components/icons/MenuIcon';
import { GlobeIcon } from './components/icons/GlobeIcon';
import { SettingsModal } from './components/SettingsModal';
import { useI18n } from './contexts/i18n';
import type { Message, ImageFile, ThinkingMode, ChatHistory, ImageHistoryItem } from './types';
import { createChatSession, generateImage, editImage, generateVideo } from './services/geminiService';
import { auth, signOut } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Chat, GenerateContentResponse, Part } from '@google/genai';
import { fileToGenerativePart, createThumbnail } from './utils/fileUtils';

// Helper to extract source URLs from grounding metadata
const getSourcesFromResponse = (response: GenerateContentResponse) => {
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (!groundingMetadata?.groundingChunks) return [];
    
    return groundingMetadata.groundingChunks
        .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
        .map(chunk => ({
            uri: chunk.web.uri as string,
            title: chunk.web.title as string,
        }));
};

// Helper function to get the initial theme from localStorage
const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('gemini-theme');
        if (storedTheme === 'light') {
            return 'light';
        }
    }
    return 'dark'; // Default to dark
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [chats, setChats] = useState<Record<string, ChatHistory>>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
    const [activeView, setActiveView] = useState<'chat' | 'image' | 'video'>('chat');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [thinkingMode, setThinkingMode] = useState<ThinkingMode>('Search');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
    const { language, setLanguage } = useI18n();
    const { t } = useI18n();
    
    const [pendingMessage, setPendingMessage] = useState<{prompt: string, image?: ImageFile, chatId: string} | null>(null);

    // Authentication listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
            if (!currentUser) {
                // Clear user-specific data on logout
                setChats({});
                setImageHistory([]);
                setActiveChatId(null);
                localStorage.removeItem('gemini-chats');
                localStorage.removeItem('gemini-image-history');
            }
        });
        return () => unsubscribe();
    }, []);

    // Load chats and image history from localStorage on initial render
    useEffect(() => {
        if (user) { // Only load data if user is logged in
            try {
                const savedChats = localStorage.getItem('gemini-chats');
                const savedImageHistory = localStorage.getItem('gemini-image-history');

                if (savedChats) {
                    const parsedChats = JSON.parse(savedChats);
                    setChats(parsedChats);
                }
                if (savedImageHistory) {
                    setImageHistory(JSON.parse(savedImageHistory));
                }
            } catch (error) {
                console.error("Failed to load from localStorage:", error);
            }
        }
    }, [user]); // Rerun when user logs in

    // Save chats and image history to localStorage whenever they change
    useEffect(() => {
        if (user) { // Only save data if user is logged in
            try {
                if (Object.keys(chats).length > 0) {
                     localStorage.setItem('gemini-chats', JSON.stringify(chats));
                }
                localStorage.setItem('gemini-image-history', JSON.stringify(imageHistory));
            } catch (error) {
                console.error("Failed to save to localStorage:", error);
            }
        }
    }, [chats, imageHistory, user]);

    // Effect for applying theme and saving preference
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        // Set the dark class on the HTML element for Tailwind variants
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        // Set body background for the whole page to prevent flashes/gaps
        if (theme === 'dark') {
            body.classList.add('bg-gray-900');
            body.classList.remove('bg-white');
        } else {
            body.classList.add('bg-white');
            body.classList.remove('bg-gray-900');
        }

        localStorage.setItem('gemini-theme', theme);
    }, [theme]);

    // Effect for saving language preference
    useEffect(() => {
        localStorage.setItem('gemini-language', language);
    }, [language]);
    
    // Effect to send a message when a new chat is created
    useEffect(() => {
        if (pendingMessage && chats[pendingMessage.chatId]) {
            sendMessageToChat(pendingMessage.prompt, pendingMessage.image, pendingMessage.chatId);
            setPendingMessage(null);
        }
    }, [pendingMessage, chats]);

    const handleNewChat = () => {
        const newId = `chat_${Date.now()}`;
        const newChat: ChatHistory = { id: newId, title: "New Chat", messages: [] };
        setChats(prev => ({ ...prev, [newId]: newChat }));
        setActiveChatId(newId);
        setActiveView('chat');
        setSidebarOpen(false);
        setThinkingMode('Search');
        return newId;
    };
    
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        setActiveView('chat');
        setSidebarOpen(false);
    };

    const handleDeleteChat = (id: string) => {
        setChats(prev => {
            const newChats = { ...prev };
            delete newChats[id];
            localStorage.setItem('gemini-chats', JSON.stringify(newChats)); // force update
            return newChats;
        });
        if (activeChatId === id) {
            setActiveChatId(null);
        }
    };
    
    const handleSendMessage = async (prompt: string, image?: ImageFile) => {
        if (!activeChatId) {
            const newId = handleNewChat();
            setPendingMessage({prompt, image, chatId: newId});
        } else {
            sendMessageToChat(prompt, image, activeChatId);
        }
    };
    
    const sendMessageToChat = async (prompt: string, image: ImageFile | undefined, chatId: string) => {
        if (!chatId) return;

        setIsLoading(true);

        const userMessage: Message = { role: 'USER', text: prompt };
        if (image) {
            userMessage.image = URL.createObjectURL(image.file);
        }
        
        const chatHistoryBeforeMessage = chats[chatId]?.messages || [];

        // Update UI immediately with user message
        setChats(prev => ({
            ...prev,
            [chatId]: {
                ...prev[chatId],
                title: prev[chatId].messages.length === 0 ? prompt.substring(0, 40) : prev[chatId].title,
                messages: [...prev[chatId].messages, userMessage],
            },
        }));
        
        const modelMessage: Message = { role: 'MODEL', text: '' };
        setChats(prev => ({
            ...prev,
            [chatId]: {
                ...prev[chatId],
                messages: [...prev[chatId].messages, modelMessage],
            },
        }));

        try {
            const chatSession = createChatSession(thinkingMode, chatHistoryBeforeMessage);
            const messageParts: (string | Part)[] = [prompt];
            if (image) {
                const imagePart = await fileToGenerativePart(image.file, image.type);
                messageParts.unshift(imagePart);
            }

            const stream = await chatSession.sendMessageStream({ message: messageParts });

            let fullResponseText = '';
            let finalResponse: GenerateContentResponse | null = null;
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                fullResponseText += chunkText;
                finalResponse = chunk;
                
                setChats(prev => {
                    const currentMessages = prev[chatId].messages;
                    const updatedMessages = [...currentMessages];
                    updatedMessages[updatedMessages.length - 1] = { ...updatedMessages[updatedMessages.length - 1], text: fullResponseText };
                    return {
                        ...prev,
                        [chatId]: { ...prev[chatId], messages: updatedMessages },
                    };
                });
            }
            
            if(finalResponse) {
                const sources = getSourcesFromResponse(finalResponse);
                if (sources.length > 0) {
                     setChats(prev => {
                        const currentMessages = prev[chatId].messages;
                        const updatedMessages = [...currentMessages];
                        updatedMessages[updatedMessages.length - 1].sources = sources;
                        return {
                            ...prev,
                            [chatId]: { ...prev[chatId], messages: updatedMessages },
                        };
                    });
                }
            }

        } catch (error) {
            console.error(error);
             setChats(prev => {
                const currentMessages = prev[chatId].messages;
                const updatedMessages = [...currentMessages];
                updatedMessages[updatedMessages.length - 1].text += `\n\n**${t('errorMessage')}**`;
                return {
                    ...prev,
                    [chatId]: { ...prev[chatId], messages: updatedMessages },
                };
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateImage = async (prompt: string, aspectRatio: string): Promise<string[]> => {
        const results = await generateImage(prompt, aspectRatio);
        if (results && results.length > 0) {
            const fullImageUrl = results[0];
            const thumbnailUrl = await createThumbnail(fullImageUrl);
            const newItem: ImageHistoryItem = {
                id: `img_${Date.now()}`,
                prompt,
                imageUrl: thumbnailUrl, // Save thumbnail URL to prevent quota issues
                timestamp: new Date().toISOString(),
            };
            setImageHistory(prev => [newItem, ...prev]);
        }
        return results; // Return full image URL to component
    };

    const handleEditImage = async (prompt: string, image: ImageFile): Promise<string> => {
        const result = await editImage(prompt, image);
        if (result) {
            const thumbnailUrl = await createThumbnail(result);
            const newItem: ImageHistoryItem = {
                id: `img_${Date.now()}`,
                prompt: `(Edit) ${prompt}`,
                imageUrl: thumbnailUrl, // Save thumbnail URL to prevent quota issues
                timestamp: new Date().toISOString(),
            };
            setImageHistory(prev => [newItem, ...prev]);
        }
        return result; // Return full image URL to component
    }
    
    const handleDeleteImage = (id: string) => {
        setImageHistory(prev => prev.filter(item => item.id !== id));
    };
    
    const handleGenerateVideo = async (prompt: string, resolution: string): Promise<string> => {
        // Since this is a new feature, we don't have video history yet.
        // We'll just call the service and return the result.
        const videoUrl = await generateVideo(prompt, resolution);
        return videoUrl;
    };

    const handleThinkingModeChange = (mode: ThinkingMode) => {
        if (activeChatId && chats[activeChatId]?.messages.length > 0) {
            if (window.confirm(t('confirmModeChange'))) {
                handleNewChat();
                setThinkingMode(mode);
            }
        } else {
            setThinkingMode(mode);
        }
    };
    
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }
    
    const activeChatMessages = activeChatId ? chats[activeChatId]?.messages : [];
    const chatHistoryForSidebar = Object.values(chats).sort((a: ChatHistory, b: ChatHistory) => parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1]));

    return (
        <div className="flex min-h-screen text-gray-800 dark:text-gray-200 font-sans">
             {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)} 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    aria-label="Close sidebar"
                ></div>
            )}
            <div className={`fixed inset-y-0 left-0 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:flex`}>
                <Sidebar
                    history={chatHistoryForSidebar}
                    activeChatId={activeChatId}
                    activeView={activeView}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                    onShowImageGenerator={() => { setActiveView('image'); setSidebarOpen(false); }}
                    onShowVideoGenerator={() => { setActiveView('video'); setSidebarOpen(false); }}
                    onShowSettings={() => setIsSettingsModalOpen(true)}
                    user={user}
                    onSignOut={handleSignOut}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>
            <div className="flex-1 flex flex-col relative bg-white dark:bg-gray-800/50">
                 <button onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 z-20 md:hidden p-2 bg-white/80 dark:bg-gray-800/80 rounded-md">
                    <MenuIcon className="w-6 h-6"/>
                </button>
                {activeView === 'chat' && (
                    <div className="flex-1 flex flex-col">
                        {activeChatId ? (
                            <>
                                {thinkingMode === 'Search' && (
                                    <div className="flex items-center justify-center gap-2 p-2 bg-gray-200 dark:bg-gray-800/80 border-b border-gray-300 dark:border-gray-700/50 text-sm text-gray-600 dark:text-gray-400">
                                        <GlobeIcon className="w-4 h-4" />
                                        <span>{t('liveWebSearchActive')}</span>
                                    </div>
                                )}
                                <ChatWindow messages={activeChatMessages} isLoading={isLoading} />
                                <div className="p-4 md:p-6 pt-0">
                                    <ChatInput 
                                        onSendMessage={handleSendMessage} 
                                        isLoading={isLoading} 
                                        thinkingMode={thinkingMode}
                                        onThinkingModeChange={handleThinkingModeChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <WelcomeScreen 
                                onSendMessage={(prompt) => handleSendMessage(prompt)} 
                                thinkingMode={thinkingMode}
                            />
                        )}
                    </div>
                )}
                {activeView === 'image' && (
                    <ImageGenerator 
                        onGenerate={handleGenerateImage}
                        onEdit={handleEditImage}
                        imageHistory={imageHistory}
                        onDeleteImage={handleDeleteImage}
                    />
                )}
                {activeView === 'video' && (
                    <VideoGenerator onGenerate={handleGenerateVideo} />
                )}
            </div>
             <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                theme={theme}
                onThemeChange={setTheme}
                language={language}
                onLanguageChange={setLanguage}
            />
        </div>
    );
};

export default App;