import React from 'react';

interface DeleteResumeModalProps {
  isOpen: boolean;
  resumeTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Custom deletion modal component featuring a prominent, solid-color "Confirm Deletion" button.
 */
export const DeleteResumeModal: React.FC<DeleteResumeModalProps> = ({
  isOpen,
  resumeTitle,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-slate-100 mb-2">Eliminar Currículum</h3>
        <p className="text-slate-300 text-sm mb-6">
          ¿Estás seguro de que deseas eliminar <span className="font-semibold text-white">"{resumeTitle}"</span>?
          Esta acción eliminará permanentemente el documento y su Guía de Estudio asociada almacenada localmente.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-md shadow-red-900/30 transition-all active:scale-95"
          >
            Confirm Deletion
          </button>
        </div>
      </div>
    </div>
  );
};
