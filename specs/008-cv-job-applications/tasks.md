# Tasks: CV Job Application Management

**Input**: Design documents from `/specs/008-cv-job-applications/`

**Prerequisites**: [plan.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/plan.md), [spec.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/spec.md), [research.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/research.md), [data-model.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/data-model.md), [job-application-ipc.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/contracts/job-application-ipc.md)

**Tests**: Test-Driven Development (TDD) is MANDATORY per Project Constitution Rule IV. Unit tests MUST be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared schemas and type contracts

- [x] T001 [P] Create Zod schema and TypeScript types for JobApplication in `src/main/shared/schema/jobApplicationSchema.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend persistence, controller, and IPC infrastructure that MUST be complete before user story UI implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Write unit test for JobApplicationStorage in `src/main/tests/JobApplicationStorage.test.ts`
- [x] T003 Implement JobApplicationStorage model for local JSON isolation in `src/main/models/JobApplicationStorage.ts`
- [x] T004 Write unit test for JobApplicationController in `src/main/tests/JobApplicationController.test.ts`
- [x] T005 Implement JobApplicationController in `src/main/controllers/JobApplicationController.ts`
- [x] T006 Register JobApplicationController IPC handlers in `src/main/controllers/IpcController.ts`
- [x] T007 Expose jobApplication IPC methods via contextBridge in `src/main/preload.cts`

**Checkpoint**: Backend storage, controller, and IPC contextBridge ready - UI story implementation can now begin.

---

## Phase 3: User Story 1 - Create CV Job Application (Priority: P1) 🎯 MVP

**Goal**: Allow users to click top-right floating action button (FAB) on CV Dashboard, open form modal, fill application details, submit, save via IPC, and display card on dashboard.

**Independent Test**: Click top-right FAB, fill required fields in form, click Save, and verify newly created application card appears on the CV Dashboard.

### Tests for User Story 1 ⚠️

- [x] T008 [P] [US1] Write component tests for creation modal in `src/renderer/src/features/cv-dashboard/tests/JobApplicationFormModal.test.tsx`

### Implementation for User Story 1

- [x] T009 [US1] Implement JobApplicationFormModal component with field validation in `src/renderer/src/features/cv-dashboard/components/JobApplicationFormModal.tsx`
- [x] T010 [US1] Add top-right floating action button (FAB) in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx` to trigger creation modal
- [x] T011 [US1] Add job application save action and IPC call in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP ready).

---

## Phase 4: User Story 2 - Track and Update Application Status (Priority: P1)

**Goal**: Display status badge at top-left corner of each card and provide fast-status progression button to cycle status through pipeline stages (`applied` ➔ `called` ➔ `interview` ➔ `techTest` ➔ `rejected` ➔ `gotTheJob`).

**Independent Test**: Click fast-status progression button on a card and verify top-left status badge updates instantly through pipeline stages.

### Tests for User Story 2 ⚠️

- [x] T012 [P] [US2] Write tests for status badge rendering and fast-status progression logic in `src/renderer/src/features/cv-dashboard/tests/CvItemCardStatus.test.tsx`

### Implementation for User Story 2

- [x] T013 [US2] Render status indicator badge in top-left corner of `src/renderer/src/features/cv-dashboard/components/CvItemCard.tsx`
- [x] T014 [US2] Implement fast-status progression button and lifecycle transition logic in `src/renderer/src/features/cv-dashboard/components/CvItemCard.tsx`
- [x] T015 [US2] Add status update IPC action in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`

**Checkpoint**: User Stories 1 AND 2 work independently.

---

## Phase 5: User Story 3 - View, Edit, and Delete Job Applications (Priority: P2)

**Goal**: View details, pre-hydrate form in Edit mode for editing existing entries, confirm deletion, and replace mock data with real state loaded via IPC.

**Independent Test**: Open existing card in Edit mode to verify pre-hydrated fields, update data, delete a card, and verify persistent local storage reflects changes.

### Tests for User Story 3 ⚠️

- [x] T016 [P] [US3] Write tests for Edit pre-hydration, deletion confirmation, and real state IPC loading in `src/renderer/src/features/cv-dashboard/tests/CvDashboardCrud.test.tsx`

### Implementation for User Story 3

- [x] T017 [US3] Replace initial mock data with IPC fetch (`jobApplication:getAll`) in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`
- [x] T018 [US3] Connect Edit button on card to open form modal pre-hydrated with selected item data in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`
- [x] T019 [US3] Connect Delete button on card to DeleteCvModal and IPC delete action in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`

**Checkpoint**: All user stories (1, 2, 3) fully functional and testable independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and test suite verification

- [x] T020 [P] Run full backend and frontend Jest test suite
- [x] T021 Execute manual end-to-end verification steps from `specs/008-cv-job-applications/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion. Can proceed sequentially by priority (P1 ➔ P2) or in parallel.
- **Polish (Phase 6)**: Depends on completion of User Stories 1, 2, and 3.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase (Phase 2).
- **User Story 2 (P1)**: Can start after Foundational phase (Phase 2) and integrates with `CvItemCard.tsx`.
- **User Story 3 (P2)**: Can start after Foundational phase (Phase 2) and builds on Edit/Delete flows.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational - CRITICAL)
3. Complete Phase 3 (User Story 1)
4. **STOP and VALIDATE**: Verify creation and dashboard card display independently.

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 (Creation + FAB) ➔ MVP!
3. Add User Story 2 (Status Badge + Fast Progression)
4. Add User Story 3 (Edit pre-hydration, Delete, Real IPC state replacement)
5. Run full test suite & Quickstart validation.
