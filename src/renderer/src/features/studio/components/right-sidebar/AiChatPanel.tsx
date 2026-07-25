import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/studio.types';

interface AiChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  injectedContext?: string | null;
  onClearInjectedContext?: () => void;
}

/**
 * Interactive AI chat assistant component for right sidebar.
 */
export const AiChatPanel: React.FC<AiChatPanelProps> = ({
  messages,
  onSendMessage,
  injectedContext,
  onClearInjectedContext
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Assistant Chat</span>
        </div>
      </div>

      {/* Injected Section Context Indicator */}
      {injectedContext && (
        <div className="p-2.5 bg-blue-950/60 border-b border-blue-800/60 text-xs text-blue-200 flex items-center justify-between gap-2 shrink-0">
          <div className="truncate flex-1">
            <span className="font-bold text-blue-400">Attached Context: </span>
            <span className="italic">{injectedContext.slice(0, 60)}...</span>
          </div>
          {onClearInjectedContext && (
            <button
              onClick={onClearInjectedContext}
              className="text-blue-400 hover:text-white font-bold text-sm px-1"
              title="Clear attached context"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-slate-500 p-4">
            <p className="leading-relaxed">
              Ask any question about your active resume, technical preparation, or study guide modules.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">{msg.timestamp}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition-all shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
};
