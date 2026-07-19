import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  return (
    <div className="h-screen w-full p-0.75 bg-transparent overflow-hidden">
      <div className="h-full w-full flex flex-col bg-[#020617]/95 backdrop-blur-md text-[#d3e4fe] font-sans rounded-xl border-[3px] border-white/70 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <header
          className="w-full h-12 max-h-24 flex flex-row items-center justify-between px-6 border-b border-[#1E293B] shrink-0"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white">C</div>
            <h1 className="text-xl font-bold tracking-tight">Currynator</h1>
          </div>

          {/* Window Controls */}
          <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <button
              onClick={() => window.electronAPI?.minimize()}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white"
              title="Minimizar"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="8" x2="14" y2="8" /></svg>
            </button>
            <button
              onClick={() => window.electronAPI?.maximize()}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white"
              title="Maximizar"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="10" height="10" rx="1" /></svg>
            </button>
            <button
              onClick={() => window.electronAPI?.close()}
              className="p-1.5 hover:bg-red-500 hover:text-white rounded-md transition-colors text-white"
              title="Cerrar"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="3" x2="13" y2="13" /><line x1="13" y1="3" x2="3" y2="13" /></svg>
            </button>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 w-full flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-1/4 max-w-[30%] h-full p-6 border-r border-[#1E293B] flex flex-col gap-4">
            <div className="text-sm font-semibold tracking-wider text-[#8c909f] uppercase mb-2">Menú</div>

            <div
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'home' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
            >
              Home
            </div>

            <div
              onClick={() => onNavigate('add-data')}
              className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'add-data' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
            >
              Añadir datos
            </div>

            <div className="flex items-center gap-2 px-3 border-b-3 border-[#1E293B]">
              <h2 className="text-lg font-bold tracking-tight">AI Powered</h2>
            </div>
            <div
              onClick={() => onNavigate('generate-cv')}
              className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'generate-cv' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
            >
              Generar CV
            </div>

            <div
              onClick={() => onNavigate('generate-guide')}
              className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'generate-guide' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
            >
              Generar Study Guide
            </div>

            {/* Spacer para empujar el botón al fondo */}
            <div className="flex-1"></div>

            {/* Settings Button */}
            <div
              onClick={() => onNavigate('settings')}
              className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'settings' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
            >
              Configuración
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1 h-full flex flex-col p-6 overflow-y-auto bg-[#031427]">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
};

