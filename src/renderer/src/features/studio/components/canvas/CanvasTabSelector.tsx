import React from 'react';

interface CanvasTabSelectorProps {
  activeTab: 'resume' | 'study-guide';
  hasStudyGuide: boolean;
  onTabChange: (tab: 'resume' | 'study-guide') => void;
}

/**
 * Top canvas tab selector for switching between Resume View and Study Guide View.
 */
export const CanvasTabSelector: React.FC<CanvasTabSelectorProps> = ({
  activeTab,
  hasStudyGuide,
  onTabChange
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
      <button
        onClick={() => onTabChange('resume')}
        className={`px-4 py-1.5 rounded-lg transition-all ${
          activeTab === 'resume'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        Resume Document
      </button>

      <button
        onClick={() => onTabChange('study-guide')}
        disabled={!hasStudyGuide}
        className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          activeTab === 'study-guide'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
            : hasStudyGuide
            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            : 'text-slate-600 cursor-not-allowed opacity-50'
        }`}
        title={!hasStudyGuide ? 'Generate a study guide first via the right sidebar AI action button' : undefined}
      >
        <span>Study Guide</span>
        {hasStudyGuide && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
      </button>
    </div>
  );
};
