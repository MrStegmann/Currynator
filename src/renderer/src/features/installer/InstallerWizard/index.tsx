import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import type { InstallerWizardState } from './types';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { getSettingsService, saveSettingsService, getProfileService, saveProfileService } from './services/StepThree.service';

export const InstallerWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { addNotification } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);

  const [state, setState] = useState<InstallerWizardState>({
    step1: { firstName: '', lastName: '', email: '', authProviderUsed: 'manual' },
    step2: { tokenProvided: false },
    step3: { outputDirectoryPath: '' }
  });

  const [githubTokenInput, setGithubTokenInput] = useState('');

  // Default directory for Step 3
  useEffect(() => {
    // OS specific path for ~Documents/Currynator can be approximated
    const defaultPath = window.navigator.userAgent.includes('Windows') 
      ? 'C:\\Users\\Default\\Documents\\Currynator'
      : '~/Documents/Currynator';
      
    setState(s => ({
      ...s,
      step3: { outputDirectoryPath: defaultPath }
    }));
  }, []);

  const handleCompleteSetup = async () => {
    try {
      const currentSettings = await getSettingsService();
      const currentProfile = await getProfileService();
      
      const newSettings = {
        ...currentSettings.data,
        dataFolderPath: state.step3.outputDirectoryPath,
        isSetupComplete: true
      };

      const newProfile = {
        ...currentProfile.data,
        firstName: state.step1.firstName,
        lastName: state.step1.lastName,
        email: state.step1.email
      };

      const saveSettingsRes = await saveSettingsService(newSettings);
      const saveProfileRes = await saveProfileService(newProfile);
      
      if (saveSettingsRes.success && saveProfileRes.success) {
        addNotification('¡Configuración completada!', 'success');
        if (onComplete) {
          onComplete();
        } else {
          window.location.reload();
        }
      } else {
        addNotification('Error al guardar la configuración final', 'error');
      }
    } catch (err) {
      addNotification('Error interno al finalizar la configuración', 'error');
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleCompleteSetup();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background text-on-surface p-6">
      <div className="w-full max-w-4xl flex flex-col gap-6">

        {/* Header with step navigator */}
        <div className="w-full p-5 flex flex-row justify-between items-center border border-border-subtle rounded-xl bg-surface-card gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex justify-center">
              <div
                className={`border rounded-full px-10 py-2 text-center font-bold text-sm transition-colors ${
                  currentStep === step
                    ? 'border-primary bg-primary/20 text-primary'
                    : currentStep > step
                    ? 'border-green-500 bg-green-500/20 text-green-500'
                    : 'border-border-subtle bg-surface-deep text-on-surface-variant'
                }`}
              >
                Step {step}
              </div>
            </div>
          ))}
        </div>

        {/* Body Container */}
        <div className="w-full bg-surface-card border border-border-subtle rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <StepOne
              state={state.step1}
              onChange={(s) => setState({ ...state, step1: s })}
              onNext={() => setCurrentStep(2)}
              onSkipToStep3={() => setCurrentStep(3)}
              onGithubTokenRetrieved={(token) => setGithubTokenInput(token)}
            />
          )}

          {currentStep === 2 && (
            <StepTwo
              githubTokenInput={githubTokenInput}
              onChangeTokenInput={setGithubTokenInput}
              onNext={() => setCurrentStep(3)}
              onSkip={() => setCurrentStep(3)}
              authProviderUsed={state.step1.authProviderUsed}
              onStateChange={(s) => setState({ ...state, step2: s })}
            />
          )}

          {currentStep === 3 && (
            <StepThree
              state={state.step3}
              onChange={(s) => setState({ ...state, step3: s })}
              onComplete={handleCompleteSetup}
            />
          )}
        </div>

        {/* Footer */}
        <div className="w-full flex flex-row justify-between items-center bg-surface-card border border-border-subtle rounded-xl p-5">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="py-2 px-5 rounded-xl border border-border-subtle bg-surface-deep hover:bg-surface-variant transition-colors text-on-surface font-semibold"
              >
                Back
              </button>
            )}
          </div>
          <div>
            <button
              onClick={currentStep === 3 ? handleCompleteSetup : handleNext}
              className="py-2 px-5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold transition-colors"
            >
              {currentStep === 3 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstallerWizard;
