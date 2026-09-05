# Tasks: App Initialization & Dashboard

**Input**: Design documents from `/specs/002-app-initialization/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ipc.md, quickstart.md

**Tests**: Test-Driven Development (TDD) is MANDATORY per the project constitution. Test tasks are included and must be implemented before their corresponding functional code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create base project structure (electron-backend and renderer directories)
- [x] T002 Initialize package.json and install dependencies (Electron, React, Zustand, Zod, TailwindCSS, Jest, @groq/sdk)
- [x] T003 [P] Configure Jest testing environment and TypeScript for both backend and renderer
- [x] T004 [P] Configure TailwindCSS in the renderer workspace

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Implement JSON Resume schema using Zod in `src/renderer/shared/schema/resumeSchema.ts`
- [ ] T006 [P] Setup basic Electron main process structure in `src/main/main.ts` (<100 lines)
- [ ] T007 [P] Implement IPC client utility in `src/renderer/shared/ipc/ipcClient.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Initial load without data (Priority: P1) 🎯 MVP

**Goal**: Show greetings screen, check for data via IPC, and if missing, show basic onboarding form and save data.

**Independent Test**: Clear local storage, launch app, observe greetings, complete form, and see save success.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Create test for ResumeStorage in `tests/main/models/ResumeStorage.test.ts`
- [ ] T009 [P] [US1] Create test for IpcController in `tests/main/controllers/IpcController.test.ts`
- [ ] T010 [P] [US1] Create test for initStore in `tests/renderer/features/initialization/store/initStore.test.ts`
- [ ] T011 [P] [US1] Create component tests for GreetingsView and OnboardingForm in `tests/renderer/features/initialization/components/`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement ResumeStorage to handle data saving/checking locally in `src/main/models/ResumeStorage.ts`
- [ ] T013 [US1] Implement IpcController to handle `check-saved-data` and `save-resume-data` in `src/main/controllers/IpcController.ts`
- [ ] T014 [US1] Hook IpcController into main process in `src/main/main.ts`
- [ ] T015 [US1] Implement initStore (Zustand) in `src/renderer/features/initialization/store/initStore.ts`
- [ ] T016 [US1] Implement GreetingsView component in `src/renderer/features/initialization/components/GreetingsView.tsx`
- [ ] T017 [US1] Implement OnboardingForm component with Zod validation in `src/renderer/features/initialization/components/OnboardingForm.tsx`
- [ ] T031a [US1] Implement ErrorScreen component for IPC failure retry in `src/renderer/features/initialization/components/ErrorScreen.tsx`
- [ ] T031b [US1] Implement CorruptedDataModal component allowing data overwrite in `src/renderer/features/initialization/components/CorruptedDataModal.tsx`

**Checkpoint**: User Story 1 fully functional. A new user can complete the onboarding flow.

---

## Phase 4: User Story 2 - Initial load with existing data (Priority: P1)

**Goal**: Skip onboarding and route directly to dashboard if data exists.

**Independent Test**: Seed valid data, launch app, observe greetings, and directly transition to dashboard.

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Update initStore tests to verify routing behavior when `hasData` is true

### Implementation for User Story 2

- [ ] T019 [US2] Update initStore to transition state to 'home' when check IPC returns data in `src/renderer/features/initialization/store/initStore.ts`
- [ ] T020 [US2] Create main `App.tsx` router to switch between Initialization feature and Dashboard feature based on state

**Checkpoint**: Returning users bypass onboarding successfully.

---

## Phase 5: User Story 3 - Dashboard Layout and Navigation (Priority: P2)

**Goal**: Display minimal header, hamburger menu, and visual highlight for active link.

**Independent Test**: Navigate to dashboard, verify header presence and sidebar behavior.

### Tests for User Story 3 ⚠️

- [ ] T021 [P] [US3] Create tests for Header and Sidebar components in `tests/renderer/features/dashboard/components/`

### Implementation for User Story 3

- [ ] T022 [P] [US3] Implement Header component in `src/renderer/features/dashboard/components/Header.tsx`
- [ ] T023 [P] [US3] Implement Sidebar component with active link highlights in `src/renderer/features/dashboard/components/Sidebar.tsx`
- [ ] T024 [US3] Assemble Dashboard layout container utilizing Header and Sidebar

**Checkpoint**: Dashboard shell and navigation are fully functional.

---

## Phase 6: User Story 4 - Home Dashboard Data Display and Editing (Priority: P2)

**Goal**: Display JSON resume data grouped by section with independent edit buttons.

**Independent Test**: Verify distinct sections exist on dashboard and editing one section only affects that section's data.

### Tests for User Story 4 ⚠️

- [ ] T025 [P] [US4] Create test for dashboardStore in `tests/renderer/features/dashboard/store/dashboardStore.test.ts`
- [ ] T026 [P] [US4] Create test for ResumeSection component in `tests/renderer/features/dashboard/components/ResumeSection.test.tsx`

### Implementation for User Story 4

- [ ] T027 [P] [US4] Implement dashboardStore (Zustand) to manage resume sections state in `src/renderer/features/dashboard/store/dashboardStore.ts`
- [ ] T028 [US4] Implement ResumeSection component allowing scoped editing in `src/renderer/features/dashboard/components/ResumeSection.tsx`
- [ ] T029 [US4] Integrate ResumeSection into the Home view for each JSON resume property

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 Ensure TailwindCSS styling is consistent across all features
- [ ] T032 Run `quickstart.md` validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (US1 → US2 → US3 → US4) or in parallel if developers are available.
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation
- **User Story 2 (P1)**: Depends on US1 (needs the data flow established)
- **User Story 3 (P2)**: Foundation
- **User Story 4 (P2)**: Depends on US3 layout shell

### Parallel Opportunities

- All tests for a user story marked `[P]` can run in parallel.
- `[P]` tasks in Foundational phase (Schema, Main structure, IPC client) can be done concurrently.
- US3 components (Header and Sidebar) can be developed simultaneously (`T022` and `T023`).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and 2.
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Test User Story 1 (Onboarding flow).

### Incremental Delivery

1. Deliver US1 (Onboarding).
2. Deliver US2 (Bypass onboarding for returning users).
3. Deliver US3 (Dashboard Layout).
4. Deliver US4 (Dashboard Sections Editing).
