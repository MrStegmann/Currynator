import React from 'react';
import { Folder } from 'lucide-react';
import { selectDirectoryService } from '../services/StepThree.service';
import type { StepThreeProps } from '../types/StepThree.types';
import { useNotification } from '../../../../context/NotificationContext';

export const StepThree: React.FC<StepThreeProps> = ({ state, onChange, onComplete: _onComplete }) => {
  const { addNotification } = useNotification();

  const handleBrowseDirectory = async () => {
    try {
      const res = await selectDirectoryService();
      if (res.success && res.folderPath) {
        onChange({ outputDirectoryPath: res.folderPath });
      }
    } catch (err) {
      addNotification('Error al seleccionar directorio', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 w-full items-center justify-center">
      <div className="text-center w-full max-w-xl">
        <h2 className="text-headline-sm font-bold">Directorio de Salida</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">
          Selecciona dónde se guardarán los archivos generados y bases de datos locales. Por defecto usaremos tu carpeta de Documentos.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xl mt-4">
        <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
          Ruta del Directorio
        </label>
        <div className="flex flex-row gap-3 w-full">
          <input
            type="text"
            readOnly
            className="flex-1 p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface text-sm focus:outline-none"
            value={state.outputDirectoryPath}
          />
          <button
            onClick={handleBrowseDirectory}
            className="px-6 py-3 bg-surface-bright hover:bg-surface-variant border border-border-subtle rounded-md transition-colors flex items-center justify-center gap-2 text-on-surface font-semibold shadow-sm"
          >
            <Folder className="w-5 h-5 text-primary" /> Explorar
          </button>
        </div>
      </div>

      {/* Finish button is now handled by the Footer in index.tsx */}
    </div>
  );
};
