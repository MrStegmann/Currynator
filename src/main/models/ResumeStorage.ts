import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export class ResumeStorage {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(app.getPath('userData'), 'resume.json');
  }

  public getData(): any {
    if (!fs.existsSync(this.dataPath)) {
      return null;
    }
    
    try {
      const raw = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      // If parsing fails, we consider it corrupted data. We can throw or return an error object.
      // But based on the spec, returning null might trigger the onboarding form, whereas we want the corrupted data modal.
      // So we should return a specific structure indicating corruption, or throw.
      throw new Error('CORRUPTED_DATA');
    }
  }

  public saveData(data: any): boolean {
    const tempPath = this.dataPath + '.tmp';
    try {
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dataPath);
      return true;
    } catch (e) {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      return false;
    }
  }
}
