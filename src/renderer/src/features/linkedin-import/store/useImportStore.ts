import { create } from 'zustand';
import { ImportStage, ImportProgressState } from '../types/importTypes';
import { Resume } from '../../../../../shared/schema/resumeSchema';

interface ImportStoreState extends ImportProgressState {
  parsedResume: Resume | null;
  hasExistingData: boolean;
  status: ImportStage;
  startImport: () => void;
  setProgress: (progress: Partial<ImportProgressState>) => void;
  setParsedResume: (resume: Resume | null, hasExistingData: boolean) => void;
  setParsedData: (resume: Resume, hasExistingData: boolean, skippedOptionalFiles: string[]) => void;
  reset: () => void;
}

/**
 * Zustand store for managing the state of LinkedIn CSV import,
 * including progress percentage, stage labels, skipped optional files, and parsed resume data.
 */
export const useImportStore = create<ImportStoreState>((set) => ({
  stage: 'idle',
  status: 'idle',
  percentage: 0,
  message: '',
  skippedOptionalFiles: [],
  error: undefined,
  parsedResume: null,
  hasExistingData: false,

  startImport: () => set({ stage: 'parsing', status: 'parsing', percentage: 10, message: 'Processing LinkedIn ZIP archive...' }),

  setProgress: (progress) => set((state) => ({ ...state, ...progress, status: progress.stage || state.status })),

  setParsedResume: (resume, hasExistingData) => set({ parsedResume: resume, hasExistingData }),

  setParsedData: (resume, hasExistingData, skippedOptionalFiles) =>
    set({
      parsedResume: resume,
      hasExistingData,
      skippedOptionalFiles,
      stage: hasExistingData ? 'prompting' : 'saving',
      status: hasExistingData ? 'prompting' : 'saving'
    }),

  reset: () =>
    set({
      stage: 'idle',
      status: 'idle',
      percentage: 0,
      message: '',
      skippedOptionalFiles: [],
      error: undefined,
      parsedResume: null,
      hasExistingData: false
    })
}));
