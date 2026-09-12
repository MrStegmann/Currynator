import React from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteCvModalProps {
  isOpen: boolean;
  targetTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCvModal: React.FC<DeleteCvModalProps> = ({
  isOpen,
  targetTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirmar eliminación">
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3 bg-error-container/30 text-error rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>

        <h3 className="text-title-medium font-semibold text-on-surface mb-2">
          ¿Eliminar currículum personalizado?
        </h3>

        <p className="text-body-medium text-on-surface-variant mb-6 max-w-md">
          {targetTitle ? (
            <>
              ¿Estás seguro de que deseas eliminar el CV para <strong className="text-on-surface">"{targetTitle}"</strong>? Esta acción no se puede deshacer.
            </>
          ) : (
            '¿Estás seguro de que deseas eliminar este currículum personalizado? Esta acción no se puede deshacer.'
          )}
        </p>

        <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-outline-variant">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-outline text-on-surface font-medium hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-error text-on-error font-medium hover:bg-error/90 transition-colors shadow-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
};
