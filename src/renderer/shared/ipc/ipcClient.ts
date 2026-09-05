import { Resume, Basics } from '../schema/resumeSchema';

export interface IElectronAPI {
  ping: () => Promise<string>;
  checkSavedData: () => Promise<Resume | null>;
  saveResumeData: (data: Partial<Resume>) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export const ipcClient = {
  checkSavedData: async (): Promise<Resume | null> => {
    return window.electron.checkSavedData();
  },
  saveResumeData: async (data: Partial<Resume>): Promise<boolean> => {
    return window.electron.saveResumeData(data);
  }
};
