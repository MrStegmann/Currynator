import React from 'react';
import type { ResumeData } from '../../types/resume.types';
import { ResumeCard } from './ResumeCard';

interface ResumeListProps {
  resumes: ResumeData[];
  activeResumeId: string | null;
  onSelectResume: (id: string) => void;
  onDeleteRequest: (resume: ResumeData) => void;
}

/**
 * Scrollable list container displaying available user resumes in the Studio sidebar.
 */
export const ResumeList: React.FC<ResumeListProps> = ({
  resumes,
  activeResumeId,
  onSelectResume,
  onDeleteRequest
}) => {
  if (resumes.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-center">
        <p className="text-xs text-slate-400">No resumes found.</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Click "Create New Resume" above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          isActive={resume.id === activeResumeId}
          onSelect={onSelectResume}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
};
