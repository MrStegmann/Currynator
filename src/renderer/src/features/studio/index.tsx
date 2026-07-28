import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import type { ResumeData } from './types/resume.types';
import type { StudyGuideData, TargetCompanyInfo, ChatMessage } from './types/studio.types';
import {
  getStoredResumes,
  saveStoredResume,
  deleteStoredResume,
  getStoredStudyGuide,
  saveStoredStudyGuide
} from './utils/studioStorage';
import { createDefaultResume } from './utils/resumeDefaults';
import {
  generateStudyGuideFromResume,
  generateSpecificAiOptimization
} from './utils/aiGenerator';
import { exportElementToPdf, exportResumePdfAutomated } from './utils/pdfExporter';

import { StudioLeftSidebar } from './components/left-sidebar/StudioLeftSidebar';
import { StudioCanvas } from './components/canvas/StudioCanvas';
import { StudioRightSidebar } from './components/right-sidebar/StudioRightSidebar';

import { DeleteResumeModal } from './components/modals/DeleteResumeModal';
import { UnsavedChangesModal } from './components/modals/UnsavedChangesModal';
import { JobOptimizationModal } from './components/modals/JobOptimizationModal';
import { AiOptimizationWizardModal } from './components/modals/ai-wizard';

interface StudioProps {
  onBackToHome: () => void;
}

