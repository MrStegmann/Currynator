# Tasks: Projects Grid Pagination and Filtering

**Input**: Design documents from `/specs/012-update-projects-view/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included as per project constitution (TDD mandatory).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update project types and interface definitions

- [X] T001 Update TypeScript types in `src/renderer/src/features/projects/types/projects.ts` to include `size` on `GitHubRepository` and add `ProjectFilterState` interface.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: GitHub fetch service filtering for non-codebase repositories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Write unit tests for codebase filtering logic in `tests/unit/projects/githubService.test.ts` (verify `size > 0` and `language !== null` filters out empty/README-only repos).
- [X] T003 Update `fetchGitHubRepositories` in `src/renderer/src/features/projects/utils/githubService.ts` to map `size` and filter out empty/non-codebase repositories (`size > 0 && language !== null`).

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Codebase Projects in a 3x3 Grid (Priority: P1) 🎯 MVP

**Goal**: Display valid codebase projects in a 3x3 grid (9 cards per page).

**Independent Test**: Fetch GitHub repositories and verify projects are displayed in maximum 9 items per page (3 columns x 3 rows).

### Tests for User Story 1 (TDD) ⚠️

- [X] T004 [P] [US1] Write unit tests for default 9-item pagination (`itemsPerPage = 9`) in `tests/unit/projects/useProjectsStore.test.ts`.
- [X] T005 [P] [US1] Write unit tests for 3x3 grid layout rendering in `tests/unit/projects/ProjectsGrid.test.tsx`.

### Implementation for User Story 1

- [X] T006 [US1] Update `useProjectsStore` in `src/renderer/src/features/projects/store/useProjectsStore.ts` to set default `itemsPerPage` to 9.
- [X] T007 [US1] Update `ProjectsGrid` in `src/renderer/src/features/projects/components/ProjectsGrid.tsx` to 3 columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
- [X] T008 [US1] Update `ProjectsView` in `src/renderer/src/features/projects/components/ProjectsView.tsx` to pass 9 paginated items to `ProjectsGrid`.

**Checkpoint**: User Story 1 (3x3 Grid MVP) fully functional and testable independently.

---

## Phase 4: User Story 2 - Search and Dynamic Filtering (Priority: P2)

**Goal**: Filter projects by name search, minimum stars, and dynamic programming language selection.

**Independent Test**: Apply search input, stars filter, and language filter independently and in combination, verifying real-time grid updates.

### Tests for User Story 2 (TDD) ⚠️

- [X] T009 [P] [US2] Write unit tests for `ProjectFilterBar` interactions in `tests/unit/projects/ProjectFilterBar.test.tsx`.
- [X] T010 [P] [US2] Write unit tests for store filter setters (`setSearchQuery`, `setMinStars`, `setSelectedLanguage`, `resetFilters`) and dynamic language list calculation in `tests/unit/projects/useProjectsStore.test.ts`.

### Implementation for User Story 2

- [X] T011 [US2] Add filter state fields (`searchQuery`, `minStars`, `selectedLanguage`) and setter actions to `useProjectsStore` in `src/renderer/src/features/projects/store/useProjectsStore.ts`.
- [X] T012 [P] [US2] Create `ProjectFilterBar` component in `src/renderer/src/features/projects/components/ProjectFilterBar.tsx` containing name search input, star threshold filter dropdown, dynamic programming language dropdown, and clear filters button.
- [X] T013 [US2] Integrate `ProjectFilterBar` into `ProjectsView` in `src/renderer/src/features/projects/components/ProjectsView.tsx` and pass filtered repositories and dynamic languages list to `ProjectsGrid`.

**Checkpoint**: User Story 2 search and filter features working alongside User Story 1.

---

## Phase 5: User Story 3 - Pagination Reset on Filter Application (Priority: P3)

**Goal**: Automatically reset current pagination page to page 1 whenever any filter changes.

**Independent Test**: Navigate to page 2 or 3, change any filter, and confirm the active page resets to page 1.

### Tests for User Story 3 (TDD) ⚠️

- [X] T014 [P] [US3] Write unit tests verifying automatic pagination reset (`currentPage = 1`) on filter changes in `tests/unit/projects/useProjectsStore.test.ts`.

### Implementation for User Story 3

- [X] T015 [US3] Ensure filter setters (`setSearchQuery`, `setMinStars`, `setSelectedLanguage`, `resetFilters`) in `src/renderer/src/features/projects/store/useProjectsStore.ts` explicitly set `currentPage` to 1 upon invocation.

**Checkpoint**: All user stories functional and integrated with page reset logic.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Polish user experience and run end-to-end verification

- [X] T016 [P] Update empty state in `src/renderer/src/features/projects/components/ProjectsGrid.tsx` to handle "No projects match your search criteria" with a quick reset button.
- [X] T017 Execute full automated test suite (`npm test -- src/renderer/src/features/projects`) and validate manual scenarios in `specs/012-update-projects-view/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
  - US1 (P1) -> US2 (P2) -> US3 (P3)
- **Polish (Phase 6)**: Depends on all user stories complete

### Parallel Opportunities

- T002, T004, T005 can run in parallel
- T009, T010, T012 can run in parallel
- T014, T016 can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Phase 1 (Setup) + Phase 2 (Foundational)
2. Phase 3 (US1 - 3x3 Grid MVP)
3. Validate US1 independently

### Incremental Delivery
1. Add US2 (Search and Dynamic Filters) -> Validate
2. Add US3 (Pagination Reset) -> Validate
3. Polish & Complete validation
