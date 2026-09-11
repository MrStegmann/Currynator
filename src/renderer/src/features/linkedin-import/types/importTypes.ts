import { Resume } from '../../../../../shared/schema/resumeSchema';

export type ImportStage = 'idle' | 'extracting' | 'parsing' | 'prompting' | 'saving' | 'complete' | 'error';

export interface ImportProgressState {
  stage: ImportStage;
  percentage: number;
  message: string;
  skippedOptionalFiles: string[];
  error?: string;
}

export type ImportMode = 'replace' | 'merge';

export interface ParseZipResult {
  success: boolean;
  data?: Resume;
  skippedOptionalFiles: string[];
  hasExistingData: boolean;
  error?: string;
}

export interface ConfirmImportResult {
  success: boolean;
  data?: Resume;
  error?: string;
}
