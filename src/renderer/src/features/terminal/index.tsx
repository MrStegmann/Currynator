import React, { useState, useEffect, useRef } from 'react';
import { executeTerminalCommand, onTerminalLog } from './services/Terminal.service';
import type { TerminalLog } from './types/Terminal.types';

interface TerminalProps {
  onClose?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = onTerminalLog((log) => {
      setLogs(prev => [...prev, log]);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async () => {
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    
    // Add command to log directly
    setLogs(prev => [...prev, {
      type: 'log',
      timestamp: new Date(),
      fileName: 'User',
      lineNumber: 0,
      message: `> ${input}`
    }]);

    setInput('');

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    if (cmd === 'exit') {
      if (onClose) onClose();
      return;
    }

    await executeTerminalCommand(input);
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const formatTimestamp = (dateRaw: string | Date) => {
    if (!dateRaw) return '';
    const date = new Date(dateRaw);
    return date.toLocaleTimeString();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-[#d3e4fe] font-mono rounded-lg border border-[#1E293B] overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-300">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1" ref={scrollRef}>
        {logs.length === 0 && (
          <div className="text-gray-500 italic">Terminal initialized. Type 'help' to see commands.</div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className={`text-sm ${getLogColor(log.type)} break-words whitespace-pre-wrap`}>
            <span className="text-gray-500 mr-2">[{formatTimestamp(log.timestamp)}]</span>
            {log.fileName !== 'User' && (
              <span className="text-gray-400 mr-2">[{log.fileName}:{log.lineNumber}]</span>
            )}
            {log.message}
          </div>
        ))}
      </div>
      <div className="h-12 border-t border-[#1E293B] flex items-center bg-[#0b1c30]">
        <span className="pl-4 pr-2 text-blue-400 font-bold">$</span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-[#d3e4fe] font-mono px-2"
          placeholder="Type a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand();
          }}
          autoFocus
        />
        <button 
          onClick={handleCommand}
          className="px-6 h-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Terminal;
