import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';
import type { InstallerWizardState } from './types';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { getSettingsService, saveSettingsService } from './services/StepThree.service';

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
    setState(s => ({
      ...s,
      step3: { outputDirectoryPath: 'C:\\Users\\Default\\Documents\\Currynator' }
    }));
  }, []);

  const handleCompleteSetup = async () => {
    try {
      const currentSettings = await getSettingsService();
      const newSettings = {
        ...currentSettings,
        profile: {
          firstName: state.step1.firstName,
          lastName: state.step1.lastName,
          email: state.step1.email,
          githubToken: githubTokenInput
        },
        dataFolderPath: state.step3.outputDirectoryPath,
        isSetupComplete: true
      };

      const saveRes = await saveSettingsService(newSettings);
      if (saveRes.success) {
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

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background text-on-surface p-6">
      <div className="w-full max-w-2xl bg-surface-card border border-border-subtle rounded-xl shadow-lg p-8">

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border-subtle -z-10" />
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center gap-2 bg-surface-card px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${currentStep >= step
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-border-subtle bg-surface-deep text-on-surface-variant'
                }`}>
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              <span className={`text-xs uppercase tracking-wider font-semibold ${currentStep >= step ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                Paso {step}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Step Rendering */}
        {currentStep === 1 && (
          <StepOne
            state={state.step1}
            onChange={(s) => setState({ ...state, step1: s })}
            onNext={() => setCurrentStep(2)}
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
    </div>
  );
};

export default InstallerWizard;
