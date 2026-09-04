import { ipcMain } from 'electron';

export class IpcController {
  public register(): void {
    ipcMain.handle('ping', async () => {
      return 'pong from main';
    });
  }
}
