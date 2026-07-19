import { ipcMain } from 'electron';
import { startGoogleOAuthFlow, startGithubOAuthFlow } from '../services/auth.service.js';

export function registerAuthIpcHandlers() {
  ipcMain.handle('google-oauth-flow', async () => {
    try {
      const profile = await startGoogleOAuthFlow();
      return { success: true, profile };
    } catch (error: any) {
      console.error('google-oauth-flow IPC error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('github-oauth-flow', async () => {
    try {
      const profile = await startGithubOAuthFlow();
      return { success: true, profile };
    } catch (error: any) {
      console.error('github-oauth-flow IPC error:', error);
      return { success: false, error: error.message };
    }
  });
}