export const Studio: React.FC<StudioProps> = ({ onBackToHome }) => {
  const { addNotification } = useNotification();

  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [activeStudyGuide, setActiveStudyGuide] = useState<StudyGuideData | null>(null);

  const [activeTab, setActiveTab] = useState<'resume' | 'study-guide'>('resume');
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'optimization-diff'>('edit');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [diffData, setDiffData] = useState<{ original: ResumeData | null; proposed: ResumeData | null } | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isPdfExporting, setIsPdfExporting] = useState<boolean>(false);

  // Modals state
  const [resumeToDelete, setResumeToDelete] = useState<ResumeData | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [isWizardModalOpen, setIsWizardModalOpen] = useState<boolean>(false);

  // Unsaved changes guard pending action
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [injectedContext, setInjectedContext] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const list = getStoredResumes();
    setResumes(list);
    if (list.length > 0 && !activeResumeId) {
      selectResume(list[0].id, list);
    }
  };

  const selectResume = (id: string, currentList: ResumeData[] = resumes) => {
    const found = currentList.find((r) => r.id === id) || null;
    setActiveResumeId(id);
    setActiveResume(found ? JSON.parse(JSON.stringify(found)) : null);
    console.log(found)
    setIsDirty(false);
    setViewMode('edit');
    setDiffData(null);

    // Load associated study guide
    const guide = getStoredStudyGuide(id);
    setActiveStudyGuide(guide);
  };

  // Guard wrap for actions that change resume or navigate away
  const executeWithDirtyGuard = (action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action);
    } else {
      action();
    }
  };

  // Handlers for Unsaved Changes Modal
  const handleGuardSaveAndContinue = () => {
    if (activeResume) {
      saveStoredResume(activeResume);
      setIsDirty(false);
      setResumes(getStoredResumes());
    }
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleGuardDiscardAndContinue = () => {
    setIsDirty(false);
    if (activeResumeId) {
      const stored = getStoredResumes().find((r) => r.id === activeResumeId);
      if (stored) setActiveResume(JSON.parse(JSON.stringify(stored)));
    }
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleGuardCancel = () => {
    setPendingAction(null);
  };

  // Create Resume
  const handleCreateResume = async () => {
    executeWithDirtyGuard(async () => {
      const newResume = await createDefaultResume();
      saveStoredResume(newResume);
      const updatedList = getStoredResumes();
      setResumes(updatedList);
      selectResume(newResume.id, updatedList);
    });
  };

  // Select Resume Trigger
  const handleSelectResumeTrigger = (id: string) => {
    if (id === activeResumeId) return;
    executeWithDirtyGuard(() => {
      selectResume(id);
    });
  };

  // Back to Home Trigger
  const handleBackToHomeTrigger = () => {
    executeWithDirtyGuard(() => {
      onBackToHome();
    });
  };

  // Delete Resume Trigger
  const handleDeleteResumeConfirm = () => {
    if (!resumeToDelete) return;
    deleteStoredResume(resumeToDelete.id);
    const updatedList = getStoredResumes();
    setResumes(updatedList);

    if (activeResumeId === resumeToDelete.id) {
      if (updatedList.length > 0) {
        selectResume(updatedList[0].id, updatedList);
      } else {
        setActiveResumeId(null);
        setActiveResume(null);
        setActiveStudyGuide(null);
      }
    }
    setResumeToDelete(null);
  };

  // Form edit on active resume
  const handleResumeChange = (updatedResume: ResumeData) => {
    setActiveResume(updatedResume);
    setIsDirty(true);
  };

  // Save active resume
  const handleSaveResume = () => {
    if (!activeResume) return;
    saveStoredResume(activeResume);
    setIsDirty(false);
    setResumes(getStoredResumes());
  };

  // AI: Create Study Guide
  const handleCreateStudyGuide = () => {
    if (!activeResume) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const guide = generateStudyGuideFromResume(activeResume);
      saveStoredStudyGuide(guide);
      setActiveStudyGuide(guide);
      setActiveTab('study-guide');
      setIsAiProcessing(false);
    }, 600);
  };

  // AI: General Optimization (Opens Step-by-Step Wizard Modal)
  const handleGeneralOptimization = () => {
    if (!activeResume) return;
    setIsWizardModalOpen(true);
  };

  const handleSaveFromWizard = (updatedResume: ResumeData) => {
    saveStoredResume(updatedResume);
    setActiveResume(updatedResume);
    setIsDirty(false);
    setResumes(getStoredResumes());
  };

  // AI: Specific Optimization Submit
  const handleSpecificOptimizationSubmit = (companyInfo: TargetCompanyInfo) => {
    if (!activeResume) return;
    setIsJobModalOpen(false);
    setIsAiProcessing(true);
    setTimeout(() => {
      const proposed = generateSpecificAiOptimization(activeResume, companyInfo);
      setDiffData({ original: activeResume, proposed });
      setViewMode('optimization-diff');
      setIsAiProcessing(false);
    }, 600);
  };

  // Diff Acceptance
  const handleAcceptDiff = (updatedResume: ResumeData) => {
    saveStoredResume(updatedResume);
    setActiveResume(updatedResume);
    setIsDirty(false);
    setViewMode('edit');
    setDiffData(null);
    setResumes(getStoredResumes());
  };

  const handleRejectDiff = () => {
    setViewMode('edit');
    setDiffData(null);
  };

  // Section Ask AI
  const handleAskAiFromSection = (context: string) => {
    setInjectedContext(context);
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: 'assistant',
      text: `Context loaded for topic:\n${context}\nHow can I help you refine this section?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  // Chat send message
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `Regarding your query "${text}": Make sure to highlight key metrics and architectural decisions in your CV and study notes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const handleExportResumePdf = async () => {
    if (!activeResume || isPdfExporting) return;
    setIsPdfExporting(true);
    try {
      const res = await exportResumePdfAutomated('ats-resume-preview-document', activeResume.title);
      if (res.success && res.filePath) {
        addNotification(`Resumen exportado exitosamente a:\n${res.filePath}`, 'success');
      } else if (res.error) {
        addNotification(`Error al exportar PDF: ${res.error}`, 'error');
      }
    } catch (err: unknown) {
      console.error('Error exporting resume PDF automatically:', err);
      addNotification('Excepción al exportar el documento PDF.', 'error');
    } finally {
      setIsPdfExporting(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#020617] text-[#d3e4fe] font-sans overflow-hidden">
      {/* 1. Left Sidebar */}
      <StudioLeftSidebar
        resumes={resumes}
        activeResumeId={activeResumeId}
        onCreateResume={handleCreateResume}
        onSelectResume={handleSelectResumeTrigger}
        onDeleteRequest={(resume) => setResumeToDelete(resume)}
        onBackToHome={handleBackToHomeTrigger}
      />

      {/* 2. Main Canvas */}
      <StudioCanvas
        activeResume={activeResume}
        activeStudyGuide={activeStudyGuide}
        activeTab={activeTab}
        viewMode={viewMode}
        isDirty={isDirty}
        isExporting={isPdfExporting}
        diffData={diffData}
        onTabChange={(tab) => setActiveTab(tab)}
        onViewModeChange={(mode) => setViewMode(mode)}
        onResumeChange={handleResumeChange}
        onSaveResume={handleSaveResume}
        onExportResumePdf={handleExportResumePdf}
        onExportStudyGuidePdf={() => exportElementToPdf('study-guide-printable-document', 'Study_Guide')}
        onAcceptDiff={handleAcceptDiff}
        onRejectDiff={handleRejectDiff}
        onAskAiFromSection={handleAskAiFromSection}
      />

      {/* 3. Right Sidebar */}
      <StudioRightSidebar
        onCreateStudyGuide={handleCreateStudyGuide}
        onGeneralOptimization={handleGeneralOptimization}
        onSpecificOptimization={() => setIsJobModalOpen(true)}
        isProcessing={isAiProcessing}
        hasActiveResume={!!activeResume}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        injectedContext={injectedContext}
        onClearInjectedContext={() => setInjectedContext(null)}
      />

      {/* Modals */}
      <DeleteResumeModal
        isOpen={!!resumeToDelete}
        resumeTitle={resumeToDelete?.title || ''}
        onConfirm={handleDeleteResumeConfirm}
        onCancel={() => setResumeToDelete(null)}
      />

      <UnsavedChangesModal
        isOpen={!!pendingAction}
        onSaveAndContinue={handleGuardSaveAndContinue}
        onDiscardAndContinue={handleGuardDiscardAndContinue}
        onCancel={handleGuardCancel}
      />

      <JobOptimizationModal
        isOpen={isJobModalOpen}
        onSubmit={handleSpecificOptimizationSubmit}
        onCancel={() => setIsJobModalOpen(false)}
      />

      {activeResume && (
        <AiOptimizationWizardModal
          isOpen={isWizardModalOpen}
          activeResume={activeResume}
          onClose={() => setIsWizardModalOpen(false)}
          onSave={handleSaveFromWizard}
        />
      )}
    </div>
  );
};

export default Studio;
