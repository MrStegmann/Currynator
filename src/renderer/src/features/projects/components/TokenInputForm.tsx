import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useProjectsStore } from '../store/useProjectsStore';

export const TokenInputForm: React.FC = () => {
  const [inputToken, setInputToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { saveToken, isLoading, error: storeError } = useProjectsStore();

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = inputToken.trim();
    if (!trimmed) {
      setLocalError('Please enter a GitHub Personal Access Token.');
      return;
    }

    const success = await saveToken(trimmed);
    if (!success) {
      // Store error will be rendered
    }
  };

  const displayError = localError || storeError;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
        <div className="p-2.5 bg-primary-container text-on-primary-container rounded-xl">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-title-lg font-semibold text-on-surface m-0">
            Configure GitHub Access Token
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Your token will be encrypted and stored securely on your device.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="github-token" className="block text-body-md font-medium text-on-surface mb-2">
            GitHub Personal Access Token *
          </label>
          <div className="relative flex items-center">
            <input
              id="github-token"
              name="githubToken"
              type={showPassword ? 'text' : 'password'}
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              required
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-md font-mono"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label="Toggle password visibility"
              className="absolute right-3 p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {displayError && (
          <div className="p-3.5 bg-error-container text-on-error-container rounded-xl flex items-start gap-3 border border-error/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-body-sm font-medium m-0">{displayError}</p>
          </div>
        )}

        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-body-xs text-on-surface-variant leading-relaxed m-0">
            Tokens are protected with application encryption before being saved locally.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-on-primary font-semibold text-body-md rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying Token...</span>
            </>
          ) : (
            <span>Save Token</span>
          )}
        </button>
      </form>
    </div>
  );
};
