import React from 'react';

export interface WizardStepSummaryProps {
  currentSummary: string;
  proposedSummary: string;
  reasoning: string;
}

/**
 * Step 2 View: Professional Summary Review.
 *
 * @param props - Component props containing current and proposed professional summary with AI reasoning.
 * @returns React element.
 */
export const WizardStepSummary: React.FC<WizardStepSummaryProps> = ({
  currentSummary,
  proposedSummary,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 2: Professional Summary Optimization</h4>
        <p className="text-xs text-slate-400">
          Rewrites your summary for ATS compliance and recruiter impact using Google&apos;s XYZ formula.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Current Summary</span>
          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{currentSummary || '(No summary set)'}</p>
        </div>

        <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/30 space-y-1.5">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">Proposed ATS Summary</span>
          <p className="text-xs text-blue-100 whitespace-pre-wrap leading-relaxed">{proposedSummary}</p>
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
