import React from 'react';
import type { ProjectItem } from '../../../types';

export interface WizardStepProjectsProps {
  proposedProjects: ProjectItem[];
  reasoning: string;
}

/**
 * Step 6 View: Technical Projects Selection.
 *
 * @param props - Component props containing proposed projects array (min 3) and AI reasoning.
 * @returns React element.
 */
export const WizardStepProjects: React.FC<WizardStepProjectsProps> = ({
  proposedProjects,
  reasoning
}) => {
  return (
    <div className="space-y-4 text-slate-200">
      <div>
        <h4 className="text-sm font-semibold text-blue-400">Step 6: Technical Projects Selection</h4>
        <p className="text-xs text-slate-400">
          Selects at least 3 relevant technical projects that support your target professional title and summary.
        </p>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {proposedProjects.map((proj, idx) => (
          <div key={proj.id || idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-200">{proj.name}</h5>
            <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {proj.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
        {proposedProjects.length < 3 && (
          <p className="text-xs text-amber-400 italic">
            Note: Selecting at least 3 projects is recommended for full ATS impact.
          </p>
        )}
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
