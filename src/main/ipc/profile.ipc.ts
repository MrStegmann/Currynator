import { ipcMain } from 'electron';
import { readProfile, saveProfile } from '../services/profile.service.js';

export function registerProfileIpcHandlers() {
  ipcMain.handle('get-profile', async () => {
    try {
      const profile = await readProfile();
      return { success: true, data: profile };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('save-profile', async (_event, profileData) => {
    try {
      const updatedProfile = await saveProfile(profileData);
      return { success: true, data: updatedProfile };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
