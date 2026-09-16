import { encryptGitHubToken, decryptGitHubToken } from '../../../src/renderer/src/features/projects/utils/tokenEncryption';

describe('tokenEncryption Utility', () => {
  it('encrypts token string so it is no longer equal to plain text', () => {
    const plainToken = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
    const encrypted = encryptGitHubToken(plainToken);

    expect(encrypted).not.toBe(plainToken);
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('decrypts encrypted token back to original plain text', () => {
    const plainToken = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
    const encrypted = encryptGitHubToken(plainToken);
    const decrypted = decryptGitHubToken(encrypted);

    expect(decrypted).toBe(plainToken);
  });

  it('handles empty input gracefully', () => {
    expect(encryptGitHubToken('')).toBe('');
    expect(decryptGitHubToken('')).toBe('');
  });
});
