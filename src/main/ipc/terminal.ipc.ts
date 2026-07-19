import { ipcMain } from 'electron';
import { executeTerminalCommand } from '../services/terminal.service.js';

export function registerTerminalIpcHandlers() {
  ipcMain.handle('execute-terminal-command', async (_event, commandStr: string) => {
    try {
      await executeTerminalCommand(commandStr);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
