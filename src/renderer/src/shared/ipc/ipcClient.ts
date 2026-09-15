import { Resume } from '../../../../shared/schema/resumeSchema';

export interface GroqCvJobDrivenRequest {
  resume: Resume;
  jobApplication: {
    title: string;
    jobDescription: string;
    jobRequirement: string;
    companyDescription?: string;
    companyWebsiteUrl?: string;
  };
}

export interface GroqCvJobDrivenResponse {
  success: boolean;
  match_score?: number;
  json_resume?: Record<string, any>;
  error?: string;
}

// Electron exposes ipcRenderer via window.electron in standard Vite/Electron setups
declare global {
  interface Window {
    electron: {
      getPathForFile?: (file: File) => string;
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        on(channel: string, listener: (event: any, ...args: any[]) => void): void;
        removeListener(channel: string, listener: (event: any, ...args: any[]) => void): void;
      };
      groq?: {
        analyzeCvJobDriven(payload: GroqCvJobDrivenRequest): Promise<GroqCvJobDrivenResponse>;
      };
      jobApplication?: {
        getAll(): Promise<any>;
        save(data: any): Promise<any>;
        delete(id: string): Promise<any>;
        updateStatus(id: string, status: string): Promise<any>;
      };
    };
  }
}

export const ipcClient = {
  getPathForFile(file: File): string {
    if (window.electron?.getPathForFile) {
      try {
        const fullPath = window.electron.getPathForFile(file);
        if (fullPath) return fullPath;
      } catch (e) {
        // Fallback below
      }
    }
    return (file as any).path || file.name;
  },

  async checkSavedData(): Promise<{ success: boolean; data?: Resume; error?: string }> {
    return window.electron.ipcRenderer.invoke('check-saved-data');
  },

  async saveResumeData(data: Resume): Promise<{ success: boolean; error?: string }> {
    return window.electron.ipcRenderer.invoke('save-resume-data', data);
  },

  async parseLinkedinZip(filePath: string): Promise<any> {
    return window.electron.ipcRenderer.invoke('linkedin:parse-zip', filePath);
  },

  async saveImportedData(data: Resume, strategy: 'replace' | 'keep'): Promise<{ success: boolean; error?: string }> {
    return window.electron.ipcRenderer.invoke('linkedin:save-imported', data, strategy);
  },

  async analyzeCvJobDriven(payload: GroqCvJobDrivenRequest): Promise<GroqCvJobDrivenResponse> {
    if (window.electron?.groq?.analyzeCvJobDriven) {
      return window.electron.groq.analyzeCvJobDriven(payload);
    }
    return window.electron.ipcRenderer.invoke('groq:cv-job-driven', payload);
  },

  onImportProgress(listener: (progress: any) => void): () => void {
    if (window.electron?.ipcRenderer?.on) {
      const handler = (_: any, data: any) => listener(data);
      window.electron.ipcRenderer.on('linkedin:import-progress', handler);
      return () => {
        if (window.electron?.ipcRenderer?.removeListener) {
          window.electron.ipcRenderer.removeListener('linkedin:import-progress', handler);
        }
      };
    }
    return () => {};
  }
};
