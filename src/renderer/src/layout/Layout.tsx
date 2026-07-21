import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  return (

    <div className="h-screen w-full flex flex-col bg-[#020617]/95 backdrop-blur-md text-[#d3e4fe] font-sans relative">
      {/* Main Container */}
      <main className="flex-1 w-full flex h-full max-h-full overflow-hidden">
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
            onClick={() => onNavigate('github')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${currentPage === 'github' ? 'bg-[#102034] text-blue-400' : 'hover:bg-[#0b1c30]'}`}
          >
            GitHub
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
  );
};

