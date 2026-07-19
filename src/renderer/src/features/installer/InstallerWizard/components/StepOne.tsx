import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { useNotification } from '../../../../../../contexts/NotificationContext';
import { googleAuthService, githubAuthService } from '../services/StepOne.service';
import type { StepOneProps } from '../types/StepOne.types';

export const StepOne: React.FC<StepOneProps> = ({ state, onChange, onNext, onGithubTokenRetrieved }) => {
  const { addNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleAuth = async () => {
    setIsProcessing(true);
    try {
      const res = await googleAuthService();
      if (res.success && res.profile) {
        onChange({
          firstName: res.profile.firstName,
          lastName: res.profile.lastName,
          email: res.profile.email,
          authProviderUsed: 'google'
        });
        addNotification('Autenticado exitosamente con Google', 'success');
        setTimeout(() => onNext(), 300);
      } else {
        addNotification(res.error || 'Fallo la autenticación con Google', 'error');
      }
    } catch (err) {
      addNotification('Excepción durante OAuth con Google', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGithubAuth = async () => {
    setIsProcessing(true);
    try {
      const res = await githubAuthService();
      if (res.success && res.profile) {
        onChange({
          firstName: res.profile.firstName,
          lastName: res.profile.lastName,
          email: res.profile.email,
          authProviderUsed: 'github'
        });
        
        if (res.profile.token) {
           onGithubTokenRetrieved(res.profile.token);
        }
        
        addNotification('Autenticado exitosamente con GitHub', 'success');
        setTimeout(() => onNext(), 300);
      } else {
        addNotification(res.error || 'Fallo la autenticación con GitHub', 'error');
      }
    } catch (err) {
      addNotification('Excepción durante OAuth con GitHub', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualStep1 = () => {
    if (!state.firstName || !state.lastName || !state.email) {
      addNotification('Por favor, rellena todos los campos manualmente.', 'error');
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center">
        <h2 className="text-headline-sm font-bold">Identidad y Enlace de Cuenta</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">Conecta una cuenta o introduce tus datos manualmente para iniciar.</p>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={handleGoogleAuth}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 p-3 bg-surface-bright hover:bg-surface-deep border border-border-subtle rounded-md transition-colors disabled:opacity-50"
        >
          <Mail className="w-5 h-5" /> Sign in with Google
        </button>
        <button 
          onClick={handleGithubAuth}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 p-3 bg-surface-bright hover:bg-surface-deep border border-border-subtle rounded-md transition-colors disabled:opacity-50"
        >
          <GithubIcon className="w-5 h-5" /> Connect GitHub
        </button>
      </div>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border-subtle"></div>
        <span className="flex-shrink-0 mx-4 text-on-surface-variant text-sm uppercase">O Ingreso Manual</span>
        <div className="flex-grow border-t border-border-subtle"></div>
      </div>

      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="First Name" 
          className="p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface"
          value={state.firstName}
          onChange={e => onChange({ ...state, firstName: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          className="p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface"
          value={state.lastName}
          onChange={e => onChange({ ...state, lastName: e.target.value })}
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface"
          value={state.email}
          onChange={e => onChange({ ...state, email: e.target.value })}
        />
      </div>

      <button 
        onClick={handleManualStep1}
        className="mt-4 p-3 bg-primary hover:bg-primary/90 text-on-primary rounded-md font-bold transition-colors flex items-center justify-center gap-2"
      >
        Continuar <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
