import React from 'react';
import { Home, FileText } from 'lucide-react';

interface RightNavBarProps {
  isOpen: boolean;
  activeView: string;
  onSelectView?: (view: 'Home' | 'CV Dashboard') => void;
}

export const RightNavBar: React.FC<RightNavBarProps> = ({ isOpen, activeView, onSelectView }) => {
  const handleViewClick = (e: React.MouseEvent, view: 'Home' | 'CV Dashboard') => {
    e.preventDefault();
    if (onSelectView) {
      onSelectView(view);
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-surface-container-lowest border-r border-outline-variant shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
      } z-40`}
    >
      <nav className="p-4 flex flex-col gap-2 w-64">
        <a
          href="#home"
          onClick={(e) => handleViewClick(e, 'Home')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'Home'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-body-lg">Home</span>
        </a>
        <a
          href="#cv-dashboard"
          onClick={(e) => handleViewClick(e, 'CV Dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'CV Dashboard'
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-body-lg">CV Dashboard</span>
        </a>
      </nav>
    </aside>
  );
};
