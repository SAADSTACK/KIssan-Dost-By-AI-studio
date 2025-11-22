import React, { useState, useRef, useEffect } from 'react';
import { Message, Language, ChatSession } from '../types';
import { TRANSLATIONS } from '../constants';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, User, Bot, Loader2, Sparkles, Menu, Plus, MessageSquare, Trash2, X, PanelLeft, Clock } from 'lucide-react';

interface ChatInterfaceProps {
  lang: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== Language.ENGLISH;
  
  // --- State ---
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Load sessions from local storage on mount
  useEffect(() => {
    const storedSessions = localStorage.getItem('kissan_chat_sessions');
    if (storedSessions) {
      try {
        const parsed = JSON.parse(storedSessions);
        // Fix dates (JSON stringifies dates)
        const hydrated = parsed.map((s: any) => ({
            ...s,
            messages: s.messages.map((m: any) => ({...m, timestamp: new Date(m.timestamp)}))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) {
            setActiveSessionId(hydrated[0].id);
        } else {
            createNewSession();
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('kissan_chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom when active session messages change
  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeSessionId, loading]);

  // Update default welcome message language when lang changes
  useEffect(() => {
    if (activeSessionId) {
        setSessions(prev => prev.map(session => {
            if (session.id === activeSessionId && session.messages.length === 1 && session.messages[0].role === 'model') {
                 return {
                     ...session,
                     messages: [{ ...session.messages[0], text: t.ask_anything }]
                 };
            }
            return session;
        }));
    }
  }, [lang]);

  // --- Helpers ---

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < oneDay * 2) {
      return lang === Language.ENGLISH ? 'Yesterday' : 'Kal';
    }
    return date.toLocaleDateString();
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: t.new_chat,
      preview: t.ask_anything,
      updatedAt: Date.now(),
      messages: [{
        id: 'init',
        role: 'model',
        text: t.ask_anything,
        timestamp: new Date(),
      }]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (window.innerWidth < 640) setIsMobileSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
        if (newSessions.length > 0) {
            setActiveSessionId(newSessions[0].id);
        } else {
            createNewSession();
        }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getActiveMessages = () => {
    return sessions.find(s => s.id === activeSessionId)?.messages || [];
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeSessionId) return;

    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (!currentSession) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    // Optimistic Update
    const updatedMessages = [...currentSession.messages, userMsg];
    
    // Update Session (Title if it's the first user message)
    const isFirstUserMsg = currentSession.messages.length <= 1;
    const newTitle = isFirstUserMsg ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : currentSession.title;

    setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
        ? { ...s, messages: updatedMessages, title: newTitle, preview: input.slice(0, 40), updatedAt: Date.now() } 
        : s
    ));

    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToGemini(updatedMessages, input, lang);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
        ? { ...s, messages: [...updatedMessages, botMsg], preview: responseText.slice(0, 40), updatedAt: Date.now() } 
        : s
      ));

    } catch (error) {
        console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-white/50 overflow-hidden relative ring-1 ring-gray-100 w-full">
      
      {/* --- Sidebar (History) --- */}
      <div className={`
        absolute inset-y-0 z-20 bg-earth-50/95 backdrop-blur-md border-r border-earth-100 transform transition-all duration-300 ease-in-out flex flex-col
        sm:relative sm:border-r-0
        ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'}
        ${/* Mobile Visibility */ ''}
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl w-64' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
        ${/* Desktop Visibility - overrides mobile transform */ ''}
        sm:transform-none
        ${isDesktopSidebarOpen ? 'sm:w-72 sm:border-r' : 'sm:w-0 sm:overflow-hidden sm:border-none'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-earth-100 flex items-center justify-between bg-white/40 min-w-[256px]">
            <h3 className={`font-bold text-earth-800 flex items-center gap-2 ${isRtl ? 'font-urdu' : ''}`}>
                <Clock size={18} className="text-earth-600" />
                {t.chat_history}
            </h3>
            <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="sm:hidden p-1 rounded-full hover:bg-black/5 text-gray-500"
            >
                <X size={20} />
            </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 min-w-[256px]">
            <button 
                onClick={createNewSession}
                className={`w-full flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700 text-white py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95 font-bold text-sm ${isRtl ? 'flex-row-reverse font-urdu' : ''}`}
            >
                <Plus size={18} />
                {t.new_chat}
            </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide min-w-[256px]">
            {sessions.length === 0 && (
                <div className="text-center text-gray-400 text-xs py-8">
                    {t.no_history}
                </div>
            )}
            {sessions.map((session) => (
                <div 
                    key={session.id}
                    onClick={() => {
                        setActiveSessionId(session.id);
                        if (window.innerWidth < 640) setIsMobileSidebarOpen(false);
                    }}
                    className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${
                        activeSessionId === session.id 
                        ? 'bg-white border-leaf-200 shadow-sm' 
                        : 'hover:bg-white/60 border-transparent hover:border-earth-100'
                    }`}
                >
                    <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                        <div className={`mt-1 p-1.5 rounded-lg flex-shrink-0 ${activeSessionId === session.id ? 'bg-leaf-100 text-leaf-700' : 'bg-earth-100 text-earth-600'}`}>
                            <MessageSquare size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`flex justify-between items-baseline mb-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <h4 className={`font-semibold text-sm text-gray-800 truncate max-w-[70%] ${isRtl ? 'font-urdu' : ''}`}>
                                    {session.title || t.new_chat}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">
                                    {formatTime(session.updatedAt)}
                                </span>
                            </div>
                            <p className={`text-xs text-gray-500 truncate ${isRtl ? 'font-urdu' : ''}`}>
                                {session.preview}
                            </p>
                        </div>
                        {/* Delete Button */}
                        <button 
                            onClick={(e) => deleteSession(e, session.id)}
                            className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm ${activeSessionId === session.id ? 'opacity-0 group-hover:opacity-100' : ''}`}
                            title={t.delete_chat}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative h-full">
        
