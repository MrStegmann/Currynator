import { JobApplicationStorage } from '../models/JobApplicationStorage.js';
import { JobApplication, JobApplicationStatus } from '../shared/schema/jobApplicationSchema.js';

export class JobApplicationController {
  constructor(private storage: JobApplicationStorage = new JobApplicationStorage()) {}

  async getAll(): Promise<{ success: boolean; data?: JobApplication[]; error?: string }> {
    try {
      const data = this.storage.getAll();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async save(jobApp: JobApplication): Promise<{ success: boolean; data?: JobApplication; error?: string }> {
    try {
      const data = this.storage.save(jobApp);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.storage.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateStatus(
    id: string,
    status: JobApplicationStatus
  ): Promise<{ success: boolean; data?: JobApplication; error?: string }> {
    try {
      const data = this.storage.updateStatus(id, status);
      if (!data) {
        return { success: false, error: 'Job application not found' };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
