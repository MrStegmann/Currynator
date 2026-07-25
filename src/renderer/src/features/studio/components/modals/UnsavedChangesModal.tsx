import React from 'react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onSaveAndContinue: () => void;
  onDiscardAndContinue: () => void;
  onCancel: () => void;
}

/**
 * Guard modal triggered when switching context or navigating away with unsaved edits.
 */
export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onSaveAndContinue,
  onDiscardAndContinue,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-amber-400 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-100">Cambios Sin Guardar</h3>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Tienes cambios sin guardar en el currículum activo. ¿Qué deseas hacer antes de continuar?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onDiscardAndContinue}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-sm font-semibold transition-colors"
          >
            Discard & Continue
          </button>

          <button
            onClick={onSaveAndContinue}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/30 transition-all active:scale-95"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
