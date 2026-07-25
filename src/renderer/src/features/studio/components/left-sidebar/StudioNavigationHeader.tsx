import React from 'react';

interface StudioNavigationHeaderProps {
  onBackToHome: () => void;
}

/**
 * Sidebar navigation header component.
 * Displays title and renders the "Back to Home" button strictly as the last option in the left sidebar.
 */
export const StudioNavigationHeader: React.FC<StudioNavigationHeaderProps> = ({ onBackToHome }) => {
  return (
    <div className="pt-4 border-t border-slate-800 mt-auto">
      <button
        onClick={onBackToHome}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 text-xs font-medium"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Exit Studio</span>
      </button>
    </div>
  );
};
