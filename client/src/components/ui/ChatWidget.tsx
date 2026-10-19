import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, PhoneCall, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  fallback?: boolean;
}

interface ChatWidgetProps {
  onOpenConsultation: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onOpenConsultation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi there! I am the Codex AI Assistant. Ask me about our placement timelines, IT training courses, visa sponsorship, or employer staffing!',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await api.get(`/chat/answer?q=${encodeURIComponent(userText)}`);
      const data = res.data.data;
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        fallback: data.fallback,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'I am having trouble answering right now. Please book a free consultation or contact our team directly!',
          fallback: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-elevated focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label="Open Codex live FAQ assistant"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full animate-ping" />
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-navy-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm">Codex Career Assistant</h4>
                <p className="text-[11px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Instant answers 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none'
                      : 'bg-white text-navy-900 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.fallback && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenConsultation();
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Book Free Strategy Call
                    </button>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Typing answer...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto text-[11px] font-medium text-slate-600">
            <button
              onClick={() => setInput('What are the training fees?')}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
            >
              Training Fees?
            </button>
            <button
              onClick={() => setInput('Do you support OPT or H-1B visas?')}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
            >
              Visa Support?
            </button>
            <button
              onClick={() => setInput('How long does placement take?')}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
            >
              Placement Timeline?
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-100 rounded-xl px-3.5 py-2 text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
