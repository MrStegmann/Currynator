import React, { useState, useEffect, useCallback } from 'react';
import type {
  ResumeData,
  WorkExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  ProjectItem
} from '../../../types';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { WizardStepControls } from './WizardStepControls';
import { WizardStepLanguage } from './WizardStepLanguage';
import { WizardStepTitle } from './WizardStepTitle';
import { WizardStepSummary } from './WizardStepSummary';
import { WizardStepExperience } from './WizardStepExperience';
import { WizardStepEducationCert } from './WizardStepEducationCert';
import { WizardStepSkills } from './WizardStepSkills';
import { WizardStepProjects } from './WizardStepProjects';

export interface AiOptimizationWizardModalProps {
  isOpen: boolean;
  activeResume: ResumeData;
  onClose: () => void;
  onSave: (updatedResume: ResumeData) => void;
}

const STEP_TITLES = [
  'Language',
  'Title',
  'Summary',
  'Work Experience',
  'Education & Certs',
  'Skills',
  'Projects'
] as const;

/**
 * Step progress bar header for AI Optimization Wizard.
 *
 * @param props - Current active step index (1-7).
 * @returns React component.
 */
const WizardProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center gap-1.5 py-2 border-b border-slate-800/80">
    {STEP_TITLES.map((title, idx) => {
      const stepNum = idx + 1;
      const isActive = stepNum === currentStep;
      const isCompleted = stepNum < currentStep;

      return (
        <div key={title} className="flex-1 space-y-1">
          <div
            className={`h-1.5 rounded-full transition-colors ${
              isActive
                ? 'bg-blue-500 shadow-sm shadow-blue-500/50'
                : isCompleted
                  ? 'bg-blue-600/50'
                  : 'bg-slate-800'
            }`}
          />
          <span
            className={`text-[10px] font-medium block text-center truncate ${
              isActive ? 'text-blue-400 font-semibold' : 'text-slate-500'
            }`}
          >
            {title}
          </span>
        </div>
      );
    })}
  </div>
);

/**
 * Helper function to commit accepted step proposal data into working resume state.
 *
 * @param step - Active step index.
 * @param stepProposal - Proposal data object returned by AI.
 * @param workingResume - Active working resume state object.
 * @returns Updated resume data object.
 */
function applyStepProposal(step: number, stepProposal: unknown, workingResume: ResumeData): ResumeData {
  const updated = JSON.parse(JSON.stringify(workingResume)) as ResumeData;
  if (!stepProposal) return updated;

  const prop = stepProposal as Record<string, unknown>;

  if (step === 2 && typeof prop.proposedTitle === 'string') {
    updated.personalDetails.professionalTitle = prop.proposedTitle;
  } else if (step === 3 && typeof prop.proposedSummary === 'string') {
    updated.summary = prop.proposedSummary;
  } else if (step === 4 && Array.isArray(prop.proposedExperience)) {
    updated.experience = prop.proposedExperience as WorkExperienceItem[];
  } else if (step === 5) {
    if (Array.isArray(prop.proposedEducation)) updated.education = prop.proposedEducation as EducationItem[];
    if (Array.isArray(prop.proposedCertifications)) updated.certifications = prop.proposedCertifications as CertificationItem[];
  } else if (step === 6 && Array.isArray(prop.proposedSkills)) {
    updated.skills = prop.proposedSkills as SkillCategory[];
  } else if (step === 7 && Array.isArray(prop.proposedProjects)) {
    updated.projects = prop.proposedProjects as ProjectItem[];
  }

  return updated;
}

/**
 * Interactive 7-Step AI Optimization Wizard Modal Component.
 *
 * @param props - Modal visibility, active resume, and callbacks.
 * @returns React component or null if not open.
 */
