# Tasks: App Initialization & Onboarding

**Input**: Design documents from `/specs/002-app-initialization/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test-Driven Development (TDD) is MANDATORY per the project constitution. Test tasks must be completed before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure for features (`src/renderer/src/features/initialization`, `src/renderer/src/features/data-display`, `src/main/src/models`, etc.)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Setup tests for Zod schema in `src/main/tests/schema/resumeSchema.test.ts`
- [x] T003 Implement canonical Zod schema for JSON Resume basics in `src/main/shared/schema/resumeSchema.ts` (Mandatory: name, email, label)
- [x] T004 [P] Setup tests for ResumeStorage in `src/main/tests/models/ResumeStorage.test.ts`
- [x] T005 [P] Implement `ResumeStorage.ts` in `src/main/src/models/ResumeStorage.ts` (File system or electron-store reading/writing)
- [x] T006 [P] Setup tests for IPC Controller in `src/main/tests/controllers/IpcController.test.ts`
- [x] T007 [P] Implement `check-saved-data` and `save-resume-data` in `src/main/src/controllers/IpcController.ts`
- [x] T008 [P] Implement typed IPC wrapper in `src/renderer/src/shared/ipc/ipcClient.ts`
- [x] T009 [P] Setup tests for initStore in `src/renderer/tests/features/initialization/store/initStore.test.ts`
- [x] T010 [P] Implement `initStore.ts` in `src/renderer/src/features/initialization/store/initStore.ts` using Zustand

**Checkpoint**: Foundation ready - Data persistence, IPC communication, and state management are functional.

---

## Phase 3: User Story 1 - Initial load without data (Priority: P1) 🎯 MVP

**Goal**: Users opening the app for the first time are greeted with a loading screen and then guided through a setup process (multi-step form) to input their basic information, terminating in a JSON display.

**Independent Test**: Launch the app with an empty local storage, observe the Greetings view, complete the multi-step basics form, and verify the saved JSON data is displayed in a `<textarea>`.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Write tests for GreetingsView in `src/renderer/tests/features/initialization/components/GreetingsView.test.tsx`
- [x] T012 [P] [US1] Write tests for OnboardingForm in `src/renderer/tests/features/initialization/components/OnboardingForm.test.tsx`
- [x] T013 [P] [US1] Write tests for JsonDisplayView in `src/renderer/tests/features/data-display/components/JsonDisplayView.test.tsx`
- [x] T014 [P] [US1] Write tests for ErrorScreen & CorruptedDataModal in `src/renderer/tests/features/initialization/components/ErrorScreen.test.tsx`

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement `GreetingsView.tsx` in `src/renderer/src/features/initialization/components/GreetingsView.tsx` (Trigger IPC check on mount)
- [x] T016 [P] [US1] Implement `ErrorScreen.tsx` (with Retry button) and `CorruptedDataModal.tsx` in `src/renderer/src/features/initialization/components/`
- [x] T017 [US1] Implement `OnboardingForm.tsx` (3 steps: Personal, Contact, Details) in `src/renderer/src/features/initialization/components/OnboardingForm.tsx`
- [x] T018 [US1] Implement `JsonDisplayView.tsx` (Read-only textarea) in `src/renderer/src/features/data-display/components/JsonDisplayView.tsx`
- [x] T019 [US1] Integrate state machine logic in `src/renderer/src/App.tsx` (Conditionally render views based on `initStore` state)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Initial load with existing data (Priority: P1)

**Goal**: Returning users seamlessly bypass the onboarding process and are shown their saved data.

**Independent Test**: Launch the application with pre-existing valid data in local storage and verify the Greetings loading state leads directly to the raw JSON display screen.

### Tests for User Story 2 ⚠️

- [x] T020 [US2] Write integration test for the bypassing flow in `src/renderer/tests/App.integration.test.tsx`

### Implementation for User Story 2

- [x] T021 [US2] Ensure `App.tsx` routing correctly transitions from `loading` directly to `has-data` when IPC check confirms existing valid data (mostly covered by US1 logic, but verified here).

**Checkpoint**: User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T022 [P] Run quickstart.md validation locally
- [x] T023 Code cleanup and Tailwind styling refinement across all new views

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 are intrinsically linked in `App.tsx`, but US1 provides the core UI components. US2 primarily verifies the state bypass.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Integrates seamlessly after User Story 1 components are built.

### Parallel Opportunities

- All models, controllers, and IPC setup in Phase 2 can be developed and unit-tested in parallel by different developers.
- React component UI development (GreetingsView, JsonDisplayView, etc.) can be parallelized in Phase 3.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Core Onboarding Flow)
4. Complete Phase 4: User Story 2 (State Bypass Flow)
5. **STOP and VALIDATE**: Test according to `quickstart.md`
6. Finish with Phase 5 (Polish)
