import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  currentViewName: string;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentViewName, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface-container-lowest border-b border-outline-variant shadow-sm h-16">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-on-surface" />
        </button>
      </div>
      <h1 className="text-headline-md text-on-surface m-0 font-semibold tracking-tight">
        {currentViewName}
      </h1>
    </header>
  );
};
