import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { JobApplicationStorage } from '../models/JobApplicationStorage.js';
import { JobApplication } from '../shared/schema/jobApplicationSchema.js';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/mock/user/data/path'),
  },
}));

describe('JobApplicationStorage', () => {
  let storage: JobApplicationStorage;

  const mockApp: JobApplication = {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    jobDescription: 'React and TypeScript position',
    companyDescription: 'Awesome Tech',
    jobRequirement: '5+ years experience',
    companyWebsiteUrl: 'https://example.com',
    created_at: '2026-09-13T20:00:00.000Z',
    updated_at: '2026-09-13T20:00:00.000Z',
    status: 'applied',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new JobApplicationStorage();
  });

  describe('getAll', () => {
    it('should return an empty array if file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = storage.getAll();
      expect(result).toEqual([]);
    });

    it('should return saved applications if file exists and contains valid JSON', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([mockApp]));

      const result = storage.getAll();
      expect(result).toEqual([mockApp]);
    });

    it('should return empty array if file content is invalid JSON', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid-json');

      const result = storage.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should append new application and write to storage file', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const saved = storage.save(mockApp);
      expect(saved).toEqual(mockApp);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/mock/user/data/path', 'job_applications.json'),
        JSON.stringify([mockApp], null, 2),
        'utf8'
      );
    });

    it('should update existing application if id matches', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([mockApp]));

      const updatedApp: JobApplication = {
        ...mockApp,
        title: 'Lead Frontend Engineer',
        updated_at: '2026-09-13T21:00:00.000Z',
      };

      const saved = storage.save(updatedApp);
      expect(saved.title).toBe('Lead Frontend Engineer');

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/mock/user/data/path', 'job_applications.json'),
        JSON.stringify([updatedApp], null, 2),
        'utf8'
      );
    });
  });

  describe('delete', () => {
    it('should remove application by id and write updated list', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([mockApp]));

      const success = storage.delete('job-1');
      expect(success).toBe(true);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/mock/user/data/path', 'job_applications.json'),
        JSON.stringify([], null, 2),
        'utf8'
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status of matching application', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([mockApp]));

      const updated = storage.updateStatus('job-1', 'called');
      expect(updated?.status).toBe('called');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});
