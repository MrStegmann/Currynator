import React from 'react';
import { Folder, FolderOpen } from 'lucide-react';

interface Step3Props {
  data: { dataFolderPath: string };
  updateData: (data: Partial<{ dataFolderPath: string }>) => void;
  onFinish: () => void;
  onBack: () => void;
}

export default function Step3Directory({ data, updateData, onFinish, onBack }: Step3Props) {
  
  const handleSelectFolder = async () => {
    try {
      const result = await (window as any).electronAPI.selectFolder();
      if (result.success && result.path) {
        updateData({ dataFolderPath: result.path });
      }
    } catch (e) {
      console.error('Error selecting folder:', e);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="space-y-2 text-center mb-4">
        <h2 className="text-headline-md text-on-surface">Ubicación de los Datos</h2>
        <p className="text-body-md text-on-surface-variant">
          Selecciona el directorio donde se guardarán todos los datos y la información generada por Currynator.
        </p>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg p-6 space-y-4">
        <div className="space-y-1 relative">
          <label className="text-label-caps text-on-surface-variant">Directorio de Trabajo</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={data.dataFolderPath}
                readOnly
                className="w-full bg-surface-deep border border-outline-variant rounded px-10 py-2 text-on-surface font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-default"
              />
            </div>
            <button
              onClick={handleSelectFolder}
              className="bg-surface-variant text-on-surface px-4 py-2 rounded text-sm font-medium hover:bg-surface-bright transition-colors flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" /> Examinar
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-border-subtle">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-on-surface px-4 py-2 rounded transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onFinish}
          className="bg-primary text-on-primary px-6 py-2 rounded font-medium hover:bg-primary-container transition-all"
        >
          Finalizar y Entrar
        </button>
      </div>
    </div>
  );
}
