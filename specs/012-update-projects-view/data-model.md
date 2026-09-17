# Data Model: Projects Grid Pagination and Filtering

## Entities & Interfaces

### 1. GitHubRepository (Updated Entity)

Represents a GitHub repository entity fetched from the GitHub API.

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
  size: number; // Added to evaluate codebase presence (size in KB)
}
```

#### Validation & Filtering Rules
- `size > 0`: Must be non-zero size.
- `language !== null && language.trim() !== ''`: Must have a primary programming language detected by GitHub.

---

### 2. ProjectFilterState (New Interface)

Represents the state of active user filters applied to the projects grid.

```typescript
export interface ProjectFilterState {
  searchQuery: string;      // Case-insensitive substring search on repo name
  minStars: number;          // Minimum stargazers count threshold (>= 0)
  selectedLanguage: string;  // Selected programming language ("all" or language string)
}
```

#### Validation Rules
- `searchQuery`: String, trimmed during matching.
- `minStars`: Non-negative integer (`>= 0`).
- `selectedLanguage`: String ("all" means no language filter applied).

---

### 3. ProjectsState (Updated Zustand Store State)

```typescript
export interface ProjectsState {
  // Existing state
  token: string | null;
  isTokenConfigured: boolean;
  repositories: GitHubRepository[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number; // Configured to 9 (3x3 grid)

  // New filter state
  searchQuery: string;
  minStars: number;
  selectedLanguage: string;

  // Actions
  loadInitialState: () => void;
  saveToken: (plainToken: string) => Promise<boolean>;
  clearToken: () => void;
  fetchRepositories: (forceRefresh?: boolean) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
  
  // New Filter Actions
  setSearchQuery: (query: string) => void;
  setMinStars: (stars: number) => void;
  setSelectedLanguage: (language: string) => void;
  resetFilters: () => void;
}
```

---

## Derived State Expressions

### 1. Filtered Repositories Calculation
```typescript
const filteredRepositories = repositories.filter(repo => {
  const matchesName = repo.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
  const matchesStars = repo.stargazers_count >= minStars;
  const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
  return matchesName && matchesStars && matchesLanguage;
});
```

### 2. Dynamic Available Languages
```typescript
const availableLanguages = Array.from(
  new Set(repositories.map(repo => repo.language).filter((lang): lang is string => Boolean(lang)))
).sort();
```

### 3. Paginated Subset (3x3 Grid)
```typescript
const totalItems = filteredRepositories.length;
const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedRepositories = filteredRepositories.slice(startIndex, startIndex + itemsPerPage);
```
