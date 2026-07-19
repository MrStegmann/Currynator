import { ipcMain } from 'electron';
import { analyzeGithubProfile } from '../services/github.service.js';

export function registerGithubIpcHandlers() {
  ipcMain.handle('analyze-github', async () => {
    try {
      const data = await analyzeGithubProfile();
      return { success: true, data };
    } catch (error: any) {
      console.error('analyze-github IPC Error:', error);
      return { success: false, error: error.message };
    }
  });
}
