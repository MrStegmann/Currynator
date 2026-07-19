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
  return await window.electronAPI.saveSettings(settings);
}

/**
 * Retrieves the current user profile.
 * @returns A promise resolving to the current profile object.
 */
export async function getProfileService(): Promise<any> {
  return await window.electronAPI.getProfile();
}

/**
 * Saves the user profile via IPC.
 * @param profile The profile object to save.
 * @returns A promise resolving to the response containing success status or error.
 */
export async function saveProfileService(profile: any): Promise<any> {
  return await window.electronAPI.saveProfile(profile);
}
