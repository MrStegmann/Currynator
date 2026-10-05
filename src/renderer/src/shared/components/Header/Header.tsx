import React from 'react';
import { Menu, PanelRight } from 'lucide-react';
import { HeaderProps } from '../../types/navigation';

export const Header: React.FC<HeaderProps> = ({
  currentViewName,
  onToggleSidebar,
  onToggleToolbar,
  showBurger = false,
  showToolbarToggle = false,
  rightSlot,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-surface-container-lowest border-b border-outline-variant shadow-sm h-16">
      <div className="flex items-center gap-4">
        {showBurger && (
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-md hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-on-surface" />
          </button>
        )}
        <h1 className="text-headline-md text-on-surface m-0 font-semibold tracking-tight">
          {currentViewName}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {rightSlot}
        {showToolbarToggle && (
          <button
            onClick={onToggleToolbar}
            className="p-2 -mr-2 rounded-md hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            aria-label="Toggle toolbar"
          >
            <PanelRight className="w-6 h-6 text-on-surface" />
          </button>
        )}
      </div>
    </header>
  );
};
