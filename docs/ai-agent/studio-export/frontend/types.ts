export interface Source {
    uri: string;
    title: string;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    isError?: boolean;
    sources?: Source[];
}

export interface ChatState {
    messages: Message[];
    isTyping: boolean;
    error: string | null;
}
