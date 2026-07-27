import React from 'react';
import type { WorkExperienceItem } from '../../../types';

export interface WizardStepExperienceProps {
  proposedExperience: WorkExperienceItem[];
  reasoning: string;
}

/**
 * Step 3 View: Work Experience & Highlights Optimization.
 *
 * @param props - Component props containing proposed work experience array and AI reasoning.
 * @returns React element.
 */
export const WizardStepExperience: React.FC<WizardStepExperienceProps> = ({
  proposedExperience,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 3: Work Experience & High-Impact Bullets</h4>
        <p className="text-xs text-slate-400">
          Filters relevant roles and rephrases bullet points using Google&apos;s XYZ formula with strong technical verbs.
        </p>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {proposedExperience.map((exp, idx) => (
          <div key={exp.id || idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-200">
                {exp.jobTitle} <span className="text-slate-400 font-normal">at {exp.companyName}</span>
              </h5>
              <span className="text-[11px] text-slate-400">
                {exp.startMonth} {exp.startYear} - {exp.isCurrentRole ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
              </span>
            </div>
            {exp.context && <p className="text-xs text-slate-400 italic">{exp.context}</p>}
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {exp.highlights.map((bullet, bIdx) => (
                <li key={bIdx} className="leading-relaxed">
                  <span className="text-slate-200 font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
