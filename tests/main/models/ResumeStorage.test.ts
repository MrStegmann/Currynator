import { ResumeStorage } from '../../../src/main/models/ResumeStorage';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => __dirname)
  }
}));

describe('ResumeStorage', () => {
  let storage: ResumeStorage;
  const testDataPath = path.join(__dirname, 'resume.json');
  const tempPath = path.join(__dirname, 'resume.json.tmp');

  beforeEach(() => {
    storage = new ResumeStorage();
    if (fs.existsSync(testDataPath)) fs.unlinkSync(testDataPath);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  });

  afterAll(() => {
    if (fs.existsSync(testDataPath)) fs.unlinkSync(testDataPath);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  });

  it('should return null when no data exists', () => {
    const data = storage.getData();
    expect(data).toBeNull();
  });

  it('should save and retrieve data correctly', () => {
    const basics = { name: 'Test', email: 'test@example.com', label: 'Dev' };
    const success = storage.saveData({ basics });
    expect(success).toBe(true);
    
    const data = storage.getData();
    expect(data?.basics.name).toBe('Test');
  });

  it('should perform saves properly', () => {
    const basics = { name: 'Test', email: 'test@example.com', label: 'Dev' };
    storage.saveData({ basics });
    
    // Check if the final file exists
    expect(fs.existsSync(testDataPath)).toBe(true);
  });
});
