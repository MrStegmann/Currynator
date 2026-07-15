import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface AppSettings {
  geminiApiKey: string;
  dataFolderPath: string;
}

export const getSettingsFilePath = () => {
  return path.join(app.getPath('userData'), 'settings.json');
};

export const getDefaultSettings = (): AppSettings => {
  return {
    geminiApiKey: '',
    dataFolderPath: path.join(app.getPath('documents'), 'Currynator')
  };
};

export const readSettings = async (): Promise<AppSettings> => {
  const filePath = getSettingsFilePath();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return { ...getDefaultSettings(), ...parsed };
  } catch (error) {
    // If file doesn't exist or is invalid, return defaults
    return getDefaultSettings();
  }
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const currentSettings = await readSettings();
  const newSettings = { ...currentSettings, ...settings };
  const filePath = getSettingsFilePath();
  
  await fs.writeFile(filePath, JSON.stringify(newSettings, null, 2), 'utf-8');
  
  // Ensure the data directory structure exists if the folder path is set
  if (newSettings.dataFolderPath) {
    try {
      await fs.mkdir(path.join(newSettings.dataFolderPath, 'data'), { recursive: true });
      await fs.mkdir(path.join(newSettings.dataFolderPath, 'CV'), { recursive: true });
      await fs.mkdir(path.join(newSettings.dataFolderPath, 'study'), { recursive: true });
      await fs.mkdir(path.join(newSettings.dataFolderPath, 'aiReasoning'), { recursive: true });
    } catch (e) {
      console.error('Failed to create directory structure for new settings path:', e);
    }
  }

  return newSettings;
};
