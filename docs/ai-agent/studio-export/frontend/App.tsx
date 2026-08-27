import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Network, ExternalLink, Send, ArrowRight } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { sendMessageStream, initChatSession } from './services/geminiService';
import { Message, ChatState } from './types';

const INITIAL_MESSAGE: Message = {
    id: 'init-1',
    role: 'model',
    text: `Вітаю! Я консультант Neuronix. Ми робимо сайти, інтернет-магазини й автоматизацію: з'єднуємо сайт, CRM, 1С і доставку в один контур.

Розкажіть, з чим маєте справу — підкажу, що з цим можна зробити і скільки це коштує.`
};

const SUGGESTIONS = [
    "Скільки коштує інтернет-магазин і які строки?",
    "Чи налаштовуєте ви синхронізацію 1С з OpenCart?",
    "Як працює інтеграція з KeyCRM та телефонією?",
    "Скільки коштує AI-чат-бот для сайту?",
    "Чи працюєте з Horoshop та які тарифи?"
];

export default function App() {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [INITIAL_MESSAGE],
        isTyping: false,
        error: null,
    });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize chat session on mount
    useEffect(() => {
        initChatSession();
    }, []);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatState.messages]);

    const handleSendMessage = useCallback(async (text: string) => {
        const userMessageId = Date.now().toString();
        const botMessageId = (Date.now() + 1).toString();

        setChatState(prev => ({
            ...prev,
            isTyping: true,
            error: null,
            messages: [
                ...prev.messages,
                { id: userMessageId, role: 'user', text },
                { id: botMessageId, role: 'model', text: '' }
            ]
        }));

        try {
            await sendMessageStream(text, (chunkText: string) => {
                setChatState(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg => 
                        msg.id === botMessageId 
                            ? { ...msg, text: msg.text + chunkText }
                            : msg
                    )
                }));
            });
        } catch (error) {
            console.error("Помилка надсилання повідомлення:", error);
            setChatState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                    msg.id === botMessageId 
                        ? { 
                            ...msg, 
                            text: "Не вдалося отримати відповідь. Будь ласка, напишіть нам напряму в Telegram: https://t.me/neuronixjhbot", 
                            isError: true 
                          }
                        : msg
                )
            }));
        } finally {
            setChatState(prev => ({ ...prev, isTyping: false }));
        }
    }, []);

    const handleResetChat = () => {
        initChatSession();
        setChatState({
            messages: [INITIAL_MESSAGE],
            isTyping: false,
            error: null,
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50">
            {/* Top Navigation Bar */}
            <header className="bg-brand-950 text-white py-3.5 px-4 sm:px-6 shadow-md z-10 flex-shrink-0 border-b border-brand-900">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-500/20 p-2.5 rounded-xl border border-brand-500/30 flex items-center justify-center">
                            <Network size={22} className="text-brand-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">Neuronix</h1>
                                <span className="bg-brand-600/60 text-brand-200 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border border-brand-400/30">
                                    Агенція
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs hidden sm:block">
                                Сайти, інтернет-магазини, CRM та AI-автоматизація
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleResetChat}
                            className="text-xs text-slate-300 hover:text-white bg-brand-900/60 hover:bg-brand-800 px-3 py-1.5 rounded-lg border border-brand-700/50 transition-colors"
                        >
                            Очистити
                        </button>
                        <a 
                            href="https://t.me/neuronixjhbot" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                            <span>Telegram</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>
            </header>

            {/* Value Proposition Highlights */}
            <div className="bg-white border-b border-slate-200 py-2 px-4 shadow-sm hidden sm:block">
                <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700">Лендінги від $350 (5–10 днів)</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700">Інтернет-магазини від $1350</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700">Інтеграції та CRM від $650</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-emerald-700">Гарантія 12 місяців</span>
                </div>
            </div>

            {/* Chat Messages Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
                <div className="max-w-4xl mx-auto">
                    {chatState.messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input & Quick Action Prompts */}
            <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={chatState.isTyping}
                suggestions={chatState.messages.length <= 2 ? SUGGESTIONS : []}
            />
        </div>
    );
}
