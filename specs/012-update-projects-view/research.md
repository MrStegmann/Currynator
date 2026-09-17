# Research: Projects Grid Pagination and Filtering

## 1. Codebase Repository Filtering Strategy

### Decision
Filter repositories returned by GitHub API based on repository metadata:
1. `size > 0`: Exclude completely empty repositories with 0 bytes.
2. `language !== null`: Exclude repositories that only contain non-code assets (e.g., README-only, LICENSE-only, markdown-only, or media-only repos where GitHub's language detection engine returns `null`).
3. Maintain repo validity checking in `githubService.ts` before caching or returning repositories to the store.

### Rationale
GitHub's API automatically calculates `size` and detects the primary `language` of a repository. Repositories consisting solely of `README.md`, `LICENSE`, or generic documentation files do not have a primary code language assigned by GitHub (`language: null`) and have minimal size. Filtering `size > 0 && language !== null` efficiently and reliably excludes non-codebase repositories without incurring extra API calls per repository.

### Alternatives Considered
- **Fetch `/languages` endpoint per repository**: Requires $N$ additional API calls, easily hitting GitHub API rate limits. Rejected.
- **Fetch repository tree contents**: Extremely heavy network traffic and slow response times. Rejected.
- **Client-side regex on filenames**: Impossible without fetching tree contents. Rejected.

---

## 2. 3x3 Grid Layout & Page Size Configuration

### Decision
1. Update `itemsPerPage` default value in `useProjectsStore` from `10` to `9`.
2. Update `ProjectsGrid.tsx` grid layout from `grid-cols-5` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

### Rationale
A 3-column layout combined with `itemsPerPage = 9` produces a balanced 3x3 grid (3 rows of 3 cards = 9 items per page) on desktop viewports, conforming to the exact business requirement.

### Alternatives Considered
- **CSS Flexbox with fixed widths**: Harder to align evenly across different screen sizes. Rejected in favor of CSS Grid.

---

## 3. Dynamic Language Hydration & Filter Architecture

### Decision
1. **Dynamic Language List**: Derived directly from the set of active codebase repositories:
   `Array.from(new Set(repositories.map(r => r.language).filter((lang): lang is string => Boolean(lang)))).sort()`
2. **Filter State in Zustand Store or View Hook**:
   - `searchQuery: string` (default `""`)
   - `minStars: number` (default `0`)
   - `selectedLanguage: string` (default `"all"`)
3. **Automatic Pagination Reset**: Any setter action for `searchQuery`, `minStars`, or `selectedLanguage` will trigger `set({ currentPage: 1 })`.

### Rationale
Deriving language options dynamically guarantees that the filter dropdown only presents relevant, selectable choices present in the user's current project list. Automatically resetting the page to 1 prevents out-of-range pagination bugs when filter changes reduce total matching items.
