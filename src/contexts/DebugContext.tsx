import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: string;
}

interface DebugContextProps {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  logs: LogEntry[];
  log: (level: LogLevel, message: string, details?: string) => void;
  clearLogs: () => void;
}

const DebugContext = createContext<DebugContextProps | undefined>(undefined);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('currynator_debug_mode');
    return stored === 'true';
  });
  
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const toggleDebugMode = () => {
    setIsDebugMode(prev => {
      const newVal = !prev;
      localStorage.setItem('currynator_debug_mode', String(newVal));
      return newVal;
    });
  };

  const log = useCallback((level: LogLevel, message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      level,
      message,
      details,
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Global error listeners
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      log('error', `Unhandled Error: ${event.message}`, event.error?.stack || event.filename);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = typeof event.reason === 'object' ? event.reason?.message || 'Rechazo de promesa' : String(event.reason);
      const stack = typeof event.reason === 'object' ? event.reason?.stack : undefined;
      log('error', `Unhandled Promise Rejection: ${message}`, stack);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [log]);

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode, logs, log, clearLogs }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
