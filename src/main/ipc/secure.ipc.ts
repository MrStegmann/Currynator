import { ipcMain } from 'electron';
import { saveSecureToken, type TokenType } from '../services/secure.service.js';

export function registerSecureIpcHandlers() {
  ipcMain.handle('save-secure-token', async (_event, tokenType: TokenType, tokenValue: string) => {
    try {
      const success = await saveSecureToken(tokenType, tokenValue);
      return { success };
    } catch (error: any) {
      console.error('save-secure-token IPC error:', error);
      return { success: false, error: error.message };
    }
  });
}
