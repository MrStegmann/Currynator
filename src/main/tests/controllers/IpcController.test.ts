import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { IpcController } from '../../controllers/IpcController.js';
import { ResumeStorage } from '../../models/ResumeStorage.js';
import { ipcMain } from 'electron';

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn()
  }
}));

jest.mock('../../models/ResumeStorage.js');

describe('IpcController', () => {
  let ipcController: IpcController;
  let mockStorage: jest.Mocked<ResumeStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = new ResumeStorage() as jest.Mocked<ResumeStorage>;
    ipcController = new IpcController(mockStorage);
  });

  it('should register IPC handlers on initialization', () => {
    ipcController.registerHandlers();
    
    expect(ipcMain.handle).toHaveBeenCalledWith('check-saved-data', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('save-resume-data', expect.any(Function));
  });

  describe('check-saved-data handler', () => {
    it('should return successful response if data exists', async () => {
      ipcController.registerHandlers();
      const mockHandler = (ipcMain.handle as jest.Mock).mock.calls.find(call => call[0] === 'check-saved-data')?.[1] as Function;
      
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      mockStorage.checkSavedData.mockReturnValue({ exists: true, data: mockData });

      const response = await mockHandler({}, null);
      
      expect(response).toEqual({ success: true, data: mockData });
    });

    it('should return success with no data if data does not exist', async () => {
      ipcController.registerHandlers();
      const mockHandler = (ipcMain.handle as jest.Mock).mock.calls.find(call => call[0] === 'check-saved-data')?.[1] as Function;
      
      mockStorage.checkSavedData.mockReturnValue({ exists: false, data: null });

      const response = await mockHandler({}, null);
      
      expect(response).toEqual({ success: true, data: null });
    });

    it('should return error if checkSavedData throws', async () => {
      ipcController.registerHandlers();
      const mockHandler = (ipcMain.handle as jest.Mock).mock.calls.find(call => call[0] === 'check-saved-data')?.[1] as Function;
      
      mockStorage.checkSavedData.mockImplementation(() => { throw new Error('Data is corrupted'); });

      const response = await mockHandler({}, null);
      
      expect(response).toEqual({ success: false, error: 'Data is corrupted' });
    });
  });

  describe('save-resume-data handler', () => {
    it('should return success if data is saved', async () => {
      ipcController.registerHandlers();
      const mockHandler = (ipcMain.handle as jest.Mock).mock.calls.find(call => call[0] === 'save-resume-data')?.[1] as Function;
      
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };

      const response = await mockHandler({}, mockData);
      
      expect(mockStorage.saveResumeData).toHaveBeenCalledWith(mockData);
      expect(response).toEqual({ success: true });
    });

    it('should return error if saveResumeData throws', async () => {
      ipcController.registerHandlers();
      const mockHandler = (ipcMain.handle as jest.Mock).mock.calls.find(call => call[0] === 'save-resume-data')?.[1] as Function;
      
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      mockStorage.saveResumeData.mockImplementation(() => { throw new Error('Save failed'); });

      const response = await mockHandler({}, mockData);
      
      expect(response).toEqual({ success: false, error: 'Save failed' });
    });
  });
});
