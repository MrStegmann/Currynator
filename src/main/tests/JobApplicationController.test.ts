import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { JobApplicationController } from '../controllers/JobApplicationController.js';
import { JobApplicationStorage } from '../models/JobApplicationStorage.js';
import { JobApplication } from '../shared/schema/jobApplicationSchema.js';

jest.mock('../models/JobApplicationStorage.js');

describe('JobApplicationController', () => {
  let controller: JobApplicationController;
  let mockStorage: jest.Mocked<JobApplicationStorage>;

  const mockApp: JobApplication = {
    id: 'app-1',
    title: 'Frontend Dev',
    jobDescription: 'React TS',
    companyDescription: 'Company',
    jobRequirement: 'Requirements',
    companyWebsiteUrl: 'https://example.com',
    created_at: '2026-09-13T20:00:00.000Z',
    updated_at: '2026-09-13T20:00:00.000Z',
    status: 'applied',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = new JobApplicationStorage() as jest.Mocked<JobApplicationStorage>;
    controller = new JobApplicationController(mockStorage);
  });

  describe('getAll', () => {
    it('should return success response with all applications', async () => {
      mockStorage.getAll.mockReturnValue([mockApp]);

      const res = await controller.getAll();
      expect(res).toEqual({ success: true, data: [mockApp] });
    });

    it('should handle errors gracefully', async () => {
      mockStorage.getAll.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const res = await controller.getAll();
      expect(res).toEqual({ success: false, error: 'Storage error' });
    });
  });

  describe('save', () => {
    it('should save application and return success response', async () => {
      mockStorage.save.mockReturnValue(mockApp);

      const res = await controller.save(mockApp);
      expect(res).toEqual({ success: true, data: mockApp });
    });
  });

  describe('delete', () => {
    it('should delete application and return success response', async () => {
      mockStorage.delete.mockReturnValue(true);

      const res = await controller.delete('app-1');
      expect(res).toEqual({ success: true });
    });
  });

  describe('updateStatus', () => {
    it('should update status and return success response', async () => {
      const updatedApp = { ...mockApp, status: 'interview' as const };
      mockStorage.updateStatus.mockReturnValue(updatedApp);

      const res = await controller.updateStatus('app-1', 'interview');
      expect(res).toEqual({ success: true, data: updatedApp });
    });
  });
});
