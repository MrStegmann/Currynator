import { safeStorage } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';

/**
 * Interface mapping token types to their internal keys.
 */
export type TokenType = 'github' | 'google';

/**
 * Encrypts and saves the secure OAuth credentials to the OS keychain/local encrypted store.
 * @param tokenType - The target platform key descriptor ('github' | 'google').
 * @param tokenValue - The raw string credential payload to be stored.
 * @returns A promise that resolves to true upon successful encryption and write.
 * @throws {Error} If safeStorage is unavailable or the write operation fails.
 */
export async function saveSecureToken(tokenType: TokenType, tokenValue: string): Promise<boolean> {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('OS Native encryption is not available on this system.');
  }

  try {
    // Encrypt the string using OS Native Keychain (DPAPI on Windows, Keychain on macOS)
    const encryptedBuffer = safeStorage.encryptString(tokenValue);
    
    // We store the encrypted buffer in the app's userData directory
    const userDataPath = app.getPath('userData');
    const secureStoragePath = path.join(userDataPath, `${tokenType}_token.enc`);
    
    await fs.writeFile(secureStoragePath, encryptedBuffer);
    
    // As a secondary measure, if this is a GitHub token, we might want to also save
    // a non-sensitive flag in settings to indicate it's configured.
    return true;
  } catch (error: any) {
    console.error(`SecureStorageError: Failed to save secure token: ${error.message}`);
    throw error;
  }
}

/**
 * Retrieves and decrypts the secure OAuth credentials from the OS keychain.
 * @param tokenType - The target platform key descriptor ('github' | 'google').
 * @returns A promise that resolves to the decrypted string, or null if not found.
 */
export async function readSecureToken(tokenType: TokenType): Promise<string | null> {
  if (!safeStorage.isEncryptionAvailable()) {
    console.warn('Encryption not available. Cannot read secure token.');
    return null;
  }

  try {
    const userDataPath = app.getPath('userData');
    const secureStoragePath = path.join(userDataPath, `${tokenType}_token.enc`);
    
    const encryptedBuffer = await fs.readFile(secureStoragePath);
    const decryptedToken = safeStorage.decryptString(encryptedBuffer);
    
    return decryptedToken;
  } catch (error: any) {
    // File not found or decryption failed
    return null;
  }
}
