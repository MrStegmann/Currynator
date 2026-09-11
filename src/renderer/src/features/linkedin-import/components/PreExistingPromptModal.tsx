import React from 'react';

interface PreExistingPromptModalProps {
  isOpen: boolean;
  onReplace: () => void;
  onKeep: () => void;
  onCancel?: () => void;
}

export const PreExistingPromptModal: React.FC<PreExistingPromptModalProps> = ({
  isOpen,
  onReplace,
  onKeep,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-warning">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-title-lg font-semibold text-on-surface m-0">
            Existing Resume Data Found
          </h3>
        </div>

        <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
          You already have resume data stored. How would you like to handle the newly imported LinkedIn CSV information?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onReplace}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-error/10 hover:bg-error/20 border border-error/30 text-error rounded-xl font-medium transition-colors cursor-pointer text-left"
          >
            <div>
              <div className="font-semibold text-body-lg">Replace</div>
              <div className="text-body-sm opacity-80">Overwrite existing data completely with LinkedIn data</div>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button
            onClick={onKeep}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-primary-container hover:bg-primary-container/80 border border-primary/20 text-on-primary-container rounded-xl font-medium transition-colors cursor-pointer text-left"
          >
            <div>
              <div className="font-semibold text-body-lg">Keep & Merge</div>
              <div className="text-body-sm text-on-surface-variant">Append new LinkedIn entries without deleting existing ones</div>
            </div>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-2 text-center text-body-md text-on-surface-variant hover:text-on-surface py-2 cursor-pointer font-medium"
            >
              Cancel Import
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
