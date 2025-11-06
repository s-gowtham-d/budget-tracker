// components/ai-assistant/FinanceAssistant.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Bot,
    Send,
    Loader2,
    X,
    MessageSquare,
    Sparkles,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Tag,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { chatBotAPI } from '@/lib/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    needsFollowUp?: boolean;
    extractedData?: Partial<TransactionData>;
    suggestions?: string[];
}

interface TransactionData {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
    payment_method?: string;
}

const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 24 * 60) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffMinutes < 7 * 24 * 60) return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
};

export function FinanceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const { symbol } = useCurrency();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content:
                `👋 Hi! I'm your AI Finance Assistant. You can say things like 'I spent ${symbol}50 on groceries today' or ask questions like 'What's my total spending this week?'`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState<Partial<TransactionData> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuthStore();

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatBotAPI.sendMessage({
                message: input,
                pending_transaction: pendingTransaction,
                user_context: {
                    currency: user?.currency,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            });

            const data = response.data;
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                needsFollowUp: data.needs_follow_up,
                extractedData: data.extracted_data,
                suggestions: data.suggestions,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (data.needs_follow_up) {
                setPendingTransaction(data.extracted_data);
            } else if (data.transaction_created) {
                setPendingTransaction(null);
                toast.success('Transaction added successfully!');
            }
        } catch (error) {
            console.error('AI Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "⚠️ I'm having trouble processing that. Could you rephrase?",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, pendingTransaction, user?.currency]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleSuggestionClick = useCallback((suggestion: string) => {
        setInput(suggestion);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Floating button when closed
    if (!isOpen) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={toggleChat}
                    size="lg"
                    className="h-16 w-16 rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    aria-label="Open AI Finance Assistant"
                >
                    <Sparkles className="h-7 w-7 text-white" />
                </Button>
            </motion.div>
        );
    }

    // Chat window open
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                className="fixed bottom-6 right-6 w-[400px] h-[650px] shadow-2xl border border-border/50 rounded-2xl flex flex-col overflow-hidden z-50 bg-background"
                role="dialog"
                aria-labelledby="chat-title"
            >
                {/* Header - Fixed */}
                <div className="flex-none flex items-center justify-between bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-500 text-white p-4 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 id="chat-title" className="text-sm font-semibold">
                                AI Finance Assistant
                            </h2>
                            <p className="text-xs text-white/90 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                Online · Powered by Gemini
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleChat}
                        className="text-white hover:bg-white/20 rounded-full"
                        aria-label="Close chat"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Messages - Scrollable with custom scrollbar */}
                <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    'flex items-end gap-2 group animate-in fade-in slide-in-from-bottom-2 duration-300',
                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {msg.role === 'assistant' && (
                                    <Avatar className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-blue-500 shadow-md flex-shrink-0">
                                        <AvatarFallback className="text-white text-xs">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={cn(
                                        'max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative',
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-br-none'
                                            : 'bg-muted/80 backdrop-blur-sm rounded-bl-none border border-border/50'
                                    )}
                                >
                                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Extracted data preview */}
                                    {msg.extractedData && Object.keys(msg.extractedData).length > 0 && (
                                        <div className="mt-3 pt-3 space-y-1.5 text-xs border-t border-border/50">
                                            <p className="font-semibold text-muted-foreground mb-1.5">
                                                Transaction Details:
                                            </p>
                                            {msg.extractedData.amount && (
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="font-medium">
                                                        Amount: {symbol}
                                                        {msg.extractedData.amount}
                                                    </span>
                                                </div>
                                            )}
                                            {msg.extractedData.category && (
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-3.5 w-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                    <span>Category: {msg.extractedData.category}</span>
                                                </div>
                                            )}
                                            {msg.extractedData.date && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                                                    <span>Date: {msg.extractedData.date}</span>
                                                </div>
                                            )}
                                            {msg.extractedData.type && (
                                                <div className="flex items-center gap-2">
                                                    {msg.extractedData.type === 'income' ? (
                                                        <TrendingUp className="h-3.5 w-3.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <TrendingDown className="h-3.5 w-3.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                                                    )}
                                                    <span className="capitalize">Type: {msg.extractedData.type}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="mt-3 pt-3 space-y-1.5 border-t border-border/50">
                                            <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                                                Quick replies:
                                            </p>
                                            {msg.suggestions.map((s, i) => (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full justify-start text-xs h-auto py-2 bg-background/50 hover:bg-accent font-normal"
                                                    onClick={() => handleSuggestionClick(s)}
                                                    aria-label={`Suggest: ${s}`}
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <div
                                        className={cn(
                                            'text-[10px] mt-1.5 opacity-70',
                                            msg.role === 'user' ? 'text-white/90' : 'text-muted-foreground'
                                        )}
                                    >
                                        {formatTimestamp(msg.timestamp)}
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <Avatar className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-blue-600 shadow-md flex-shrink-0">
                                        <AvatarFallback className="text-white text-xs font-semibold">
                                            {user?.first_name?.[0] ?? 'U'}
                                            {user?.last_name?.[0] ?? ''}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Avatar className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-blue-500 shadow-md flex-shrink-0">
                                    <AvatarFallback className="text-white text-xs">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-border/50">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Invisible element to scroll to */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Pending transaction indicator - Fixed */}
                {pendingTransaction && (
                    <div className="flex-none px-4 py-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-t border-yellow-200 dark:border-yellow-900/50">
                        <div className="flex items-center gap-2 text-xs text-yellow-800 dark:text-yellow-300">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                            <span className="font-medium">Collecting transaction details...</span>
                        </div>
                    </div>
                )}

                {/* Quick actions - Fixed */}
                <div className="flex-none px-4 py-2.5 border-t border-border/50 bg-muted/30 backdrop-blur-sm">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent/80 whitespace-nowrap px-3 py-1.5 text-xs transition-colors border-border/50 hover:border-emerald-500/50"
                            onClick={() => handleSuggestionClick('Show my spending this month')}
                        >
                            <TrendingDown className="h-3 w-3 mr-1.5" />
                            Spending
                        </Badge>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent/80 whitespace-nowrap px-3 py-1.5 text-xs transition-colors border-border/50 hover:border-blue-500/50"
                            onClick={() => handleSuggestionClick('What is my budget status?')}
                        >
                            <TrendingUp className="h-3 w-3 mr-1.5" />
                            Budget
                        </Badge>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent/80 whitespace-nowrap px-3 py-1.5 text-xs transition-colors border-border/50 hover:border-purple-500/50"
                            onClick={() => handleSuggestionClick(`Add income ${symbol}1000 salary`)}
                        >
                            <DollarSign className="h-3 w-3 mr-1.5" />
                            Income
                        </Badge>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-accent/80 whitespace-nowrap px-3 py-1.5 text-xs transition-colors border-border/50"
                                >
                                    <Sparkles className="h-3 w-3 mr-1.5" />
                                    More
                                    <ChevronDown className="h-3 w-3 ml-1.5" />
                                </Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="end">
                                <div className="grid gap-1">
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto py-2 text-sm font-normal"
                                        onClick={() => handleSuggestionClick('Show my recent transactions')}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Recent Transactions
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto py-2 text-sm font-normal"
                                        onClick={() =>
                                            handleSuggestionClick('How much did I spend on food last month?')
                                        }
                                    >
                                        <TrendingDown className="h-4 w-4 mr-2" />
                                        Food Spending
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start h-auto py-2 text-sm font-normal"
                                        onClick={() =>
                                            handleSuggestionClick(`Set a budget for groceries at ${symbol}300`)
                                        }
                                    >
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Set Budget
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Input - Fixed */}
                <div className="flex-none p-4 border-t border-border/50 bg-background rounded-b-2xl">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="pr-10 resize-none bg-muted/50 border-border/50 focus-visible:ring-emerald-500/50 rounded-xl"
                                aria-label="Chat input"
                            />
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-md"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 px-1">
                        Try: "I spent {symbol}50 on groceries today"
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}