import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import {
  JobApplication,
  JobApplicationListSchema,
  JobApplicationSchema,
  JobApplicationStatus,
} from '../shared/schema/jobApplicationSchema.js';

export class JobApplicationStorage {
  private getStoragePath(): string {
    return path.join(app.getPath('userData'), 'job_applications.json');
  }

  getAll(): JobApplication[] {
    const filePath = this.getStoragePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(rawData);
      const validation = JobApplicationListSchema.safeParse(parsed);
      if (!validation.success) {
        console.error('JobApplication schema validation error on read:', validation.error.format());
        return [];
      }
      return validation.data;
    } catch (error) {
      console.error('Error reading job applications file:', error);
      return [];
    }
  }

  save(data: JobApplication): JobApplication {
    const items = this.getAll();
    const existingIndex = items.findIndex((item) => item.id === data.id);

    const now = new Date().toISOString();
    const itemToSave: JobApplication = {
      ...data,
      created_at: data.created_at || now,
      updated_at: data.updated_at || now,
    };

    const validated = JobApplicationSchema.parse(itemToSave);

    if (existingIndex >= 0) {
      items[existingIndex] = validated;
    } else {
      items.push(validated);
    }

    const filePath = this.getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
    return validated;
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);

    const filePath = this.getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf8');
    return true;
  }

  updateStatus(id: string, status: JobApplicationStatus): JobApplication | null {
    const items = this.getAll();
    const target = items.find((item) => item.id === id);
    if (!target) {
      return null;
    }

    const updatedItem: JobApplication = {
      ...target,
      status,
      updated_at: new Date().toISOString(),
    };

    return this.save(updatedItem);
  }
}
