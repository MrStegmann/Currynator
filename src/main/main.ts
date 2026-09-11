import { app, BrowserWindow } from 'electron';
import { WindowView } from './views/WindowView.js';
import { IpcController } from './controllers/IpcController.js';
import { ResumeStorage } from './models/ResumeStorage.js';

const windowView = new WindowView();
const resumeStorage = new ResumeStorage();
const ipcController = new IpcController(resumeStorage);

app.whenReady().then(() => {
  ipcController.registerHandlers();
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
