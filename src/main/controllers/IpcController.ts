import { ipcMain } from 'electron';
import { ResumeStorage } from '../models/ResumeStorage.js';
import { Resume } from '../shared/schema/resumeSchema.js';
import { LinkedinImportController } from './LinkedinImportController.js';

export class IpcController {
  private linkedinImportController: LinkedinImportController;

  constructor(private storage: ResumeStorage) {
    this.linkedinImportController = new LinkedinImportController(storage);
  }

  registerHandlers() {
    // Legacy handlers for initialization feature
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

    // New handlers for Home feature
    ipcMain.handle('resume:load', async () => {
      try {
        const result = this.storage.checkSavedData();
        return result.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    ipcMain.handle('resume:save', async (_, data: Resume) => {
      try {
        this.storage.saveResumeData(data);
        return true;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // LinkedIn Import handlers
    ipcMain.handle('linkedin:parse-zip', async (event, filePath: string) => {
      try {
        return this.linkedinImportController.parseZipFile(filePath, (progress) => {
          event.sender.send('linkedin:import-progress', progress);
        });
      } catch (error) {
        return {
          success: false,
          skippedOptionalFiles: [],
          hasExistingData: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    ipcMain.handle('linkedin:save-imported', async (_, importedResume: Resume, strategy: 'replace' | 'keep') => {
      try {
        return this.linkedinImportController.saveImportedResume(importedResume, strategy);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }
}
