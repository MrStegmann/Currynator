import React, { useState } from 'react';
import { Key, CheckCircle2, AlertCircle } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Step2Props {
  data: { githubToken: string };
  updateData: (data: Partial<{ githubToken: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2GitHub({ data, updateData, onNext, onBack }: Step2Props) {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleValidate = async () => {
    if (!data.githubToken) {
      setError('Por favor, ingresa un token.');
      return;
    }
    
    setIsValidating(true);
    setError('');
    setSuccess(false);

    try {
      const result = await (window as any).electronAPI.validateGithubToken(data.githubToken);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onNext();
        }, 1000);
      } else {
        setError(result.error || 'Token inválido o expirado.');
      }
    } catch (e: any) {
      setError(e.message || 'Error de conexión.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex gap-8 animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Left Column - Input */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-headline-md text-on-surface flex items-center gap-2">
            <GithubIcon className="w-6 h-6" /> Conectar GitHub
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Necesitamos acceso a GitHub para poder analizar tus repositorios y optimizar tu CV con datos reales.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1 relative">
            <label className="text-label-caps text-on-surface-variant">Personal Access Token</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="password"
                value={data.githubToken}
                onChange={e => {
                  updateData({ githubToken: e.target.value });
                  setSuccess(false);
                  setError('');
                }}
                className="w-full bg-surface-deep border border-outline-variant rounded px-10 py-2 text-on-surface font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
            </div>
          </div>

          <div className="flex justify-between items-center h-10">
            <div className="flex-1">
              {error && (
                <div className="flex items-center gap-2 text-status-error text-sm animate-in fade-in">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-status-success text-sm animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Token válido. Conectado.</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleValidate}
              disabled={isValidating || success || !data.githubToken}
              className="bg-surface-variant text-on-surface px-4 py-2 rounded text-sm font-medium hover:bg-surface-bright disabled:opacity-50 transition-colors"
            >
              {isValidating ? 'Validando...' : 'Verificar'}
            </button>
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
            onClick={onNext}
            disabled={!success}
            className="bg-primary text-on-primary px-6 py-2 rounded font-medium hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Right Column - Docs */}
      <div className="w-80 bg-surface-card border border-border-subtle rounded-lg p-6 space-y-4">
        <h3 className="text-label-caps text-on-surface flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" /> Instrucciones
        </h3>
        
        <ol className="space-y-4 text-sm text-on-surface-variant list-decimal list-inside">
          <li>
            Ve a <a href="#" onClick={(e) => { e.preventDefault(); (window as any).electronAPI.openExternal('https://github.com/settings/tokens/new'); }} className="text-primary hover:underline">GitHub Developer Settings</a>.
          </li>
          <li>
            Asegúrate de estar logueado en tu cuenta principal.
          </li>
          <li>
            En <strong>Note</strong>, escribe <em>Currynator</em>.
          </li>
          <li>
            En <strong>Select scopes</strong>, marca la casilla <code className="bg-surface-deep px-1 rounded">repo</code> y <code className="bg-surface-deep px-1 rounded">read:user</code>.
          </li>
          <li>
            Haz scroll hasta el final y haz clic en <strong>Generate token</strong>.
          </li>
          <li>
            Copia el token (empieza por <code className="bg-surface-deep px-1 rounded">ghp_</code>) y pégalo a la izquierda.
          </li>
        </ol>
      </div>
    </div>
  );
}
