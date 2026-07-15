import React, { useRef, useEffect } from 'react';
import { useDebug } from '../../contexts/DebugContext';
import { Terminal, Trash2, XCircle, AlertTriangle, Info } from 'lucide-react';

const DebugTerminal: React.FC = () => {
  const { logs, clearLogs, isDebugMode, toggleDebugMode } = useDebug();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isDebugMode]);

  if (!isDebugMode) return null;

  return (
    <div className="flex flex-col h-48 bg-[#000f21] border-t-2 border-[#1E293B] shrink-0 font-mono text-sm relative z-40">
      {/* Header del Terminal */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0b1c30] border-b border-[#1E293B] shrink-0">
        <div className="flex items-center gap-2 text-[#8c909f]">
          <Terminal size={14} />
          <span className="text-xs font-bold tracking-widest uppercase">Modo Dev</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearLogs} className="text-[#8c909f] hover:text-white transition-colors" title="Limpiar Terminal">
            <Trash2 size={14} />
          </button>
          <button onClick={toggleDebugMode} className="text-[#8c909f] hover:text-[#EF4444] transition-colors" title="Cerrar Modo Dev">
            <XCircle size={14} />
          </button>
        </div>
      </div>
      
      {/* Cuerpo del Terminal */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
        {logs.length === 0 ? (
          <div className="text-[#424754] italic">Esperando eventos del sistema...</div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex flex-col gap-0.5 border-l-2 pl-2" style={{
              borderColor: log.level === 'error' ? '#EF4444' : log.level === 'warn' ? '#F59E0B' : '#3B82F6'
            }}>
              <div className="flex items-start gap-2">
                <span className="text-[#424754] text-xs shrink-0 w-20 pt-[2px]">
                  {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                {log.level === 'error' && <AlertTriangle size={14} className="text-[#EF4444] shrink-0 mt-[2px]" />}
                {log.level === 'warn' && <AlertTriangle size={14} className="text-[#F59E0B] shrink-0 mt-[2px]" />}
                {log.level === 'info' && <Info size={14} className="text-[#3B82F6] shrink-0 mt-[2px]" />}
                
                <span className={`flex-1 font-medium ${
                  log.level === 'error' ? 'text-[#ffb4ab]' : log.level === 'warn' ? 'text-[#F59E0B]' : 'text-[#adc6ff]'
                }`}>
                  {log.message}
                </span>
              </div>
              {log.details && (
                <div className="text-[#8c909f] text-[11px] whitespace-pre-wrap ml-[6.5rem]">
                  {log.details}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default DebugTerminal;
