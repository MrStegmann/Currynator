import { Resume } from '../../../../main/shared/schema/resumeSchema';

// Electron exposes ipcRenderer via window.electron in standard Vite/Electron setups
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      }
    }
  }
}

export const ipcClient = {
  async checkSavedData(): Promise<{ success: boolean; data?: Resume; error?: string }> {
    return window.electron.ipcRenderer.invoke('check-saved-data');
  },

  async saveResumeData(data: Resume): Promise<{ success: boolean; error?: string }> {
    return window.electron.ipcRenderer.invoke('save-resume-data', data);
  }
};
