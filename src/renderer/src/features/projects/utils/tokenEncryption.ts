const SALT = 'currynator-github-sec-v1';

export function encryptGitHubToken(plainToken: string): string {
  if (!plainToken) return '';
  try {
    const chars = plainToken.split('');
    const encryptedChars = chars.map((char, index) => {
      const saltChar = SALT[index % SALT.length];
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
    });
    return btoa(unescape(encodeURIComponent(encryptedChars.join(''))));
  } catch (err) {
    console.error('Failed to encrypt token:', err);
    return btoa(plainToken);
  }
}

export function decryptGitHubToken(encryptedToken: string): string {
  if (!encryptedToken) return '';
  try {
    const decodedStr = decodeURIComponent(escape(atob(encryptedToken)));
    const chars = decodedStr.split('');
    const decryptedChars = chars.map((char, index) => {
      const saltChar = SALT[index % SALT.length];
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
    });
    return decryptedChars.join('');
  } catch (err) {
    console.error('Failed to decrypt token:', err);
    try {
      return atob(encryptedToken);
    } catch {
      return '';
    }
  }
}
