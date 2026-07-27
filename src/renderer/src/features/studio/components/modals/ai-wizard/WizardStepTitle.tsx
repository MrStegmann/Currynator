import React from 'react';

export interface WizardStepTitleProps {
  currentTitle: string;
  proposedTitle: string;
  reasoning: string;
}

/**
 * Step 1 View: Professional Title Review.
 *
 * @param props - Step title properties containing current and proposed title with AI reasoning.
 * @returns React element.
 */
export const WizardStepTitle: React.FC<WizardStepTitleProps> = ({
  currentTitle,
  proposedTitle,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 1: Professional Title Optimization</h4>
        <p className="text-xs text-slate-400">
          Standardizes your professional title for ATS parsing and immediate recruiter impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Current Title</span>
          <p className="text-sm font-medium text-slate-300">{currentTitle || '(Not set)'}</p>
        </div>

        <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/30 space-y-1.5">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">Proposed Optimized Title</span>
          <p className="text-sm font-bold text-blue-200">{proposedTitle}</p>
        </div>
      </div>

      {reasoning && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-blue-400">AI Rationale:</span>
          <p className="text-slate-400">{reasoning}</p>
        </div>
      )}
    </div>
  );
};
