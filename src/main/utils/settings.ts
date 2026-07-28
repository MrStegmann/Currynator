import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface AppSettings {
  geminiApiKey: string;
  dataFolderPath: string;
  isSetupComplete: boolean;
}

/**
 * Resolves the absolute path to the application settings JSON file.
 * @returns Absolute file path inside appuserData directory.
 */
export const getSettingsFilePath = (): string => {
  return path.join(app.getPath('userData'), 'settings.json');
};

/**
 * Returns default application settings.
 * @returns Default AppSettings object.
 */
export const getDefaultSettings = (): AppSettings => {
  return {
    geminiApiKey: '',
    dataFolderPath: path.join(app.getPath('documents'), 'Currynator'),
    isSetupComplete: false
  };
};

/**
 * Ensures essential application subdirectories (data, CV, study, aiReasoning) exist.
 * @param basePath - Absolute root data folder path.
 * @throws Error if directory creation fails due to EPERM or invalid path.
 */
export const ensureSubdirectoriesExist = async (basePath: string): Promise<void> => {
  await fs.mkdir(path.join(basePath, 'data'), { recursive: true });
  await fs.mkdir(path.join(basePath, 'Resume'), { recursive: true });
  await fs.mkdir(path.join(basePath, 'CV'), { recursive: true });
  await fs.mkdir(path.join(basePath, 'study'), { recursive: true });
  await fs.mkdir(path.join(basePath, 'aiReasoning'), { recursive: true });
};

/**
 * Resolves a guaranteed user-writable data directory path.
 * Detects restricted Default user paths or EPERM/EACCES permissions and falls back safely to appuserData.
 * @param targetPath - Optional custom directory path to validate.
 * @returns Safe, writable absolute directory path.
 */
export const getSafeDataFolderPath = async (targetPath?: string): Promise<string> => {
  const fallbackPath = path.join(app.getPath('userData'), 'documents');
  const pathToCheck = targetPath || path.join(app.getPath('documents'), 'Currynator');

  if (pathToCheck.toLowerCase().includes('\\users\\default\\')) {
    console.warn(`[getSafeDataFolderPath] Path '${pathToCheck}' is in Default profile. Falling back to '${fallbackPath}'.`);
    await ensureSubdirectoriesExist(fallbackPath);
    return fallbackPath;
  }

  try {
    await ensureSubdirectoriesExist(pathToCheck);
    return pathToCheck;
  } catch (error: unknown) {
    console.warn(`[getSafeDataFolderPath] Cannot write to '${pathToCheck}' (${error}). Falling back to '${fallbackPath}'.`);
    await ensureSubdirectoriesExist(fallbackPath);
    return fallbackPath;
  }
};

/**
 * Reads settings from disk and validates that the configured data folder path is safe and writable.
 * @returns Promise resolving to active AppSettings object.
 */
export const readSettings = async (): Promise<AppSettings> => {
  const filePath = getSettingsFilePath();
  let loadedSettings: AppSettings;
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    loadedSettings = { ...getDefaultSettings(), ...parsed };
  } catch (_error: unknown) {
    loadedSettings = getDefaultSettings();
  }

  loadedSettings.dataFolderPath = await getSafeDataFolderPath(loadedSettings.dataFolderPath);
  return loadedSettings;
};

/**
 * Persists updated settings to disk and verifies target folder structure write access.
 * @param settings - Partial settings object to merge and save.
 * @returns Promise resolving to updated AppSettings.
 */
export const saveSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const currentSettings = await readSettings();
  const newSettings = { ...currentSettings, ...settings };

  if (newSettings.dataFolderPath) {
    newSettings.dataFolderPath = await getSafeDataFolderPath(newSettings.dataFolderPath);
  }

  const filePath = getSettingsFilePath();
  await fs.writeFile(filePath, JSON.stringify(newSettings, null, 2), 'utf-8');

  return newSettings;
};
