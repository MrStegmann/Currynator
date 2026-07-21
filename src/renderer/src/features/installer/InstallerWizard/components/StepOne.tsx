import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { googleAuthService, githubAuthService, linkedinAuthService } from '../services/StepOne.service';
import type { StepOneProps } from '../types/StepOne.types';
import { useNotification } from '../../../../context/NotificationContext';

// Mock LinkedIn Icon since it doesn't exist yet
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const StepOne: React.FC<StepOneProps> = ({ state, onChange, onNext, onSkipToStep3, onGithubTokenRetrieved }) => {
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

  const handleLinkedinAuth = async () => {
    setIsProcessing(true);
    try {
      const res = await linkedinAuthService();
      if (res.success && res.profile) {
        onChange({
          firstName: res.profile.firstName,
          lastName: res.profile.lastName,
          email: res.profile.email,
          authProviderUsed: 'linkedin'
        });
        addNotification('Autenticado exitosamente con LinkedIn', 'success');
        setTimeout(() => onNext(), 300);
      } else {
        addNotification(res.error || 'Fallo la autenticación con LinkedIn', 'error');
      }
    } catch (err) {
      addNotification('Excepción durante OAuth con LinkedIn', 'error');
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
        setTimeout(() => onSkipToStep3(), 300);
      } else {
        addNotification(res.error || 'Fallo la autenticación con GitHub', 'error');
      }
    } catch (err) {
      addNotification('Excepción durante OAuth con GitHub', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 items-center justify-center animate-in fade-in zoom-in-95 duration-300 w-full">
      <div className="text-center mb-4">
        <h2 className="text-headline-sm font-bold">Identidad y Enlace de Cuenta</h2>
        <p className="text-body-sm text-on-surface-variant mt-2">Conecta una cuenta o introduce tus datos manualmente para iniciar.</p>
      </div>

      {/* Row 1: OAuth Buttons */}
      <div className="flex flex-col w-full max-w-md gap-3">
        <button
          onClick={handleLinkedinAuth}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md transition-colors disabled:opacity-50 font-semibold shadow-sm"
        >
          <LinkedinIcon className="w-5 h-5" /> Connect LinkedIn
        </button>
        <button
          onClick={handleGoogleAuth}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 p-3 bg-surface-bright hover:bg-surface-deep border border-border-subtle rounded-md transition-colors disabled:opacity-50 text-on-surface font-semibold shadow-sm"
        >
          <Mail className="w-5 h-5" /> Sign in with Google
        </button>
        <button
          onClick={handleGithubAuth}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 p-3 bg-[#24292e] hover:bg-[#1b1f23] text-white rounded-md transition-colors disabled:opacity-50 font-semibold shadow-sm"
        >
          <GithubIcon className="w-5 h-5" /> Connect GitHub
        </button>
      </div>

      <div className="relative flex items-center py-4 w-full max-w-md">
        <div className="flex-grow border-t border-border-subtle"></div>
        <span className="flex-shrink-0 mx-4 text-on-surface-variant font-bold text-sm">O</span>
        <div className="flex-grow border-t border-border-subtle"></div>
      </div>

      {/* Row 2: Manual Inputs */}
      <div className="flex flex-col w-full max-w-md gap-3">
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          value={state.firstName}
          onChange={e => onChange({ ...state, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          value={state.lastName}
          onChange={e => onChange({ ...state, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-surface-deep border border-border-subtle rounded-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          value={state.email}
          onChange={e => onChange({ ...state, email: e.target.value })}
        />
      </div>

      {/* No Continue button here because we moved it to the Footer */}
    </div>
  );
};
