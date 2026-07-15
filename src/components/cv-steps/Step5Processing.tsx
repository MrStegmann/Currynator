import React, { useEffect, useState, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { DataProfile } from '../../types/Data';
import type { JobDetails } from './Step3JobDetails';
import type { GenerationType } from './Step2GenerationType';

interface Step5ProcessingProps {
  profileData: DataProfile | null;
  generationType: GenerationType;
  jobDetails: JobDetails;
  aiInstructions: string;
  onSuccess: (generatedProfile: any) => void;
  onRetry: () => void;
}

const Step5Processing: React.FC<Step5ProcessingProps> = ({
  profileData, generationType, jobDetails, aiInstructions, onSuccess, onRetry
}) => {
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMsg, setErrorMsg] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Guardamos la promesa para evitar doble llamada en StrictMode
  // y asegurar que el componente montado reciba la respuesta.
  const geminiPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function callGemini() {
      try {
        if (!profileData || !generationType) throw new Error('Faltan datos requeridos');

        const args = {
          profileData,
          generationType,
          jobDetails,
          aiInstructions
        };

        console.log("[FRONTEND] Iniciando petición IPC a main...");

        if (!geminiPromiseRef.current) {
          // Timeout de seguridad en el frontend por si el IPC se cuelga
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout IPC: El proceso principal no respondió.")), 120000)
          );

          const ipcPromise = (window as any).electronAPI.generateCV(args);
          geminiPromiseRef.current = Promise.race([ipcPromise, timeoutPromise]);
        }

        const response = await geminiPromiseRef.current;

        if (isMounted) {
          if (response.success) {
            onSuccess(response.data);
          } else {
            setStatus('error');
            setErrorMsg(response.error || 'Error desconocido al invocar a Gemini.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMsg(err.message || 'Error en la comunicación con el proceso principal.');
        }
      }
    }

    callGemini();

    return () => { isMounted = false; };
  }, [profileData, generationType, jobDetails, aiInstructions, onSuccess, retryCount]);

  const handleRetry = () => {
    geminiPromiseRef.current = null;
    setStatus('processing');
    setErrorMsg('');
    setRetryCount(c => c + 1);
    if (onRetry) onRetry();
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {status === 'processing' ? (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-[#3B82F6] animate-spin" />
          <h2 className="text-2xl font-bold text-[#d3e4fe]">El Motor de IA está trabajando...</h2>
          <p className="text-[#8c909f] text-center max-w-md">
            Gemini está reescribiendo y optimizando tu currículum basándose en las especificaciones. Esto puede tardar entre 10 y 30 segundos.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <AlertCircle className="w-16 h-16 text-[#EF4444]" />
          <h2 className="text-2xl font-bold text-[#d3e4fe]">Error en la Generación</h2>
          <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffdad6] p-4 rounded-md max-w-lg w-full">
            <p className="font-mono text-sm">{errorMsg}</p>
          </div>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-[#3B82F6] text-white rounded-md hover:bg-[#3B82F6]/80 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

export default Step5Processing;
