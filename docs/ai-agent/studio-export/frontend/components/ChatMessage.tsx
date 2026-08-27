import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Network, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex w-full mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm 
                    ${isUser 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-brand-950 text-brand-100 border border-brand-900'
                    }`}>
                    {isUser ? <User size={18} /> : <Network size={18} className="text-brand-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm leading-relaxed
                    ${isUser 
                        ? 'bg-brand-600 text-white rounded-tr-sm' 
                        : message.isError 
                            ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-sm'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                    }`}
                >
                    {/* Role header for bot */}
                    {!isUser && !message.isError && (
                        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-100">
                            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                                Neuronix
                            </span>
                        </div>
                    )}

                    {message.isError ? (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                            <span>{message.text}</span>
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none text-sm sm:text-base ${isUser ? 'text-white prose-invert' : 'text-slate-850'}`}>
                            {message.text ? (
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            ) : (
                                <span className="flex gap-1.5 items-center py-1">
                                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
