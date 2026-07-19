import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
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

  const handleSaveGithubToken = async () => {
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
        addNotification('Token encriptado y guardado de forma segura', 'success');
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
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center">
        <h2 className="text-headline-sm font-bold">Configuración de GitHub API</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">Introduce un Personal Access Token (PAT) válido para el análisis de código.</p>
      </div>

      <div className="bg-surface-deep p-4 rounded-md border border-border-subtle text-sm text-on-surface-variant">
        <h4 className="font-bold text-on-surface mb-2">Cómo generar el token:</h4>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Ve a Settings &gt; Developer settings en GitHub.</li>
          <li>Selecciona Personal access tokens &gt; Tokens (classic).</li>
          <li>Haz clic en "Generate new token".</li>
          <li>Asegúrate de marcar los permisos <strong>repo</strong> y <strong>user</strong>.</li>
        </ol>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">GitHub Access Token</label>
        <input
          type="password"
          placeholder="ghp_..."
          className="p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface font-mono"
          value={githubTokenInput}
          onChange={e => onChangeTokenInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleSaveGithubToken}
        disabled={isProcessing || githubTokenInput.length < 10}
        className="mt-4 p-3 bg-primary hover:bg-primary/90 text-on-primary rounded-md font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar y Continuar'}
      </button>
      {authProviderUsed === 'github' && (
        <button onClick={onSkip} className="mt-2 text-sm text-primary hover:underline">Saltar (Usar token actual OAuth)</button>
      )}
    </div>
  );
};
