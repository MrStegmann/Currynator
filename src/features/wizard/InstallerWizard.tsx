import React, { useState, useEffect } from 'react';
import Step1BasicInfo from './Step1BasicInfo';
import Step2GitHub from './Step2GitHub';
import Step3Directory from './Step3Directory';

interface InstallerWizardProps {
  onComplete: () => void;
}

export default function InstallerWizard({ onComplete }: InstallerWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    githubToken: '',
    dataFolderPath: ''
  });

  useEffect(() => {
    // Load default settings
    const loadDefaults = async () => {
      const result = await (window as any).electronAPI.getSettings();
      if (result.success) {
        setData(prev => ({
          ...prev,
          dataFolderPath: result.data.dataFolderPath,
          firstName: result.data.profile?.firstName || '',
          lastName: result.data.profile?.lastName || '',
          email: result.data.profile?.email || '',
          githubToken: result.data.profile?.githubToken || ''
        }));
      }
    };
    loadDefaults();
  }, []);

  const updateData = (newData: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleFinish = async () => {
    try {
      const settings = {
        isSetupComplete: true,
        dataFolderPath: data.dataFolderPath,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          githubToken: data.githubToken
        }
      };
      await (window as any).electronAPI.saveSettings(settings);
      onComplete();
    } catch (e) {
      console.error('Error saving settings during wizard finish:', e);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 rounded"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  currentStep >= step 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-variant text-on-surface-variant'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-2xl">
          {currentStep === 1 && (
            <Step1BasicInfo 
              data={data} 
              updateData={updateData} 
              onNext={() => setCurrentStep(2)} 
            />
          )}
          {currentStep === 2 && (
            <Step2GitHub 
              data={data} 
              updateData={updateData} 
              onNext={() => setCurrentStep(3)} 
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <Step3Directory 
              data={data} 
              updateData={updateData} 
              onFinish={handleFinish} 
              onBack={() => setCurrentStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
