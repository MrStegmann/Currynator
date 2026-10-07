# Contract: Project Keyword Matcher (`projectMatcher.ts`)

## Module Signature

```typescript
import { GitHubRepository } from '../../features/projects/types/projects';

export interface KeywordMatchOptions {
  keywords: string[];
  repositories: GitHubRepository[];
  caseSensitive?: boolean;
}

export interface ProjectMatchResult {
  repository: GitHubRepository;
  isMatched: boolean;
  matchedKeywords: string[];
}

/**
 * Extracts technology and language keywords from a job description or text requirement string.
 */
export function extractLanguageKeywords(text: string): string[];

/**
 * Evaluates GitHub repositories against a set of keywords and returns matched results.
 */
export function matchProjectsByKeywords(options: KeywordMatchOptions): ProjectMatchResult[];

/**
 * Convenience helper that returns array of repository IDs matching the given keywords.
 */
export function getPreselectedProjectIds(repositories: GitHubRepository[], keywords: string[]): number[];
```

## Behavior Contract

1. **Keyword Extraction**:
   - Tokenizes input strings (job requirements, job descriptions, or comma-separated tags).
   - Normalizes known language variants (e.g. `JS` -> `JavaScript`, `TS` -> `TypeScript`, `Py` -> `Python`, `Golang` -> `Go`, `C#` -> `C#`).

2. **Matching Criteria**:
   - Checks repository `language` (exact or normalized match).
   - Checks repository `name` and `description` for keyword occurrences.
   - Checks repository `topics` array if available.

3. **Fallback & Graceful Handling**:
   - If `keywords` is empty, returns `isMatched: false` for all repositories.
   - If `repositories` is empty, returns `[]`.
   - Never throws exceptions on malformed repository items.
