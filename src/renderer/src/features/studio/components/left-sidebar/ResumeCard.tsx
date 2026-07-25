import React from 'react';
import type { ResumeData } from '../../types/resume.types';

interface ResumeCardProps {
  resume: ResumeData;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDeleteRequest: (resume: ResumeData) => void;
}

/**
 * Individual resume card item inside the left sidebar list.
 */
export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  isActive,
  onSelect,
  onDeleteRequest
}) => {
  const formattedDate = new Date(resume.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      onClick={() => onSelect(resume.id)}
      className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-lg shadow-blue-950/40'
          : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-semibold truncate text-slate-100 flex-1">
          {resume.title}
        </h4>

        {/* Delete Trigger Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(resume);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
          title="Delete resume"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-slate-400 line-clamp-1 mb-2.5">
        {resume.description || `${resume.personalDetails.professionalTitle} • ${resume.experience.length} experiences`}
      </p>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Updated {formattedDate}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
          CV
        </span>
      </div>
    </div>
  );
};
