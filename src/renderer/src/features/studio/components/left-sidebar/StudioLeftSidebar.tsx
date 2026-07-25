import React from 'react';
import type { ResumeData } from '../../types/resume.types';
import { CreateResumeButton } from './CreateResumeButton';
import { ResumeList } from './ResumeList';
import { StudioNavigationHeader } from './StudioNavigationHeader';

interface StudioLeftSidebarProps {
  resumes: ResumeData[];
  activeResumeId: string | null;
  onCreateResume: () => void;
  onSelectResume: (id: string) => void;
  onDeleteRequest: (resume: ResumeData) => void;
  onBackToHome: () => void;
}

/**
 * Left sidebar component housing resume list, creation trigger, and bottom home navigation.
 */
export const StudioLeftSidebar: React.FC<StudioLeftSidebarProps> = ({
  resumes,
  activeResumeId,
  onCreateResume,
  onSelectResume,
  onDeleteRequest,
  onBackToHome
}) => {
  return (
    <aside className="w-80 h-full p-4 bg-[#0a101d] border-r border-slate-800 flex flex-col gap-4 select-none shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
          <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">Studio Workspace</h2>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">v1.0</span>
      </div>

      {/* Creation Button */}
      <CreateResumeButton onCreate={onCreateResume} />

      {/* Resumes List Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Your Resumes ({resumes.length})
        </span>
      </div>

      {/* Resumes List */}
      <ResumeList
        resumes={resumes}
        activeResumeId={activeResumeId}
        onSelectResume={onSelectResume}
        onDeleteRequest={onDeleteRequest}
      />

      {/* Navigation Header (Strictly bottom placement) */}
      <StudioNavigationHeader onBackToHome={onBackToHome} />
    </aside>
  );
};
