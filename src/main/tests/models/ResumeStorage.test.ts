import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ResumeStorage } from '../../models/ResumeStorage.js';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/mock/user/data/path')
  }
}));

describe('ResumeStorage', () => {
  const storage = new ResumeStorage();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkSavedData', () => {
    it('should return true and data if file exists and is valid', () => {
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      const result = storage.checkSavedData();
      expect(result.exists).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should return exists: false if file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = storage.checkSavedData();
      expect(result.exists).toBe(false);
      expect(result.data).toBeNull();
    });

    it('should throw an error if data is corrupted', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid-json');

      expect(() => storage.checkSavedData()).toThrow();
    });
  });

  describe('saveResumeData', () => {
    it('should save valid data to the file system', () => {
      const validData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      
      storage.saveResumeData(validData);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join('/mock/user/data/path', 'resume.json'),
        JSON.stringify(validData, null, 2),
        'utf8'
      );
    });
  });
});
