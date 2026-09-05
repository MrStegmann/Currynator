import { ipcMain } from 'electron';
import { ResumeStorage } from '../models/ResumeStorage.js';
import { Resume } from '../../shared/schema/resumeSchema.js';

export class IpcController {
  constructor(private storage: ResumeStorage) {}

  registerHandlers() {
    ipcMain.handle('check-saved-data', async () => {
      try {
        const result = this.storage.checkSavedData();
        return { success: true, data: result.data };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    ipcMain.handle('save-resume-data', async (_, data: Resume) => {
      try {
        this.storage.saveResumeData(data);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
  }
}
