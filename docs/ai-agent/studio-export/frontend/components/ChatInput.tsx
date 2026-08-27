import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
    suggestions?: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    disabled, 
    suggestions = [] 
}) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestionText: string) => {
        if (!disabled) {
            onSendMessage(suggestionText);
        }
    };

    return (
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            <div className="max-w-4xl mx-auto space-y-3">
                {/* Suggestion Chips */}
                {suggestions.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                        <span className="text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap pl-0.5">
                            <Sparkles size={13} className="text-brand-500" />
                            Швидкі питання:
                        </span>
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(s)}
                                disabled={disabled}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 text-slate-700 font-medium transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input area */}
                <div className="relative flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder="Опишіть задачу (сайт, магазин, 1С, KeyCRM, бот)..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none overflow-y-auto min-h-[50px] max-h-[120px] text-slate-800 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow text-sm sm:text-base"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || disabled}
                        className="absolute right-2 bottom-2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex-shrink-0 shadow-sm"
                        aria-label="Надіслати повідомлення"
                    >
                        <Send size={18} className={input.trim() && !disabled ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
                    </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Безкоштовна оцінка за 24 години</span>
                    <a 
                        href="https://t.me/neuronixjhbot" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-600 hover:underline font-medium"
                    >
                        Telegram: @neuronixjhbot
                    </a>
                </div>
            </div>
        </div>
    );
};
