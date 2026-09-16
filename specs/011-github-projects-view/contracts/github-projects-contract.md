# Contract: GitHub Projects API & Client

## Interface Definitions

```typescript
import { GitHubRepository } from '../types/projects';

export interface GitHubApiFetchResult {
  success: boolean;
  data?: GitHubRepository[];
  error?: string;
}

/**
 * Fetches user repositories directly from GitHub REST API
 */
export function fetchGitHubRepositories(token: string): Promise<GitHubApiFetchResult>;

/**
 * Encrypts a plain-text token string before saving
 */
export function encryptGitHubToken(plainToken: string): string;

/**
 * Decrypts an encrypted token string retrieved from storage
 */
export function decryptGitHubToken(encryptedToken: string): string;
```

## Contract Guarantee

1. **Secure Obfuscation**: `decryptGitHubToken(encryptGitHubToken(t))` MUST equal `t`.
2. **Graceful Fallback**: If `fetchGitHubRepositories` fails (due to network or invalid credentials), it returns `success: false` with descriptive `error` message without crashing the application.
3. **Array Boundaries**: `fetchGitHubRepositories` MUST return an array of repositories sorted by `updated_at` descending.
