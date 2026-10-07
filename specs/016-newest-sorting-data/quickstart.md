# Quickstart Validation Guide: Newest-First Chronological Data Sorting & GitHub Project Keyword Matching

## Purpose
This guide outlines runnable verification steps to validate universal descending chronological sorting and keyword-based GitHub project preselection.

---

## 1. Automated Test Execution

Run the Jest test suites specifically covering the sorting utilities, matcher utilities, store updates, and UI components:

```bash
npm test -- src/renderer/src/shared/utils/tests/dateSorting.test.ts
npm test -- src/renderer/src/features/projects/tests/projectMatcher.test.ts
npm test -- src/renderer/src/features/cv-dashboard/tests/useCvDashboardStore.test.ts
```

---

## 2. Interactive Validation Scenarios

### Scenario A: Universal Chronological Sorting (Home View)
1. Launch the application (`npm run dev`).
2. Navigate to **Home**.
3. Under **Work Experience**, add two jobs:
   - Job A: Start Date `2020-01`, End Date `2022-05`.
   - Job B: Start Date `2022-06`, End Date `Currently` (or leave empty).
4. **Expected Outcome**: Job B appears at the top above Job A.
5. Under **Education**, add:
   - Degree A: `2015-09` to `2019-06`.
   - Degree B: `2020-09` to `2024-06`.
6. **Expected Outcome**: Degree B appears before Degree A.

### Scenario B: Chronological Sorting in CV Generation
1. In **CV Dashboard**, create a **New Apply** or view an existing application's tailored CV.
2. Open **Preview CV**.
3. **Expected Outcome**: All work experiences, education degrees, and certificates are arranged in descending chronological order (newest first).

### Scenario C: GitHub Project Keyword Preselection
1. Navigate to **Projects** and ensure GitHub token is configured / repositories are loaded.
2. Navigate to **CV Dashboard** and click **New Apply**.
3. In Job Requirement, include: `Experience with TypeScript, React, and Python`.
4. Proceed to project selection or observe tailored CV generation.
5. **Expected Outcome**: Projects whose language or tags match `TypeScript` or `Python` are automatically matched and preselected.