        {/* Header/Status Bar */}
        <div className="absolute top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-2 z-10 flex items-center justify-between h-14 flex-shrink-0">
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                {/* Mobile Toggle */}
                <button 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="sm:hidden p-2 -mx-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    <Menu size={20} />
                </button>
                {/* Desktop Toggle */}
                <button 
                    onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                    className="hidden sm:block p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Toggle Sidebar"
                >
                    <PanelLeft size={20} className={!isDesktopSidebarOpen ? 'rotate-180' : ''} />
                </button>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-leaf-600 bg-leaf-50 px-3 py-1 rounded-full shadow-sm border border-leaf-100">
                    <Sparkles size={12} />
                    <span className={isRtl ? 'font-urdu' : ''}>AI Advisor Active</span>
                </div>
            </div>
            
            {/* Current Chat Title (Mobile/Desktop) */}
            <div className={`hidden sm:block text-xs font-medium text-gray-400 truncate max-w-[200px] ${isRtl ? 'font-urdu' : ''}`}>
                {activeSession?.title}
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide pt-20 pb-4">
            {getActiveMessages().map((msg) => {
            const isUser = msg.role === 'user';
            return (
                <div 
                key={msg.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                <div className={`max-w-[88%] sm:max-w-[80%] flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 ${isUser ? 'bg-leaf-600 border-leaf-100' : 'bg-white border-earth-200'}`}>
                    {isUser ? <User size={16} className="text-white" /> : <Bot size={18} className="text-earth-600" />}
                    </div>
                    
                    {/* Bubble */}
                    <div className={`px-4 py-3 shadow-sm text-sm sm:text-[15px] leading-relaxed ${
                        isUser 
                        ? 'bg-leaf-600 text-white rounded-2xl rounded-tr-none' 
                        : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none shadow-[0_2px_8px_rgb(0,0,0,0.04)]'
                    } ${isRtl ? 'font-urdu text-right leading-loose' : 'text-left'}`}
                    >
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                    <div className={`text-[10px] mt-1 opacity-60 font-medium ${isUser ? 'text-leaf-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    </div>
                </div>
                </div>
            );
            })}
            
            {loading && (
                <div className="flex justify-start animate-pulse">
                    <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm ml-11 sm:ml-14">
                        <Loader2 className="w-4 h-4 animate-spin text-leaf-600" />
                        <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <div className={`flex items-center gap-2 relative ${isRtl ? 'flex-row-reverse' : ''}`}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isRtl ? "یہاں سوال لکھیں..." : "Type your question here..."}
                className={`flex-1 bg-gray-50 text-gray-900 rounded-full px-4 py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-leaf-500/50 focus:bg-white transition-all shadow-inner border border-transparent focus:border-leaf-200 ${isRtl ? 'text-right font-urdu placeholder:text-right' : 'text-left'}`}
                disabled={loading}
            />
            <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`bg-leaf-600 hover:bg-leaf-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex-shrink-0`}
            >
                <Send size={20} className={isRtl ? "rotate-180" : ""} />
            </button>
            </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 sm:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
      )}
    </div>
  );
};

export default ChatInterface;