import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import { WindowView } from './views/WindowView.js';
import { IpcController } from './controllers/IpcController.js';
import { ResumeStorage } from './models/ResumeStorage.js';

// Auto-load .env file at startup if present
try {
  if (typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile();
  }
} catch {}

try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          let val = trimmed.substring(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
} catch {}

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
