import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { DataProfile } from '../types/Data';

import Step1ProfileSelection from '../components/cv-steps/Step1ProfileSelection';
import Step2GenerationType from '../components/cv-steps/Step2GenerationType';
import type { GenerationType } from '../components/cv-steps/Step2GenerationType';
import Step3JobDetails from '../components/cv-steps/Step3JobDetails';
import type { JobDetails } from '../components/cv-steps/Step3JobDetails';
import Step4AIInstructions from '../components/cv-steps/Step4AIInstructions';
import Step5Processing from '../components/cv-steps/Step5Processing';
import Step6Editor from '../components/cv-steps/Step6Editor';
import Step7SaveOptions from '../components/cv-steps/Step7SaveOptions';
import { useNotification } from '../contexts/NotificationContext';

const GenerateCV: React.FC = () => {
  const { addNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedProfile, setSelectedProfile] = useState<DataProfile | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    companyName: '',
    jobTitle: '',
    companyInfo: '',
    companyUrl: '',
    jobFunctions: '',
    jobRequirements: ''
  });
  const [aiInstructions, setAiInstructions] = useState('');

  const [generatedProfile, setGeneratedProfile] = useState<any>(null);

  const [fileName, setFileName] = useState('');
  const [isFileNameValid, setIsFileNameValid] = useState(false);

  const getDefaultFileName = () => {
    const originalName = selectedProfile?.profileLabel || 'CV';
    return `${originalName}_${generationType}_CV_Optimizated_${new Date().toISOString().slice(0, 10)}_${generationType !== 'general' ? `${jobDetails.companyName}_${jobDetails.jobTitle}` : ''}.json`.replace(/\s+/g, '_');
  };

  const canGoNext = () => {
    if (currentStep === 1) return selectedProfile !== null;
    if (currentStep === 2) return generationType !== null;
    if (currentStep === 3) return true; // Optional fields
    if (currentStep === 4) return true; // Optional fields
    if (currentStep === 5) return generatedProfile !== null; // Can only go next if processing succeeds
    if (currentStep === 6) return generatedProfile !== null;
    if (currentStep === 7) return isFileNameValid;
    return false;
  };

  const handleNext = () => {
    if (!canGoNext()) return;

    let nextStep = currentStep + 1;
    if (currentStep === 2 && generationType === 'general') {
      nextStep = 4; // Skip step 3 if general
    }

    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    if (currentStep === 1) return;

    let prevStep = currentStep - 1;
    if (currentStep === 4 && generationType === 'general') {
      prevStep = 2; // Skip step 3 if general
    }

    setCurrentStep(prevStep);
  };

  const handleSaveFinal = async () => {
    if (!generatedProfile || !fileName || !isFileNameValid) return;
    try {
      const originalName = selectedProfile?.profileLabel || 'CV';

      const response = await (window as any).electronAPI.saveResumeData(
        {
          ...generatedProfile,
          profileLabel: `${originalName} - Optimizado IA - ${generationType} - ${new Date().toISOString().slice(0, 10)}`
        },
        {
          isGenerated: true,
          customFileName: fileName,
          skipDialog: true
        }
      );
      if (response.success) {
        addNotification("¡Currículum guardado con éxito!", "success");
        // Opcional: Redirigir al dashboard
        window.location.reload();
      } else {
        addNotification(response.error || "Error al guardar", "error");
      }
    } catch (e: any) {
      addNotification("Error: " + e.message, "error");
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5, 6, 7].map((step) => {
          const isPast = step < currentStep;
          const isCurrent = step === currentStep;
          const isSkipped = step === 3 && generationType === 'general' && currentStep > 2;

          let bgClass = "bg-[#1E293B] text-[#8c909f]";
          if (isCurrent) bgClass = "bg-[#3B82F6] text-white";
          else if (isPast) bgClass = "bg-[#10B981] text-white";

          if (isSkipped) return null; // Omitimos el indicador visualmente si fue saltado? Mejor mostrarlo inactivo.

          return (
            <div key={step} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[#020617] ${bgClass}`}>
                {isPast ? <CheckCircle2 size={20} /> : step}
              </div>
              <span className={`text-xs font-semibold ${isCurrent ? 'text-[#d3e4fe]' : 'text-[#8c909f]'}`}>
                {step === 1 && 'Perfil'}
                {step === 2 && 'Tipo'}
                {step === 3 && 'Puesto'}
                {step === 4 && 'Instrucciones'}
                {step === 5 && 'Procesando'}
                {step === 6 && 'Revisión'}
                {step === 7 && 'Guardar'}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-64px)] relative bg-[#020617]">
      {/* HEADER */}
      <div className="px-8 py-6 bg-slate-900 border-b border-gray-700 sticky top-0 z-20">
        <h1 className="text-3xl font-bold text-[#d3e4fe] mb-6">Generador de Currículum AI</h1>
        {renderStepIndicator()}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <Step1ProfileSelection
              selectedProfileId={selectedProfile?.id || null}
              onSelect={setSelectedProfile}
            />
          )}
          {currentStep === 2 && (
            <Step2GenerationType
              generationType={generationType}
              onChange={setGenerationType}
            />
          )}
          {currentStep === 3 && (
            <Step3JobDetails
              details={jobDetails}
              onChange={setJobDetails}
            />
          )}
          {currentStep === 4 && (
            <Step4AIInstructions
              instructions={aiInstructions}
              onChange={setAiInstructions}
            />
          )}
          {currentStep === 5 && (
            <Step5Processing
              profileData={selectedProfile}
              generationType={generationType}
              jobDetails={jobDetails}
              aiInstructions={aiInstructions}
              onSuccess={(data) => {
                setGeneratedProfile(data);
                handleNext();
              }}
              onRetry={() => {
                // To retry, we could remount by toggling step back and forth, 
                // but for now, we just leave it in error state and let them click back.
              }}
            />
          )}
          {currentStep === 6 && (
            <Step6Editor
              profileData={generatedProfile}
              onChange={setGeneratedProfile}
              onSave={handleNext} // Advance to step 7 instead of saving immediately
            />
          )}
          {currentStep === 7 && (
            <Step7SaveOptions
              fileName={fileName}
              defaultFileName={getDefaultFileName()}
              onChange={setFileName}
              onValidationChange={setIsFileNameValid}
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      {currentStep !== 5 && currentStep !== 6 && (
        <div className="px-8 py-4 bg-slate-900 border-t border-gray-700 sticky bottom-0 z-20 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${currentStep === 1
              ? 'text-[#424754] cursor-not-allowed'
              : 'text-[#d3e4fe] hover:bg-[#1E293B]'
              }`}
          >
            <ArrowLeft size={18} /> Atrás
          </button>

          {currentStep === 7 ? (
            <button
              onClick={handleSaveFinal}
              disabled={!isFileNameValid}
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors shadow-md ${!isFileNameValid
                ? 'bg-[#1b2b3f] text-[#8c909f] cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
            >
              Guardar CV <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors shadow-md ${!canGoNext()
                ? 'bg-[#1b2b3f] text-[#8c909f] cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
            >
              Siguiente <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateCV;
