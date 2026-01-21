
import React, { useEffect, useRef, useState } from 'react';
import { Send, Terminal, Sparkles, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isAsking: boolean;
  error: string | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isAsking, error }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAsking]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isAsking) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <Terminal className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100">AI Incident Intelligence</h1>
            <p className="text-xs text-slate-500">RAG-powered AI for logs and system incidents</p>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Intelligent Diagnostics</h2>
            <p className="text-slate-400 leading-relaxed">
              Upload log files or incident reports to the knowledge base, and ask me specific questions about your infrastructure status or errors.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
            }`}>
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isAsking && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-5 py-4 flex gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe an incident or ask a question..."
            rows={1}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all resize-none shadow-xl custom-scrollbar"
            style={{ minHeight: '56px', maxHeight: '200px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAsking}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all
              ${!input.trim() || isAsking 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-3 font-medium tracking-wide uppercase">
          AI generated responses may require verification. Grounded in your knowledge base.
        </p>
      </div>
    </div>
  );
};
