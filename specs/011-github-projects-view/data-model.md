# Data Model: GitHub Projects View Page

## Entities & Type Definitions

### 1. GitHub Token Configuration (`GitHubTokenConfig`)
```typescript
export interface GitHubTokenConfig {
  token: string;          // Encrypted token string
  isConfigured: boolean;  // Verification flag
  lastSavedAt: string;    // ISO Date string
}
```

### 2. GitHub Repository Entity (`GitHubRepository`)
Model representing a fetched user project repository:
```typescript
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
}
```

### 3. Projects Pagination State (`ProjectsPaginationState`)
```typescript
export interface ProjectsPaginationState {
  currentPage: number;
  itemsPerPage: number; // Constrained to 10 items max per page
  totalItems: number;
  totalPages: number;
}
```

### 4. Projects Store State (`ProjectsStoreState`)
Zustand store interface for managing Projects view data & state:
```typescript
export interface ProjectsStoreState {
  token: string | null;
  isTokenConfigured: boolean;
  repositories: GitHubRepository[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;

  saveToken: (token: string) => Promise<boolean>;
  clearToken: () => void;
  fetchRepositories: (forceRefresh?: boolean) => Promise<void>;
  setCurrentPage: (page: number) => void;
}
```

## Storage Keys

- **`currynator_github_token`**: Encrypted access token string in `localStorage`.
- **`currynator_github_repos`**: JSON stringified list of `GitHubRepository[]` cached in `localStorage`.