export const AiOptimizationWizardModal: React.FC<AiOptimizationWizardModalProps> = ({
  isOpen,
  activeResume,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [workingResume, setWorkingResume] = useState<ResumeData>(activeResume);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [stepProposal, setStepProposal] = useState<unknown>(null);
  const [stepReasoning, setStepReasoning] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setWorkingResume(JSON.parse(JSON.stringify(activeResume)));
      setCurrentStep(1);
      setSelectedLanguage('en');
      setUserFeedback('');
      setErrorMessage(null);
    }
  }, [isOpen, activeResume]);

  const fetchStepProposal = useCallback(
    async (step: number, lang: string, feedback?: string) => {
      if (step === 1) {
        setStepProposal({ selectedLanguage: lang });
        setStepReasoning(`Output language selected: ${lang.toUpperCase()}`);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await window.electronAPI.optimizeResumeStep({
          step,
          targetLanguage: lang,
          currentResume: workingResume,
          userFeedback: feedback
        });

        if (response.success) {
          setStepProposal(response.proposal);
          setStepReasoning(response.reasoning || '');
        } else {
          setErrorMessage(response.error || 'Failed to fetch AI proposal.');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error fetching AI optimization step.');
      } finally {
        setIsLoading(false);
      }
    },
    [workingResume]
  );

  useEffect(() => {
    if (isOpen) {
      fetchStepProposal(currentStep, selectedLanguage);
    }
  }, [isOpen, currentStep, selectedLanguage, fetchStepProposal]);

  if (!isOpen) return null;

  const handleAcceptStep = () => {
    const updated = applyStepProposal(currentStep, stepProposal, workingResume);
    setWorkingResume(updated);
    setUserFeedback('');

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      onSave(updated);
      onClose();
    }
  };

  const handleSkipStep = () => {
    setUserFeedback('');
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      onSave(workingResume);
      onClose();
    }
  };

  const handleRepropose = () => {
    fetchStepProposal(currentStep, selectedLanguage, userFeedback);
  };

  const propData = (stepProposal || {}) as Record<string, unknown>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Step-by-Step AI Resume Optimization</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4">
          <WizardProgressBar currentStep={currentStep} />
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-medium text-slate-400">
                AI Agent Analyzing & Generating Step {currentStep} Proposal...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 space-y-2">
              <p className="font-semibold">AI Optimization Error</p>
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => fetchStepProposal(currentStep, selectedLanguage, userFeedback)}
                className="px-3 py-1 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded font-medium transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <WizardStepLanguage
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              )}
              {currentStep === 2 && (
                <WizardStepTitle
                  currentTitle={workingResume.personalDetails.professionalTitle || ''}
                  proposedTitle={(propData.proposedTitle as string) || ''}
                  reasoning={stepReasoning}
                />
              )}
              {currentStep === 3 && (
                <WizardStepSummary
                  currentSummary={workingResume.summary || ''}
                  proposedSummary={(propData.proposedSummary as string) || ''}
                  reasoning={stepReasoning}
                />
              )}
              {currentStep === 4 && (
                <WizardStepExperience
                  proposedExperience={(propData.proposedExperience as WorkExperienceItem[]) || workingResume.experience}
                  reasoning={stepReasoning}
                />
              )}
              {currentStep === 5 && (
                <WizardStepEducationCert
                  proposedEducation={(propData.proposedEducation as EducationItem[]) || workingResume.education}
                  proposedCertifications={(propData.proposedCertifications as CertificationItem[]) || workingResume.certifications}
                  reasoning={stepReasoning}
                />
              )}
              {currentStep === 6 && (
                <WizardStepSkills
                  proposedSkills={(propData.proposedSkills as SkillCategory[]) || workingResume.skills}
                  reasoning={stepReasoning}
                />
              )}
              {currentStep === 7 && (
                <WizardStepProjects
                  proposedProjects={(propData.proposedProjects as ProjectItem[]) || workingResume.projects}
                  reasoning={stepReasoning}
                />
              )}
            </>
          )}
        </div>

        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <WizardStepControls
            currentStep={currentStep}
            totalSteps={7}
            isLoading={isLoading}
            userFeedback={userFeedback}
            onFeedbackChange={setUserFeedback}
            onAccept={handleAcceptStep}
            onRepropose={handleRepropose}
            onSkip={handleSkipStep}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};
