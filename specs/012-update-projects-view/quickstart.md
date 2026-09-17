# Quickstart & Validation Guide: Projects View

## Prerequisites
- Node.js dependencies installed (`npm install`).
- Valid GitHub Personal Access Token configured in the app or test environment.

---

## 1. Automated Unit Tests

Run the test suite for projects feature components, store, and service:

```bash
npm test -- src/renderer/src/features/projects
```

### Key Automated Verification Assertions:
1. **GitHub Service (`githubService.test.ts`)**:
   - Verify that repositories with `size === 0` or `language === null` are filtered out of the returned dataset.
2. **Projects Store (`useProjectsStore.test.ts`)**:
   - Default `itemsPerPage` is `9`.
   - Setting `searchQuery`, `minStars`, or `selectedLanguage` updates the state and automatically sets `currentPage` to `1`.
3. **Project Filter Bar (`ProjectFilterBar.test.tsx`)**:
   - Renders search input, star filter dropdown, and language select dropdown with dynamically passed options.
   - Triggers callbacks on user interaction.
4. **Projects Grid & Pagination (`ProjectsGrid.test.tsx`)**:
   - Renders 3x3 layout (3 columns on desktop).
   - Displays 9 cards per page.

---

## 2. Manual Verification Workflow

1. **Launch Dev Application**:
   ```bash
   npm run dev
   ```
2. **Navigate to Projects View**:
   - Ensure GitHub Personal Access Token is configured.
3. **Verify Codebase Filtering**:
   - Confirm empty repositories or markdown-only repos are not displayed.
4. **Verify 3x3 Grid Layout**:
   - Check that the page displays up to 9 cards in 3 rows and 3 columns.
5. **Test Name Search**:
   - Type a repository name in the search bar.
   - Verify matching items filter instantly and pagination resets to page 1.
6. **Test Star Filter**:
   - Select a minimum star threshold (e.g. 5+ stars).
   - Verify only repositories with $\ge 5$ stars are displayed.
7. **Test Dynamic Language Select**:
   - Open the programming language dropdown.
   - Verify the listed languages match the languages of fetched projects.
   - Select a language and verify the grid displays matching projects only.
