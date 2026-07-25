import React from 'react';
import { CanvasTabSelector } from './CanvasTabSelector';

interface CanvasHeaderBarProps {
  activeTab: 'resume' | 'study-guide';
  hasStudyGuide: boolean;
  viewMode: 'edit' | 'preview' | 'optimization-diff';
  isDirty: boolean;
  onTabChange: (tab: 'resume' | 'study-guide') => void;
  onViewModeChange: (mode: 'edit' | 'preview') => void;
  onSaveResume: () => void;
  onExportResumePdf: () => void;
  onExportStudyGuidePdf: () => void;
}

/**
 * Sticky top action bar for the main workspace canvas.
 */
export const CanvasHeaderBar: React.FC<CanvasHeaderBarProps> = ({
  activeTab,
  hasStudyGuide,
  viewMode,
  isDirty,
  onTabChange,
  onViewModeChange,
  onSaveResume,
  onExportResumePdf,
  onExportStudyGuidePdf
}) => {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 p-4 bg-[#060b14]/90 backdrop-blur-md border-b border-slate-800 shrink-0">
      {/* Tab Switcher */}
      <CanvasTabSelector
        activeTab={activeTab}
        hasStudyGuide={hasStudyGuide}
        onTabChange={onTabChange}
      />

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {activeTab === 'resume' ? (
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => onViewModeChange('edit')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Form Editor
              </button>
              <button
                onClick={() => onViewModeChange('preview')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ATS Preview
              </button>
            </div>

            {/* Export PDF */}
            <button
              onClick={onExportResumePdf}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>

            {/* Save Resume Button: Conditionally rendered; HIDDEN when isDirty === false */}
            {isDirty && (
              <button
                onClick={onSaveResume}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all animate-in fade-in duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            )}
          </>
        ) : (
          /* Study Guide Actions */
          <button
            onClick={onExportStudyGuidePdf}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Study Guide PDF
          </button>
        )}
      </div>
    </header>
  );
};
