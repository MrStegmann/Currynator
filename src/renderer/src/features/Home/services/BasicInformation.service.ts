/**
 * Fetches the user's basic profile data from settings.
 * @returns A promise resolving to the user profile object or null.
 */
export async function fetchProfileData(): Promise<any> {
  const res = await (window as any).electronAPI.getSettings();
  if (res && res.success && res.data && res.data.profile) {
    return res.data.profile;
  }
  return null;
}

/**
 * Updates the user's basic profile data in settings.
 * @param profileData The new profile data object to save.
 * @returns A promise resolving to true if successful, false otherwise.
 */
export async function updateProfileData(profileData: any): Promise<boolean> {
  const res = await (window as any).electronAPI.getSettings();
  if (res && res.success) {
    const currentSettings = res.data;
    const newSettings = {
      ...currentSettings,
      profile: {
        ...currentSettings.profile,
        ...profileData
      }
    };
    const saveRes = await (window as any).electronAPI.saveSettings(newSettings);
    return !!(saveRes && saveRes.success);
  }
  return false;
}
