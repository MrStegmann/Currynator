import React from 'react';
import type { ResumeData } from '../../types/resume.types';
import type { StudyGuideData } from '../../types/studio.types';
import { CanvasHeaderBar } from './CanvasHeaderBar';
import { ResumeContentContainer } from './ResumeContentContainer';
import { StudyGuideViewer } from './StudyGuideViewer';

interface StudioCanvasProps {
  activeResume: ResumeData | null;
  activeStudyGuide: StudyGuideData | null;
  activeTab: 'resume' | 'study-guide';
  viewMode: 'edit' | 'preview' | 'optimization-diff';
  isDirty: boolean;
  diffData: {
    original: ResumeData | null;
    proposed: ResumeData | null;
  } | null;
  onTabChange: (tab: 'resume' | 'study-guide') => void;
  onViewModeChange: (mode: 'edit' | 'preview') => void;
  onResumeChange: (updatedResume: ResumeData) => void;
  onSaveResume: () => void;
  onExportResumePdf: () => void;
  onExportStudyGuidePdf: () => void;
  onAcceptDiff: (updatedResume: ResumeData) => void;
  onRejectDiff: () => void;
  onAskAiFromSection: (context: string) => void;
}

/**
 * Main workspace canvas rendering active tab view, sticky controls, and document export handlers.
 */
export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  activeResume,
  activeStudyGuide,
  activeTab,
  viewMode,
  isDirty,
  diffData,
  onTabChange,
  onViewModeChange,
  onResumeChange,
  onSaveResume,
  onExportResumePdf,
  onExportStudyGuidePdf,
  onAcceptDiff,
  onRejectDiff,
  onAskAiFromSection
}) => {
  if (!activeResume) {
    return (
      <main className="flex-1 h-full bg-[#030712] flex items-center justify-center p-6 text-center text-slate-400">
        <div className="max-w-md space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-800/40 text-blue-400 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200">No Resume Selected</h3>
          <p className="text-xs text-slate-400">
            Select an existing resume from the left sidebar or create a new resume to open the workspace.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-full flex flex-col bg-[#030712] overflow-hidden">
      {/* Sticky Top Header Controls */}
      <CanvasHeaderBar
        activeTab={activeTab}
        hasStudyGuide={!!activeStudyGuide}
        viewMode={viewMode}
        isDirty={isDirty}
        onTabChange={onTabChange}
        onViewModeChange={onViewModeChange}
        onSaveResume={onSaveResume}
        onExportResumePdf={onExportResumePdf}
        onExportStudyGuidePdf={onExportStudyGuidePdf}
      />

      {/* Main Tab Workspace Content */}
      <section className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'resume' ? (
          <ResumeContentContainer
            resume={activeResume}
            viewMode={viewMode}
            diffData={diffData}
            onChange={onResumeChange}
            onAcceptDiff={onAcceptDiff}
            onRejectDiff={onRejectDiff}
          />
        ) : (
          activeStudyGuide && (
            <StudyGuideViewer
              guide={activeStudyGuide}
              onAskAi={onAskAiFromSection}
            />
          )
        )}
      </section>
    </main>
  );
};
