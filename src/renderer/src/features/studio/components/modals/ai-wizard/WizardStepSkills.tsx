import React from 'react';
import type { SkillCategory } from '../../../types';

export interface WizardStepSkillsProps {
  proposedSkills: SkillCategory[];
  reasoning: string;
}

/**
 * Step 6 View: Skills Categorization & Optimization.
 *
 * @param props - Component props containing proposed skill categories and AI reasoning.
 * @returns React element.
 */
export const WizardStepSkills: React.FC<WizardStepSkillsProps> = ({
  proposedSkills,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 6: Hard & Soft Skills Selection</h4>
        <p className="text-xs text-slate-400">
          Categorizes technical proficiencies and soft skills for recruiter scanning and ATS keyword matching.
        </p>
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {proposedSkills.map((cat, idx) => (
          <div key={idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-300">{cat.category}</h5>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
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
