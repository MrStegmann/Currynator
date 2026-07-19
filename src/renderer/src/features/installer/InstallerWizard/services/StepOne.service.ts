/**
 * Initiates the Google OAuth flow via the Electron IPC channel.
 * @returns A promise resolving to the OAuth flow response containing the user profile or error.
 */
export async function googleAuthService(): Promise<any> {
  return await (window as any).electronAPI.googleOAuthFlow();
}

/**
 * Initiates the GitHub OAuth flow via the Electron IPC channel.
 * @returns A promise resolving to the OAuth flow response containing the user profile and token or error.
 */
export async function githubAuthService(): Promise<any> {
  return await (window as any).electronAPI.githubOAuthFlow();
}
