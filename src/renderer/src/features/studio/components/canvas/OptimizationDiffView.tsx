import React from 'react';
import type { ResumeData } from '../../types/resume.types';

interface OptimizationDiffViewProps {
  original: ResumeData;
  proposed: ResumeData;
  onAccept: (updatedResume: ResumeData) => void;
  onReject: () => void;
}

/**
 * Split-screen comparison view displaying original vs. AI-proposed resume changes with Accept/Reject controls.
 */
export const OptimizationDiffView: React.FC<OptimizationDiffViewProps> = ({
  original,
  proposed,
  onAccept,
  onReject
}) => {
  return (
    <div className="flex flex-col h-full bg-[#050912] text-slate-200">
      {/* Top Banner Control */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI Proposed Optimization Review
          </h3>
          <p className="text-xs text-slate-400">
            Compare original resume baseline against proposed improvements. Accept changes to overwrite active document.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Reject Changes
          </button>
          <button
            onClick={() => onAccept(proposed)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
          >
            Accept & Save Changes
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto p-4 gap-4">
        {/* Original Side */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Baseline</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Current</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-semibold text-slate-300 mb-1">Summary</h4>
              <p className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-400 leading-relaxed">
                {original.summary}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-300 mb-1">Work Experience Highlights</h4>
              <div className="space-y-2">
                {original.experience.map((exp) => (
                  <div key={exp.id} className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-800/60">
                    <div className="font-medium text-slate-300 mb-1">{exp.jobTitle} • {exp.companyName}</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proposed Side */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">AI Proposed Updates</span>
            <span className="px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 text-[10px] font-semibold">Optimized</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-semibold text-blue-300 mb-1">Proposed Summary</h4>
              <p className="p-3 rounded-lg bg-blue-950/50 border border-blue-800/60 text-slate-100 leading-relaxed shadow-sm">
                {proposed.summary}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-blue-300 mb-1">Reframed Experience Highlights</h4>
              <div className="space-y-2">
                {proposed.experience.map((exp) => (
                  <div key={exp.id} className="p-2.5 bg-blue-950/40 rounded-lg border border-blue-800/50">
                    <div className="font-medium text-blue-200 mb-1">{exp.jobTitle} • {exp.companyName}</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-200">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
