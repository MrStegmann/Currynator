import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { Resume, ResumeSchema } from '../shared/schema/resumeSchema.js';

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
        console.error('Resume Schema validation error on read:', JSON.stringify(result.error.format(), null, 2));
        throw new Error('Data is corrupted');
      }

      return { exists: true, data: result.data };
    } catch (error) {
      if (error instanceof Error && error.message !== 'Data is corrupted') {
        console.error('Error reading saved resume file:', error);
      }
      throw new Error('Data is corrupted');
    }
  }

  saveResumeData(data: Resume): void {
    const result = ResumeSchema.safeParse(data);
    if (!result.success) {
      console.error('Resume Schema validation error on save:', JSON.stringify(result.error.format(), null, 2));
      throw new Error(`Data validation failed: ${result.error.issues[0]?.message || 'Invalid schema'}`);
    }

    const filePath = this.getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2), 'utf8');
  }
}
