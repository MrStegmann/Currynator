import React from 'react';

interface AiActionButtonsProps {
  onCreateStudyGuide: () => void;
  onGeneralOptimization: () => void;
  onSpecificOptimization: () => void;
  isProcessing: boolean;
  hasActiveResume: boolean;
}

/**
 * Top action buttons in the right sidebar for AI-driven study guide generation and resume optimizations.
 */
export const AiActionButtons: React.FC<AiActionButtonsProps> = ({
  onCreateStudyGuide,
  onGeneralOptimization,
  onSpecificOptimization,
  isProcessing,
  hasActiveResume
}) => {
  return (
    <div className="space-y-2 pb-4 border-b border-slate-800">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        AI Assistant Tools
      </h3>

      {/* 1. Create Study Guide */}
      <button
        onClick={onCreateStudyGuide}
        disabled={isProcessing || !hasActiveResume}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/40 hover:border-blue-500/60 disabled:opacity-50 text-left transition-all group"
      >
        <div>
          <h4 className="text-xs font-bold text-blue-300 group-hover:text-blue-200">Create Study Guide</h4>
          <p className="text-[10px] text-slate-400">Extracts tech concepts into study modules</p>
        </div>
        <span className="text-blue-400 font-bold text-sm">+</span>
      </button>

      {/* 2. AI Optimization */}
      <button
        onClick={onGeneralOptimization}
        disabled={isProcessing || !hasActiveResume}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-left transition-all group"
      >
        <div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">AI Optimization</h4>
          <p className="text-[10px] text-slate-400">Enhance tone, metrics, and clarity</p>
        </div>
        <span className="text-purple-400 text-xs">✨</span>
      </button>

      {/* 3. AI Specific Optimization */}
      <button
        onClick={onSpecificOptimization}
        disabled={isProcessing || !hasActiveResume}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-left transition-all group"
      >
        <div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">AI Driven</h4>
          <p className="text-[10px] text-slate-400">Tailor for company & target position</p>
        </div>
        <span className="text-emerald-400 text-xs">🎯</span>
      </button>
    </div>
  );
};
