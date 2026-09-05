import { IpcController } from '../../../src/main/controllers/IpcController';
import { ipcMain } from 'electron';
import { ResumeStorage } from '../../../src/main/models/ResumeStorage';

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
  }
}));

jest.mock('../../../src/main/models/ResumeStorage');

describe('IpcController', () => {
  let controller: IpcController;
  let mockStorage: jest.Mocked<ResumeStorage>;

  beforeEach(() => {
    mockStorage = new ResumeStorage() as jest.Mocked<ResumeStorage>;
    controller = new IpcController(mockStorage);
    jest.clearAllMocks();
  });

  it('should register handlers', () => {
    controller.register();
    expect(ipcMain.handle).toHaveBeenCalledWith('check-saved-data', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('save-resume-data', expect.any(Function));
  });
});
