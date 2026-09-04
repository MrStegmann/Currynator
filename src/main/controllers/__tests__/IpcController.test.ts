import { IpcController } from '../IpcController.js';
import { ipcMain } from 'electron';

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
  },
}));

describe('IpcController', () => {
  it('registers the ping handler which returns a pong message', async () => {
    const controller = new IpcController();
    controller.register();

    expect(ipcMain.handle).toHaveBeenCalledWith('ping', expect.any(Function));
    
    // Simulate the callback
    const handleMock = (ipcMain.handle as jest.Mock).mock.calls[0][1];
    const result = await handleMock();
    expect(result).toBe('pong from main');
  });
});
