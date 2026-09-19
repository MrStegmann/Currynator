# Tasks: Project Score Visual & Improvement Tips

**Input**: Design documents from [`/specs/014-project-score-breakdown/`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/)

**Prerequisites**: [`plan.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/plan.md), [`spec.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/spec.md), [`research.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/research.md), [`data-model.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/data-model.md), [`contracts/project-score-modal.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/contracts/project-score-modal.md)

**Tests**: Test-Driven Development (TDD) tasks included per project constitution.

**Organization**: Tasks are grouped by user story (US1, US2, US3) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verifying test setup for project score feature

- [x] T001 Verify feature directory layout and test environment configuration in `src/renderer/src/features/projects/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and interfaces required across all user stories

- [x] T002 [P] Ensure type definitions for `AIScoreResult`, `ScoreLogItem`, and modal props exist in `src/renderer/src/features/projects/types/projects.ts`

**Checkpoint**: Foundational types ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Top-Right Interactive Score Badge (Priority: P1) 🎯 MVP

**Goal**: Reposition score badge to the top-right corner of each Project Card and bind an interactive click/tap handler.

**Independent Test**: Render `ProjectCard` with score data, verify badge is anchored in top-right corner and clicking or pressing Enter/Space fires `onScoreClick`.

### Implementation for User Story 1

- [x] T003 [P] [US1] Write unit tests for interactive top-right score badge positioning and click event in `src/renderer/src/features/projects/tests/ProjectCard.test.tsx`
- [x] T004 [US1] Update `ProjectCard.tsx` layout to position score badge in top-right corner and bind click handler in `src/renderer/src/features/projects/components/ProjectCard.tsx`

**Checkpoint**: User Story 1 is complete. Score badge is interactive and prominently located in the top-right corner of each Project Card.

---

## Phase 4: User Story 2 - Score Breakdown & Improvement Tips Modal (Priority: P2)

**Goal**: Build `ProjectScoreModal.tsx` and integrate it into `ProjectsGrid` and `ProjectsView` to display section score breakdowns and repository improvement recommendations.

**Independent Test**: Click top-right score badge on a project card, verify `ProjectScoreModal` opens with section scores, detailed logs, and bulleted improvement recommendations.

### Implementation for User Story 2

- [x] T005 [P] [US2] Write unit tests for score breakdown and improvement tips modal rendering in `src/renderer/src/features/projects/tests/ProjectScoreModal.test.tsx`
- [x] T006 [P] [US2] Create `ProjectScoreModal.tsx` component displaying section breakdown and improvement tips in `src/renderer/src/features/projects/components/ProjectScoreModal.tsx`
- [x] T007 [US2] Update `ProjectsGrid.tsx` to accept and pass `onOpenScoreModal` handler to `ProjectCard` items in `src/renderer/src/features/projects/components/ProjectsGrid.tsx`
- [x] T008 [US2] Update `ProjectsView.tsx` to manage modal active state and mount `ProjectScoreModal` in `src/renderer/src/features/projects/components/ProjectsView.tsx`

**Checkpoint**: User Story 2 is complete. Clicking score badge opens modal displaying full section logs and repository improvement tips.

---

## Phase 5: User Story 3 - Full Keyboard Accessibility & Screen Reader Navigation (Priority: P3)

**Goal**: Add focus trapping, `Escape` key close listener, and ARIA attributes (`role="dialog"`, `aria-labelledby`) to `ProjectScoreModal.tsx`.

**Independent Test**: Navigate to score badge via keyboard (`Tab`), activate (`Enter`), verify focus is trapped inside modal, press `Escape`, verify modal closes and focus returns to score badge.

### Implementation for User Story 3

- [x] T009 [P] [US3] Add unit tests for modal focus trapping, Escape key dismissal, and ARIA attributes in `src/renderer/src/features/projects/tests/ProjectScoreModal.test.tsx`
- [x] T010 [US3] Implement focus trap, keydown listeners, and ARIA attributes in `src/renderer/src/features/projects/components/ProjectScoreModal.tsx`

**Checkpoint**: User Story 3 is complete. Modal is fully accessible via keyboard navigation and screen readers.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and final test polish across all user stories

- [x] T011 [P] Run unit test suite for projects feature in `src/renderer/src/features/projects/tests/`
- [x] T012 Perform manual quickstart validation per `specs/014-project-score-breakdown/quickstart.md`

---

## Phase 7: Codebase Inspection & Performance Optimization (User Story 4 - Deep Codebase Evaluation)

**Goal**: Fetch actual repository codebase content (README, recent commit messages, recursive file tree) using GitHub PAT, construct enriched AI prompt payloads, and enforce zero fallback defaults.

**Independent Test**: Score a selected project card, verify `fetchProjectCodebaseDetails` fetches README text, commit logs, and file tree from GitHub API, and `GroqController` receives real codebase payload.

### Implementation for User Story 4

- [x] T013 [P] [US4] Implement `fetchProjectCodebaseDetails(token, owner, repo, defaultBranch)` in `src/renderer/src/features/projects/utils/githubService.ts` to fetch `README.md`, recent commits, and file tree via GitHub REST API.
- [x] T014 [P] [US4] Add unit tests for `fetchProjectCodebaseDetails` and file tree filtering in `tests/unit/projects/githubService.test.ts`.
- [x] T015 [US4] Update `scoreSingleProject` in `src/renderer/src/features/projects/store/useProjectsStore.ts` to fetch codebase details before scoring and construct an enriched payload containing `readmeContent`, `commitLogs`, and `fileTree`.
- [x] T016 [US4] Enforce strict zero-fallback policy in `src/renderer/src/features/projects/store/useProjectsStore.ts`—propagate explicit GitHub API error message if token scope or fetch fails.
- [x] T017 [US4] Calibrate prompt and audit criteria in `src/main/controllers/GroqController.ts` to evaluate real `readmeContent`, `commitLogs`, and `fileTree` data.
- [x] T018 [US4] Update `TokenSetupView.tsx` in `src/renderer/src/features/projects/components/TokenSetupView.tsx` to provide token scope guidance (`repo` scope required for private repository inspection).
- [x] T019 [US4] Run full test suite (`npm test`) to verify codebase enrichment, zero-fallback error propagation, and Groq scoring.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on US1 (Phase 3) completion.
- **User Story 3 (Phase 5)**: Depends on US2 (Phase 4) completion.
- **Polish (Phase 6)**: Depends on all user stories completed.

### Parallel Opportunities

- `T002` (Foundational types) can run in parallel with Setup verification.
- `T003` (ProjectCard unit test) and `T005` (ProjectScoreModal unit test) can run in parallel.
- `T006` (`ProjectScoreModal.tsx` creation) can be developed alongside `T004` (`ProjectCard.tsx` layout update).

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (`T001`) and Foundational (`T002`).
2. Complete User Story 1 (`T003`, `T004`).
3. Validate interactive top-right score badge on Project Cards.

### Incremental Delivery
1. Add User Story 2 (`T005` - `T008`) to render the score breakdown & improvement tips modal.
2. Add User Story 3 (`T009`, `T010`) for keyboard accessibility and focus trapping.
3. Run Polish tests (`T011`, `T012`).
