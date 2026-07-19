/**
 * Opens a native folder selection dialog via IPC.
 * @returns A promise resolving to the response containing the selected folder path or error.
 */
export async function selectDirectoryService(): Promise<any> {
  return await (window as any).electronAPI.selectFolder();
}

/**
 * Retrieves the current application settings.
 * @returns A promise resolving to the current settings object.
 */
export async function getSettingsService(): Promise<any> {
  return await (window as any).electronAPI.getSettings();
}

/**
 * Saves the application settings via IPC.
 * @param settings The configuration object to save.
 * @returns A promise resolving to the response containing success status or error.
 */
export async function saveSettingsService(settings: any): Promise<any> {
  return await (window as any).electronAPI.saveSettings(settings);
}
