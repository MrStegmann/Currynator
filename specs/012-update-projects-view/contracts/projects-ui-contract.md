# UI Component & Service Contract: Projects View

## 1. GitHub API Fetch Service Contract (`githubService.ts`)

```typescript
export interface GitHubApiFetchResult {
  success: boolean;
  data?: GitHubRepository[];
  error?: string;
}

/**
 * Fetches user repositories from GitHub API and filters out empty or non-codebase repositories.
 * 
 * Filter rule: `repo.size > 0 && repo.language !== null`
 */
export function fetchGitHubRepositories(token: string): Promise<GitHubApiFetchResult>;
```

---

## 2. Project Filter Bar Component Contract (`ProjectFilterBar.tsx`)

### Props Contract
```typescript
export interface ProjectFilterBarProps {
  searchQuery: string;
  minStars: number;
  selectedLanguage: string;
  availableLanguages: string[];
  onSearchChange: (query: string) => void;
  onStarsChange: (stars: number) => void;
  onLanguageChange: (language: string) => void;
  onResetFilters: () => void;
}
```

### UI Specifications
- **Search Input**: Text field with search icon and placeholder `"Search by project name..."`.
- **Stars Filter**: Dropdown or numeric selector for minimum stars (Options: All / 0+, 5+, 10+, 25+, 50+, 100+).
- **Language Select**: Dropdown with options: `"All Languages"` plus dynamically hydrated options from `availableLanguages`.
- **Reset Button**: Secondary button to clear search and reset filters when active.

---

## 3. Projects Grid Component Contract (`ProjectsGrid.tsx`)

### Props Contract
```typescript
export interface ProjectsGridProps {
  repositories: GitHubRepository[];
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}
```

### Layout Specifications
- **Grid Container Class**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` (3 columns on standard/desktop views = 3x3 layout for 9 items).
- **Empty State**: Renders empty state card when `repositories.length === 0`. If `hasActiveFilters` is true, renders "No matching projects found" with reset action button.

---

## 4. Pagination Controls Contract (`PaginationControls.tsx`)

### Props Contract
```typescript
export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

### Specifications
- Render page controls when `totalPages > 1`.
- Previous button disabled when `currentPage <= 1`.
- Next button disabled when `currentPage >= totalPages`.
- Current status indicator: `"Page X of Y"`.
