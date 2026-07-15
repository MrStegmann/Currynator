import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import ViewStudyGuide from '../components/Study/ViewStudyGuide';
import { useNotification } from '../contexts/NotificationContext';

interface GenerateGuideProps {
  onSuccess?: () => void;
}

const GenerateGuide: React.FC<GenerateGuideProps> = ({ onSuccess }) => {
  const { addNotification } = useNotification();
  const [cvFiles, setCvFiles] = useState<{ filename: string, hasJobDetails: boolean }[]>([]);
  const [selectedCV, setSelectedCV] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isFileNameValid, setIsFileNameValid] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States to hold guide data for rendering/exporting
  const [studyGuideData, setStudyGuideData] = useState<any>(null);
  const [studyGuideBaseName, setStudyGuideBaseName] = useState<string>('');

  useEffect(() => {
    const loadCVs = async () => {
      const res = await (window as any).electronAPI?.listGeneratedCVs();
      if (res?.success) {
        setCvFiles(res.files);
      }
    };
    loadCVs();
  }, []);

  useEffect(() => {
    if (!fileName) {
      setError('El nombre no puede estar vacío.');
      setIsFileNameValid(false);
      return;
    }

    if (!fileName.endsWith('.pdf')) {
      setError('El archivo debe tener extensión .pdf');
      setIsFileNameValid(false);
      return;
    }

    const checkExists = async () => {
      setIsChecking(true);
      try {
        const res = await (window as any).electronAPI.checkFileExists(fileName, 'guide');
        if (res?.success && res.exists) {
          setError('Ya existe un guion generado con ese nombre.');
          setIsFileNameValid(false);
        } else {
          setError(null);
          setIsFileNameValid(true);
        }
      } catch (err) {
        setError('Error al verificar el nombre.');
        setIsFileNameValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    const debounce = setTimeout(() => checkExists(), 500);
    return () => clearTimeout(debounce);
  }, [fileName]);

  const handleAutoGenerate = () => {
    if (selectedCV) {
      let cleanName = selectedCV.replace('.json', '');
      if (cleanName.endsWith('_CV_Optimizated')) {
        cleanName = cleanName.replace('_CV_Optimizated', '');
      }
      setFileName(`${cleanName}_study_guide.pdf`);
    } else {
      setError('Selecciona un CV primero para autogenerar el nombre.');
    }
  };

  const handleGenerate = async () => {
    if (!selectedCV || !fileName || !isFileNameValid) {
      setError('Por favor, completa todos los campos correctamente.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await (window as any).electronAPI?.readGeneratedCV(selectedCV);
      if (!res?.success || !res.data) {
        throw new Error('No se pudo cargar el CV seleccionado.');
      }

      const profileData = res.data;
      const jobDetails = profileData.jobDetails || null;

      const guideRes = await (window as any).electronAPI?.generateStudyGuide({
        profileData,
        jobDetails,
        aiInstructions: instructions
      });

      if (!guideRes?.success || !guideRes.data) {
        throw new Error(guideRes?.error || 'Error al generar el guion de estudio.');
      }

      setStudyGuideBaseName(fileName);
      setStudyGuideData({
        ...guideRes.data,
        jobDetails,
        profileLabel: profileData.basics?.label || profileData.profileLabel || 'Perfil General'
      });

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyGuideData && studyGuideBaseName) {
      const timer = setTimeout(async () => {
        const container = document.getElementById('study-guide-print-container');
        if (container) {
          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
              <style>
                ${Array.from(document.styleSheets)
              .map(sheet => {
                try { return Array.from(sheet.cssRules).map(rule => rule.cssText).join(''); }
                catch (e) { return ''; }
              }).join('\n')}
                  
                @media print {
                  @page { margin: 1in; size: A4; }
                  body { font-family: 'Inter', sans-serif; font-size: 11pt; line-height: 1.6; }
                  .tarjeta-estudio-star { page-break-inside: avoid; border-left: 4px solid #007bff; padding: 15px; margin-bottom: 20px; background-color: #f8f9fa; }
                  h2, h3 { page-break-after: avoid; }
                  mark { background-color: #ffeeba; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${container.outerHTML}
            </body>
            </html>
          `;
          try {
            const res = await (window as any).electronAPI.exportStudyGuidePDF({ html, baseName: studyGuideBaseName });
            if (res.success) {
              addNotification('Guion de estudio guardado exitosamente.', 'success');
              if (onSuccess) {
                onSuccess();
              }
            } else {
              setError('Error al exportar guion: ' + res.error);
            }
          } catch (err: any) {
            setError('Error: ' + err.message);
          } finally {
            setStudyGuideData(null);
            setStudyGuideBaseName('');
            setIsLoading(false);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [studyGuideData, studyGuideBaseName, onSuccess]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Contenedor Oculto para Generación PDF */}
      {studyGuideData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <ViewStudyGuide data={studyGuideData} />
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#d3e4fe] border-b border-[#1E293B] pb-4">
        Generar Guion de Estudio con IA
      </h1>

      <div className="bg-slate-900 border border-gray-700 rounded-lg p-6 flex flex-col gap-6 shadow-md">

        {/* Paso 1: Seleccionar CV */}
        <div className="flex flex-col gap-2">
          <label className="text-[#8c909f] font-semibold text-sm">
            Paso 1: Selecciona un currículum generado
          </label>
          <select
            value={selectedCV}
            onChange={(e) => setSelectedCV(e.target.value)}
            className="bg-[#020617] border border-[#1E293B] text-[#d3e4fe] rounded-md p-3 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">-- Selecciona un CV --</option>
            {cvFiles.map(file => (
              <option key={file.filename} value={file.filename}>
                {file.filename.replace(/_specific|.json|_CV_Optimizated/g, '')}
              </option>
            ))}
          </select>
          {cvFiles.length === 0 && (
            <p className="text-sm text-yellow-500 mt-1">
              No tienes currículums generados. Ve a "Generar CV" primero.
            </p>
          )}
        </div>

        {/* Paso 2: Instrucciones Adicionales */}
        <div className="flex flex-col gap-2">
          <label className="text-[#8c909f] font-semibold text-sm">
            Paso 2: Instrucciones adicionales (Opcional)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Ejemplo: 'Céntrate más en preguntas sobre React y menos en backend' o 'Explícame todo como si fuera junior'."
            className="bg-[#020617] border border-[#1E293B] text-[#d3e4fe] rounded-md p-3 h-32 resize-none focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Paso 3: Nombre del archivo */}
        <div className="flex flex-col gap-2">
          <label className="text-[#8c909f] font-semibold text-sm">
            Paso 3: Nombre del archivo para guardar el Guion
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="mi_guion_estudio.pdf"
              className={`flex-1 bg-[#020617] border ${error && !isChecking && fileName ? 'border-red-500' : 'border-[#1E293B]'} text-[#d3e4fe] rounded-md p-3 focus:outline-none focus:border-blue-500`}
              disabled={isLoading}
            />
            <button
              onClick={handleAutoGenerate}
              disabled={isLoading || !selectedCV}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#d3e4fe] rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Autogenerar nombre"
            >
              <Wand2 size={16} /> Autogenerar
            </button>
          </div>
          {isChecking && <span className="text-xs text-blue-400">Verificando disponibilidad...</span>}
          {!error && !isChecking && fileName && <span className="text-xs text-green-500">Nombre válido y disponible.</span>}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#1E293B]">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !selectedCV || !isFileNameValid}
            className={`px-6 py-3 rounded-md font-medium text-white transition-colors flex items-center justify-center gap-2 ${isLoading || !selectedCV || !isFileNameValid
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Guion...
              </>
            ) : 'Generar Guion PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateGuide;
