import React, { useEffect, useState } from 'react';

interface SettingsProps {
  onSaveSettings?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [folderPath, setFolderPath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await (window as any).electronAPI?.getSettings();
        if (res?.success) {
          setFolderPath(res.data.dataFolderPath || '');
        }
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSelectFolder = async () => {
    const res = await (window as any).electronAPI?.selectFolder();
    if (res?.success && res.path) {
      setFolderPath(res.path);
    }
  };

  const handleSave = async () => {
    setSaveStatus('Guardando...');
    try {
      const res = await (window as any).electronAPI?.saveSettings({
        dataFolderPath: folderPath
      });
      if (res?.success) {
        setSaveStatus('Configuración guardada correctamente.');
        onSaveSettings?.();
        // Ocultar mensaje de éxito después de unos segundos
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('Error al guardar la configuración.');
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('Error al guardar la configuración.');
    }
  };

  if (isLoading) {
    return <div className="text-[#d3e4fe] p-6">Cargando configuración...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto text-[#d3e4fe]">
      <h2 className="text-3xl font-semibold mb-2 border-b border-[#1E293B] pb-4">Configuración del Sistema</h2>

      {/* Carpeta de Destino */}
      <div className="flex flex-col gap-2 bg-slate-900 border-[1.5px] border-[#1E293B] rounded-xl p-6 shadow-md">
        <label className="text-lg font-medium">Carpeta de guardado de datos</label>
        <p className="text-sm text-[#8c909f] mb-1">
          Directorio raíz donde se crearán las subcarpetas de Currynator (data, CV, study, aiReasoning).
        </p>
        <p className="text-sm text-yellow-500 mb-3">
          <strong>Atención:</strong> Si cambias la ruta, los archivos existentes no se moverán automáticamente. Deberás copiarlos manualmente a la nueva ubicación.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            readOnly
            className="flex-1 px-4 py-2 bg-[#020617] border border-[#1E293B] rounded-md text-[#d3e4fe] font-mono text-sm opacity-80 cursor-not-allowed"
            value={folderPath}
          />
          <button
            onClick={handleSelectFolder}
            className="px-4 py-2 bg-[#1E293B] hover:bg-blue-600 border border-[#1E293B] rounded-md transition-colors font-medium whitespace-nowrap"
          >
            Seleccionar Carpeta
          </button>
        </div>
      </div>



      <div className="flex justify-end items-center gap-4 mt-4">
        {saveStatus && (
          <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {saveStatus}
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md shadow-lg transition-colors"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Settings;
