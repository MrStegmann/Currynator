# Tasks: GitHub Projects View Page

**Input**: Design documents from `/specs/011-github-projects-view/`

**Prerequisites**: [spec.md](file:///d:/Github/Currynator/specs/011-github-projects-view/spec.md), [plan.md](file:///d:/Github/Currynator/specs/011-github-projects-view/plan.md), [research.md](file:///d:/Github/Currynator/specs/011-github-projects-view/research.md), [data-model.md](file:///d:/Github/Currynator/specs/011-github-projects-view/data-model.md), [contracts/github-projects-contract.md](file:///d:/Github/Currynator/specs/011-github-projects-view/contracts/github-projects-contract.md)

**Tests**: TDD standard is enforced per project constitution. Tests MUST be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- File paths are relative to repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and encryption utilities

- [X] T001 Create project type definitions in `src/renderer/src/features/projects/types/projects.ts`
- [X] T002 [P] Create token encryption and decryption utility in `src/renderer/src/features/projects/utils/tokenEncryption.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: GitHub API client and Zustand store

- [X] T003 [P] Add unit tests for token encryption in `tests/unit/projects/tokenEncryption.test.ts`
- [X] T004 Implement GitHub REST API service in `src/renderer/src/features/projects/utils/githubService.ts`
- [X] T005 [P] Add unit tests for GitHub service in `tests/unit/projects/githubService.test.ts`
- [X] T006 Implement Zustand projects store in `src/renderer/src/features/projects/store/useProjectsStore.ts`

---

## Phase 3: User Story 1 - GitHub Access Token Setup & Secure Storage (Priority: P1) 🎯 MVP

**Goal**: Provide 2-column token setup interface with step-by-step guide, password mask toggle, and encrypted token saving.

**Independent Test**: Access setup view without saved token, verify 2-column layout, toggle password field between `password` and `text`, save token, and confirm store state updates.

### Tests for User Story 1
- [X] T007 [P] [US1] Create unit tests for TokenInputForm in `tests/unit/projects/TokenInputForm.test.tsx`

### Implementation for User Story 1
- [X] T008 [P] [US1] Create TokenGuide left-column component in `src/renderer/src/features/projects/components/TokenGuide.tsx`
- [X] T009 [US1] Create TokenInputForm right-column component with password visibility toggle in `src/renderer/src/features/projects/components/TokenInputForm.tsx`
- [X] T010 [US1] Create TokenSetupView 2-column container layout in `src/renderer/src/features/projects/components/TokenSetupView.tsx`

**Checkpoint**: User Story 1 complete and independently testable.

---

## Phase 4: User Story 2 - Paginated GitHub Projects List & Local Caching (Priority: P1)

**Goal**: Render repositories in a 5-column grid layout (max 10 per page) with offline local storage caching and pagination.

**Independent Test**: Load Projects view with token, verify cards in 5-column grid (`xl:grid-cols-5`), navigate pages with pagination bar, and verify offline local storage caching.

### Tests for User Story 2
- [X] T011 [P] [US2] Create unit tests for ProjectCard and ProjectsGrid in `tests/unit/projects/ProjectsGrid.test.tsx`

### Implementation for User Story 2
- [X] T012 [P] [US2] Create ProjectCard component in `src/renderer/src/features/projects/components/ProjectCard.tsx`
- [X] T013 [US2] Create ProjectsGrid component with 5-column responsive layout (`xl:grid-cols-5`) in `src/renderer/src/features/projects/components/ProjectsGrid.tsx`
- [X] T014 [US2] Create PaginationControls component for 10-item page navigation in `src/renderer/src/features/projects/components/PaginationControls.tsx`

**Checkpoint**: User Story 2 complete and independently testable.

---

## Phase 5: User Story 3 - NavBar Integration & Manual Refresh Action (Priority: P2)

**Goal**: Add "Projects" link to navigation drawer and a top-right floating refresh action button on the Projects view.

**Independent Test**: Click Projects link in NavBar to open Projects page, click top-right floating refresh button to re-fetch repositories from GitHub API.

### Tests for User Story 3
- [X] T015 [P] [US3] Create FloatingRefreshButton component in `src/renderer/src/features/projects/components/FloatingRefreshButton.tsx`
- [X] T016 [US3] Create ProjectsView main container component in `src/renderer/src/features/projects/components/ProjectsView.tsx`
- [X] T017 [US3] Expand `ActiveView` in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts` to include `'Projects'`
- [X] T018 [US3] Add "Projects" navigation link in `src/renderer/src/shared/components/RightNavBar/RightNavBar.tsx`
- [X] T019 [US3] Render `ProjectsView` when activeView is `'Projects'` in `src/renderer/src/features/home/Home.tsx`

**Checkpoint**: All user stories complete and independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T020 [P] Execute quickstart validation guide in `specs/011-github-projects-view/quickstart.md`
- [X] T021 Run complete test suite (`npm test`) to verify zero regressions

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: No dependencies - start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS User Stories 1, 2, and 3.
- **Phase 3 (User Story 1)**: Depends on Phase 2 completion.
- **Phase 4 (User Story 2)**: Depends on Phase 2 completion.
- **Phase 5 (User Story 3)**: Depends on Phase 3 and Phase 4 completion.
- **Phase 6 (Polish)**: Depends on all user stories complete.

### MVP Scope
- User Story 1 (Token Setup) + User Story 2 (Paginated Projects List).
