/**
 * Sends the GitHub Personal Access Token to the secure storage via IPC.
 * @param token The GitHub Personal Access Token.
 * @returns A promise resolving to the response containing success status or error.
 */
export async function saveTokenService(token: string): Promise<any> {
  return await (window as any).electronAPI.saveSecureToken('github', token);
}
