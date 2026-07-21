import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNotification } from '../../../../context/NotificationContext';
import { saveTokenService } from '../services/StepTwo.service';
import type { StepTwoProps } from '../types/StepTwo.types';

export const StepTwo: React.FC<StepTwoProps> = ({
  githubTokenInput,
  onChangeTokenInput,
  onNext,
  onSkip,
  authProviderUsed,
  onStateChange
}) => {
  const { addNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleValidateToken = async () => {
    if (githubTokenInput.length < 10) {
      addNotification('Token no válido', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const authRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubTokenInput}` }
      });

      if (!authRes.ok) {
        addNotification('El token de GitHub no es válido o ha expirado.', 'error');
        setIsProcessing(false);
        return;
      }

      const res = await saveTokenService(githubTokenInput);
      if (res.success) {
        onStateChange({ tokenProvided: true });
        addNotification('Token validado y encriptado de forma segura', 'success');
        onNext();
      } else {
        addNotification(res.error || 'Error al guardar el token', 'error');
      }
    } catch (err) {
      addNotification('Excepción al guardar token', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 w-full">
      <div className="text-center">
        <h2 className="text-headline-sm font-bold">Configuración de GitHub API</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">Introduce un Personal Access Token (PAT) válido para el análisis de código.</p>
      </div>

      <div className="flex flex-row gap-8 w-full mt-4">
        {/* Column 1: Input & Validation */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">GitHub Access Token</label>
            <input
              type="password"
              placeholder="ghp_••••••••••••••••••••••"
              className="p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
              value={githubTokenInput}
              onChange={e => onChangeTokenInput(e.target.value)}
            />
          </div>

          <button
            onClick={handleValidateToken}
            disabled={isProcessing || githubTokenInput.length < 10}
            className="mt-2 p-3 bg-primary hover:bg-primary/90 text-on-primary rounded-md font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Validar Token'}
          </button>
          
          {authProviderUsed === 'github' && (
            <button onClick={onSkip} className="mt-2 text-sm text-primary hover:underline self-center">
              Saltar (Usar token actual OAuth)
            </button>
          )}
        </div>

        {/* Column 2: Instructions */}
        <div className="flex-1 bg-surface-deep p-5 rounded-md border border-border-subtle text-sm text-on-surface-variant">
          <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            Cómo generar el token:
          </h4>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              Ve a la sección <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">Developer settings</a> en tu cuenta de GitHub.
            </li>
            <li>Selecciona <strong>Personal access tokens</strong> &gt; <strong>Tokens (classic)</strong>.</li>
            <li>Haz clic en <strong>Generate new token</strong>.</li>
            <li>Asegúrate de marcar los permisos <strong>repo</strong> y <strong>user</strong>.</li>
            <li>Copia el token generado y pégalo aquí.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
