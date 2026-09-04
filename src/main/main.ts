import { app, BrowserWindow } from 'electron';
import { WindowView } from './views/WindowView.js';
import { IpcController } from './controllers/IpcController.js';

const windowView = new WindowView();
const ipcController = new IpcController();

app.whenReady().then(() => {
  ipcController.register();
  windowView.createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowView.createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
