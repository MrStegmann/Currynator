import type { ResumeData } from './resume.types';

/**
 * Represents a simulated interview question inside a Study Guide.
 */
export interface InterviewQuestion {
  id: string;
  question: string;
  proposedAnswer: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

/**
 * Represents a practical exercise scenario inside a Study Guide.
 */
export interface PracticalExercise {
  id: string;
  scenario: string;
  objective: string;
  hints: string[];
  solutionStrategy: string;
}

/**
 * Individual section within a generated Study Guide.
 */
export interface StudyGuideSection {
  id: string;
  keyword: string;
  conceptSummary: string;
  keyTakeaways: string[];
  simulatedInterview: InterviewQuestion[];
  practicalExercises: PracticalExercise[];
  projectTips: string[];
}

/**
 * Complete Study Guide document linked to a specific resume.
 */
export interface StudyGuideData {
  id: string;
  resumeId: string;
  createdAt: string;
  updatedAt: string;
  sections: StudyGuideSection[];
}

/**
 * Information payload for company-specific AI optimization.
 */
export interface TargetCompanyInfo {
  companyName: string;
  position: string;
  requisites: string;
  responsibilities?: string;
  location?: string;
}

/**
 * Chat message contract for the interactive AI Assistant panel.
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextSnippet?: string;
}

/**
 * Master state interface for the Studio Page workspace.
 */
export interface StudioState {
  activeResumeId: string | null;
  activeTab: 'resume' | 'study-guide';
  isDirty: boolean;
  viewMode: 'edit' | 'preview' | 'optimization-diff';
  diffData: {
    original: ResumeData | null;
    proposed: ResumeData | null;
  } | null;
  isAiProcessing: boolean;
  activeStudyGuide: StudyGuideData | null;
}
