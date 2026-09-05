import { ipcMain } from 'electron';
import { ResumeStorage } from '../models/ResumeStorage.js';
import { ResumeSchema } from '../shared/schema/resumeSchema.js';

export class IpcController {
  private storage: ResumeStorage;

  constructor(storage?: ResumeStorage) {
    this.storage = storage || new ResumeStorage();
  }

  public register(): void {
    ipcMain.handle('ping', async () => {
      return 'pong from main';
    });

    ipcMain.handle('check-saved-data', async () => {
      try {
        const rawData = this.storage.getData();
        if (!rawData) {
          return null; // No data found, trigger onboarding
        }

        // Validate data using Zod schema
        const result = ResumeSchema.safeParse(rawData);
        if (!result.success) {
          // It's corrupted or missing mandatory fields
          return { error: 'CORRUPTED_DATA', originalData: rawData };
        }

        return result.data;
      } catch (e: any) {
        if (e.message === 'CORRUPTED_DATA') {
          return { error: 'CORRUPTED_DATA' };
        }
        throw e;
      }
    });

    ipcMain.handle('save-resume-data', async (event, data) => {
      // If we are recovering from corrupted data, we might merge or just overwrite.
      // The spec says "overwrite the corrupted data" for basics.
      // However, if we preserve valid sections, we need to load existing, and merge.
      
      let existingData: any = {};
      try {
        const raw = this.storage.getData();
        if (raw) existingData = raw;
      } catch (e) {
        // Corrupted JSON is unrecoverable, we just start fresh with the new data
      }

      // Merge only if it's a partial update. The UI will pass the new basics section.
      const mergedData = {
        ...existingData,
        ...data
      };

      return this.storage.saveData(mergedData);
    });
  }
}
