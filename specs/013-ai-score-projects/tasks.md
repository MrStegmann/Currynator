# Tasks: AI Score Projects

**Input**: Design documents from `/specs/013-ai-score-projects/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/groq-scoring-contract.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define types and data structures for project scoring and improvement suggestions.

- [x] T001 Update TypeScript types for AIScoreResult, ScoreLogItem, and ProjectScoreCategory in `src/renderer/src/features/projects/types/projects.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core main-process IPC controller and Groq service method that MUST be complete before UI integration.

**⚠️ CRITICAL**: Main process IPC bridge must be ready before renderer components can call AI scoring.

- [x] T002 Create unit tests for Groq scoring system prompt and response parsing in `src/main/tests/GroqController.test.ts`
- [x] T003 [P] Implement `scoreProject` method in `src/main/controllers/GroqController.ts` using `groq-sdk` JSON response mode evaluating 7 quality criteria, returning total score (1-100), log breakdowns, and `improvements` array
- [x] T004 [P] Register `groq:score-projects` IPC channel in `src/main/controllers/IpcController.ts` delegating calls to `GroqController.ts`
- [x] T005 Expose `groq.scoreProjects` IPC handler in Electron context bridge preload script `src/main/preload.cts`

**Checkpoint**: Foundation ready - main process IPC service is ready for renderer store integration.

---

## Phase 3: User Story 1 - Select and Score Specific Projects (Priority: P1) 🎯 MVP

**Goal**: Allow users to select project cards via checkbox/toggle and trigger AI scoring via a Floating Action Button (FAB) positioned beside the refresh button.

**Independent Test**: Select one or more project cards, click the AI Score FAB, and verify selected projects are scored with total score badge, section logs, and improvement suggestions rendered on cards.

### Tests for User Story 1

- [x] T006 [P] [US1] Create unit tests for selection state and scoring store actions in `src/renderer/src/features/projects/tests/useProjectsStore.test.ts`

### Implementation for User Story 1

- [x] T007 [US1] Extend Zustand store in `src/renderer/src/features/projects/store/useProjectsStore.ts` with `selectedRepoIds`, selection toggles (`toggleSelectRepo`, `clearSelection`), scoring state (`isScoring`), and `scoreSelectedProjects` action
- [x] T008 [P] [US1] Create `FloatingScoreButton` component in `src/renderer/src/features/projects/components/FloatingScoreButton.tsx` positioned beside refresh button with active/disabled states
- [x] T009 [US1] Update `ProjectCard` component in `src/renderer/src/features/projects/components/ProjectCard.tsx` to add selection checkbox, score badge (1-100), and collapsible log breakdown with bullet-point improvement suggestions (`improvements`)
- [x] T010 [US1] Mount `FloatingScoreButton` and wire selection handlers in `src/renderer/src/features/projects/components/ProjectsView.tsx`

**Checkpoint**: At this point, User Story 1 (selecting and scoring specific projects) is fully functional and testable.

---

## Phase 4: User Story 2 - Score All Projects with Confirmation Modal (Priority: P2)

**Goal**: Prompt user with a confirmation modal when 0 items are selected, warning about potential AI rate limits before scoring all projects sequentially one-by-one.

**Independent Test**: Deselect all project cards, click AI Score FAB, confirm modal displays text `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.`, click Confirm to score all projects sequentially.

### Tests for User Story 2

- [x] T011 [P] [US2] Create unit test for confirmation modal component and batch sequential store actions in `src/renderer/src/features/projects/tests/ScoreConfirmModal.test.tsx`

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `ScoreConfirmModal` component in `src/renderer/src/features/projects/components/ScoreConfirmModal.tsx` rendering warning `${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.` with Confirm/Cancel buttons
- [x] T013 [US2] Add `isConfirmModalOpen` state, modal toggle actions, and sequential `scoreAllProjects` action in `src/renderer/src/features/projects/store/useProjectsStore.ts`
- [x] T014 [US2] Connect `ScoreConfirmModal` and 0-selection FAB click trigger in `src/renderer/src/features/projects/components/ProjectsView.tsx`

**Checkpoint**: User Stories 1 AND 2 work independently and support both targeted and full-repository scoring workflows.

---

## Phase 5: User Story 3 - Detailed Score & Improvement Persistence (Priority: P3)

**Goal**: Persist evaluated scores, breakdown logs, and bullet-point improvement suggestions in LocalStorage across application reloads.

**Independent Test**: Score projects, refresh/restart application, verify total scores, logs, and improvement bullet lists remain displayed on project cards.

### Implementation for User Story 3

- [x] T015 [P] [US3] Add LocalStorage persistence key `currynator_project_scores` and hydration logic in `src/renderer/src/features/projects/store/useProjectsStore.ts`

**Checkpoint**: Scores and improvement lists remain persisted and restored on application load.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and final cleanup.

- [x] T016 [P] Run full Jest test suite using `npm test` to verify zero regression across main and renderer processes
- [x] T017 Execute manual validation scenarios in `specs/013-ai-score-projects/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - starts immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS UI integration
- **User Story 1 (Phase 3)**: Depends on Foundational completion (MVP delivery)
- **User Story 2 (Phase 4)**: Depends on Foundational completion & US1 store
- **User Story 3 (Phase 5)**: Depends on US1/US2 store state
- **Polish (Phase 6)**: Depends on completion of all user story tasks

### Parallel Opportunities

- T003, T004 can be developed in parallel once T002 test is defined
- T006, T008 can be built in parallel during US1 phase
- T011, T012 can be built in parallel during US2 phase

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 & 2 (Backend IPC & Groq scoring)
2. Complete Phase 3 (Selection checkbox + FAB + score/improvements rendering)
3. Validate US1 independently as functional MVP.

### Incremental Delivery
1. Deliver MVP (US1 - Target scoring)
2. Add US2 (Batch scoring with rate limit warning modal)
3. Add US3 (LocalStorage persistence across sessions)
