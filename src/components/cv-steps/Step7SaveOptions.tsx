import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';

export interface Step7SaveOptionsProps {
  fileName: string;
  defaultFileName: string;
  onChange: (name: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const Step7SaveOptions: React.FC<Step7SaveOptionsProps> = ({
  fileName,
  defaultFileName,
  onChange,
  onValidationChange
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoGenerate = () => {
    onChange(defaultFileName);
  };

  useEffect(() => {
    if (!fileName) {
      setError('El nombre no puede estar vacío.');
      onValidationChange(false);
      return;
    }

    if (!fileName.endsWith('.json')) {
      setError('El archivo debe tener extensión .json');
      onValidationChange(false);
      return;
    }

    const checkExists = async () => {
      setIsChecking(true);
      try {
        const res = await (window as any).electronAPI.checkFileExists(fileName, 'cv');
        if (res?.success && res.exists) {
          setError('Ya existe un CV generado con ese nombre.');
          onValidationChange(false);
        } else {
          setError(null);
          onValidationChange(true);
        }
      } catch (err) {
        setError('Error al verificar el nombre.');
        onValidationChange(false);
      } finally {
        setIsChecking(false);
      }
    };

    const debounce = setTimeout(() => checkExists(), 500);
    return () => clearTimeout(debounce);
  }, [fileName, onValidationChange]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
        <h2 className="text-xl font-semibold text-[#d3e4fe]">Paso 7: Opciones de Guardado</h2>
      </div>

      <div className="flex flex-col gap-4 bg-[#0b1c30] p-6 rounded-lg border border-[#1E293B]">
        <div className="flex flex-col gap-2">
          <label className="text-[#8c909f] font-semibold text-sm">
            Nombre del archivo para guardar el CV
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => onChange(e.target.value)}
              className={`flex-1 bg-[#020617] border ${error ? 'border-red-500' : 'border-[#1E293B]'} text-[#d3e4fe] rounded-md p-3 focus:outline-none focus:border-blue-500`}
              placeholder="mi_cv_optimizado.json"
            />
            <button
              onClick={handleAutoGenerate}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#d3e4fe] rounded-md transition-colors flex items-center justify-center gap-2"
              title="Autogenerar nombre"
            >
              <Wand2 size={16} /> Autogenerar
            </button>
          </div>
          {isChecking && <span className="text-xs text-blue-400">Verificando disponibilidad...</span>}
          {error && <span className="text-xs text-red-500">{error}</span>}
          {!error && !isChecking && fileName && <span className="text-xs text-green-500">Nombre válido y disponible.</span>}
        </div>
      </div>
    </div>
  );
};

export default Step7SaveOptions;
