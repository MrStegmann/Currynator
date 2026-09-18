import React from 'react';
import { AlertTriangle, Sparkles, X } from 'lucide-react';

interface ScoreConfirmModalProps {
  isOpen: boolean;
  projectCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ScoreConfirmModal: React.FC<ScoreConfirmModalProps> = ({
  isOpen,
  projectCount,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-title-lg font-semibold text-on-surface m-0">
              Confirm AI Scoring
            </h3>
            <p className="text-body-xs text-on-surface-variant mt-0.5">
              Batch repository audit request
            </p>
          </div>
        </div>

        {/* Modal Warning Body Text */}
        <div className="bg-surface-container/60 border border-outline-variant/60 rounded-xl p-4 text-body-sm text-on-surface leading-relaxed">
          {projectCount} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-medium text-body-sm hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary/90 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm & Score All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
