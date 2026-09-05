import React from 'react';
import { Home } from 'lucide-react';

interface RightNavBarProps {
  isOpen: boolean;
  activeView: string;
}

export const RightNavBar: React.FC<RightNavBarProps> = ({ isOpen, activeView }) => {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-surface-container-lowest border-r border-outline-variant shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
      } z-40`}
    >
      <nav className="p-4 flex flex-col gap-2 w-64">
        <a
          href="#home"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'Home'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-body-lg">Home</span>
        </a>
      </nav>
    </aside>
  );
};
