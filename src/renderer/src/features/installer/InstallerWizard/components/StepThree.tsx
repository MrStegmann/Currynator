import React from 'react';
import { Folder, CheckCircle } from 'lucide-react';
import { selectDirectoryService } from '../services/StepThree.service';
import type { StepThreeProps } from '../types/StepThree.types';
import { useNotification } from '../../../../context/NotificationContext';

export const StepThree: React.FC<StepThreeProps> = ({ state, onChange, onComplete }) => {
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
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center">
        <h2 className="text-headline-sm font-bold">Directorio de Salida</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">Selecciona dónde se guardarán los archivos generados y bases de datos locales.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Directorio Actual</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            className="flex-1 p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface text-sm"
            value={state.outputDirectoryPath}
          />
          <button
            onClick={handleBrowseDirectory}
            className="px-4 bg-surface-bright hover:bg-surface-variant border border-border-subtle rounded-md transition-colors flex items-center gap-2"
          >
            <Folder className="w-4 h-4" /> Explorar
          </button>
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={!state.outputDirectoryPath}
        className="mt-6 p-3 bg-green-600 hover:bg-green-500 text-white rounded-md font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" /> Finalizar Configuración
      </button>
    </div>
  );
};
