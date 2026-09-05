import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { Resume, ResumeSchema } from '../../shared/schema/resumeSchema.js';

export class ResumeStorage {
  private getStoragePath(): string {
    return path.join(app.getPath('userData'), 'resume.json');
  }

  checkSavedData(): { exists: boolean; data: Resume | null } {
    const filePath = this.getStoragePath();
    if (!fs.existsSync(filePath)) {
      return { exists: false, data: null };
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    try {
      const parsedData = JSON.parse(rawData);
      // Validate with schema to ensure it's not corrupted
      const result = ResumeSchema.safeParse(parsedData);
      
      if (!result.success) {
        throw new Error('Data is corrupted');
      }

      return { exists: true, data: result.data };
    } catch (error) {
      throw new Error('Data is corrupted');
    }
  }

  saveResumeData(data: Resume): void {
    const filePath = this.getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
