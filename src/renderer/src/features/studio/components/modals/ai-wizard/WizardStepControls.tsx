import React from 'react';
import { Sparkles, Check, SkipForward, Loader2 } from 'lucide-react';

export interface WizardStepControlsProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  userFeedback: string;
  onFeedbackChange: (text: string) => void;
  onAccept: () => void;
  onRepropose: () => void;
  onSkip: () => void;
  onClose: () => void;
}

/**
 * Bottom controls bar for step-by-step AI optimization wizard.
 *
 * @param props - Step controls properties and callback handlers.
 * @returns React component.
 */
export const WizardStepControls: React.FC<WizardStepControlsProps> = ({
  currentStep,
  totalSteps,
  isLoading,
  userFeedback,
  onFeedbackChange,
  onAccept,
  onRepropose,
  onSkip,
  onClose
}) => {
  const isLanguageStep = currentStep === 1;

  return (
    <div className="space-y-3 pt-4 border-t border-slate-800">
      {!isLanguageStep && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Custom Feedback / Re-proposal Instructions (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userFeedback}
              placeholder="e.g. Make it more technical, highlight leadership, use [X%] metrics placeholder..."
              onChange={(e) => onFeedbackChange(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={onRepropose}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              Re-propose
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancel & Close
        </button>

        <div className="flex items-center gap-2">
          {!isLanguageStep && (
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" /> Skip Section
            </button>
          )}

          <button
            type="button"
            onClick={onAccept}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {isLanguageStep ? 'Confirm & Start' : currentStep === totalSteps ? 'Accept & Finish' : 'Accept & Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
