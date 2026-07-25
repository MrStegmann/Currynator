import React from 'react';
import type { StudyGuideData, StudyGuideSection } from '../../types/studio.types';

interface StudyGuideViewerProps {
  guide: StudyGuideData;
  onAskAi: (sectionContext: string) => void;
  containerId?: string;
}

/**
 * Read-only lightweight learning UI displaying the active Study Guide.
 */
export const StudyGuideViewer: React.FC<StudyGuideViewerProps> = ({
  guide,
  onAskAi,
  containerId = 'study-guide-printable-document'
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-slate-200" id={containerId}>
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/40 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
            Active Study Guide
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {guide.sections.length} Technical Modules
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Technical Interview & Concept Guide</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Targeted study material extracted from your active resume skills, project architectures, and experience.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-8">
        {guide.sections.map((sec: StudyGuideSection, index: number) => (
          <section
            key={sec.id}
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-lg relative group"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center">
                  0{index + 1}
                </span>
                <h3 className="text-lg font-bold text-white">{sec.keyword}</h3>
              </div>

              {/* Ask AI Trigger Button */}
              <button
                onClick={() =>
                  onAskAi(
                    `Topic: ${sec.keyword}\nSummary: ${sec.conceptSummary}\nTakeaways: ${sec.keyTakeaways.join('; ')}`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Ask AI about this Section
              </button>
            </div>

            {/* 1. Concept Explanations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Concept Summary & Takeaways
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {sec.conceptSummary}
              </p>
              <ul className="space-y-1.5 pl-2 text-xs text-slate-300">
                {sec.keyTakeaways.map((takeaway, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Simulated Interview Questions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Simulated Interview Questions
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {sec.simulatedInterview.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{q.topic}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-950 text-emerald-300'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">Q: {q.question}</p>
                    <div className="text-xs text-slate-300 pt-2 border-t border-slate-900 leading-relaxed">
                      <span className="font-semibold text-emerald-400">Proposed Answer: </span>
                      {q.proposedAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Practical Exercises */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Practical Exercises & Scenarios
              </h4>
              {sec.practicalExercises.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
                  <p className="font-semibold text-amber-200">Scenario: {ex.scenario}</p>
                  <p className="text-slate-300"><span className="font-semibold text-slate-200">Objective:</span> {ex.objective}</p>
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-300/90 leading-relaxed">
                    <span className="font-bold">Solution Strategy: </span>
                    {ex.solutionStrategy}
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Project Execution Tips */}
            {sec.projectTips.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Tactical Project Talking Points
                </h4>
                <ul className="space-y-1 pl-2 text-xs text-slate-300">
                  {sec.projectTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400">⚡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
