# Tasks: LinkedIn CSV Import Page

**Input**: Design documents from `/specs/004-linkedin-csv-import/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ipc-contract.md, quickstart.md

**Tests**: Included per mandatory project TDD guidelines in `constitution.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [x] T001 Install and verify `adm-zip` dependency in `package.json`
- [x] T002 [P] Create directory structure for feature under `src/renderer/src/features/linkedin-import/` and `src/main/controllers/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CSV parsing engine and base IPC types required before user stories can be executed

**⚠️ CRITICAL**: Must complete before user story work begins

- [x] T003 [P] Unit test for CSV parser utility in `src/main/tests/models/LinkedinCsvParser.test.ts`
- [x] T004 Implement lightweight RFC-4180 CSV parser utility in `src/main/models/LinkedinCsvParser.ts`
- [x] T005 [P] Define IPC type definitions for import progress and package contracts in `src/renderer/src/features/linkedin-import/types/importTypes.ts`

**Checkpoint**: Core CSV parser and contract types ready. User story implementation can begin.

---

## Phase 3: User Story 1 - Access LinkedIn Import View from Home (Priority: P1) 🎯 MVP

**Goal**: Render a floating "Import LinkedIn CSV" button on the Home page top-right corner that switches the view to a 2-column Import View (instructions + dropzone) with a working Back button.

**Independent Test**: Click floating button on Home view $\rightarrow$ Import View opens with 2-column layout $\rightarrow$ Click Back button $\rightarrow$ Return to Home view.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Unit test for `FloatingImportButton` component in `src/renderer/tests/features/linkedin-import/components/FloatingImportButton.test.tsx`
- [x] T007 [P] [US1] Unit test for `ImportView` component and navigation in `src/renderer/tests/features/linkedin-import/components/ImportView.test.tsx`

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement `FloatingImportButton` component anchored top-right in `src/renderer/src/features/linkedin-import/components/FloatingImportButton.tsx`
- [x] T009 [P] [US1] Implement step-by-step instruction list component in `src/renderer/src/features/linkedin-import/components/InstructionStepList.tsx`
- [x] T010 [P] [US1] Implement drag-and-drop / file selector box component in `src/renderer/src/features/linkedin-import/components/ZipDropzone.tsx`
- [x] T011 [US1] Implement 2-column layout container component with Back button in `src/renderer/src/features/linkedin-import/components/ImportView.tsx`
- [x] T012 [US1] Integrate `FloatingImportButton` and `ImportView` conditional rendering in `src/renderer/src/features/home/Home.tsx`

**Checkpoint**: User Story 1 MVP fully testable and functional independently.

---

## Phase 4: User Story 2 - Upload ZIP File & View Real-Time Progress (Priority: P2)

**Goal**: Select or drag-and-drop a LinkedIn `.zip` export file, extract and parse CSV files in the main process with live progress bar feedback in the renderer.

**Independent Test**: Select a valid ZIP archive $\rightarrow$ progress bar animates with step-by-step feedback messages $\rightarrow$ completes parsing without errors.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013 [P] [US2] Unit test for `LinkedinImportController` ZIP parsing in `src/main/tests/controllers/LinkedinImportController.test.ts`
- [x] T014 [P] [US2] Unit test for `useImportStore` state management in `src/renderer/tests/features/linkedin-import/store/useImportStore.test.ts`
- [x] T015 [P] [US2] Unit test for `ImportProgressBar` component in `src/renderer/tests/features/linkedin-import/components/ImportProgressBar.test.tsx`

### Implementation for User Story 2

- [x] T016 [P] [US2] Implement `useImportStore` for progress state, stage management, and skipped files in `src/renderer/src/features/linkedin-import/store/useImportStore.ts`
- [x] T017 [US2] Implement `LinkedinImportController` for extracting `.zip` archives via `adm-zip` and streaming progress events in `src/main/controllers/LinkedinImportController.ts`
- [x] T018 [US2] Register `linkedin:parse-zip` IPC handlers in `src/main/controllers/IpcController.ts`
- [x] T019 [P] [US2] Implement dynamic `ImportProgressBar` component in `src/renderer/src/features/linkedin-import/components/ImportProgressBar.tsx`
- [x] T020 [US2] Connect `ZipDropzone` file selection to `useImportStore` and IPC channel in `src/renderer/src/features/linkedin-import/components/ZipDropzone.tsx`

**Checkpoint**: User Stories 1 AND 2 working independently with live IPC progress updates.

---

## Phase 5: User Story 3 - Complete Import, Pre-Existing Data Prompt & Populate Resume (Priority: P3)

**Goal**: Prompt user when pre-existing resume data exists (Replace vs Merge) per FR-009, map extracted CSV rows to JSON Resume schema, update store, show skipped optional files list, and return to Home view with updated data.

**Independent Test**: Drop ZIP file $\rightarrow$ Prompt modal appears asking Replace/Merge $\rightarrow$ Choose option $\rightarrow$ Resume store updates $\rightarrow$ Skipped files listed $\rightarrow$ Click Return to Home $\rightarrow$ Home displays updated data.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T021 [P] [US3] Unit test for `PreExistingPromptModal` component in `src/renderer/tests/features/linkedin-import/components/PreExistingPromptModal.test.tsx`
- [x] T022 [P] [US3] Integration test for schema mapping and store updates in `src/renderer/tests/features/linkedin-import/store/importIntegration.test.ts`

### Implementation for User Story 3

- [x] T023 [P] [US3] Implement `PreExistingPromptModal` dialog (Replace vs Merge choice) in `src/renderer/src/features/linkedin-import/components/PreExistingPromptModal.tsx`
- [x] T024 [US3] Implement CSV-to-JSON Resume schema transformer (`Profile.csv`, `Positions.csv`, `Education.csv`, `Skills.csv`, `Languages.csv`, `Projects.csv`, `Certifications.csv`) in `src/main/models/LinkedinCsvParser.ts`
- [x] T025 [US3] Implement Replace vs Merge data combination logic in `src/main/controllers/LinkedinImportController.ts`
- [x] T026 [US3] Implement completion screen with skipped optional files report and "Return to Home" button in `src/renderer/src/features/linkedin-import/components/ImportView.tsx`
- [x] T027 [US3] Wire resume store update upon completion in `src/renderer/src/store/useResumeStore.ts`

**Checkpoint**: All user stories functional, data correctly mapped, and pre-existing prompt handled.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, full test suite validation, and end-to-end verification

- [x] T028 [P] Add TypeScript docstrings to `LinkedinImportController.ts` and `useImportStore.ts`
- [x] T029 Run full Jest test suite `npx jest` to ensure 100% test pass rate across all suites
- [x] T030 Run `npx tsc -b tsconfig.json` and `npx vite build` to verify clean build without warnings
- [x] T031 Execute quickstart verification steps from `specs/004-linkedin-csv-import/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (MVP!).
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion.
- **User Story 3 (Phase 5)**: Depends on Phase 4 (requires IPC zip parsing engine).
- **Polish (Phase 6)**: Depends on all User Stories completion.

### Parallel Opportunities

- T003, T005 in Phase 2 can run in parallel.
- T006, T007, T008, T009, T010 in Phase 3 can run in parallel.
- T013, T014, T015, T016, T019 in Phase 4 can run in parallel.
- T021, T023 in Phase 5 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & Phase 2
2. Complete Phase 3 (User Story 1)
3. **STOP and VALIDATE**: Verify floating button and Import View 2-column layout navigation.

### Incremental Delivery

1. Foundation ready $\rightarrow$ Complete US1 (Navigation MVP)
2. Complete US2 $\rightarrow$ ZIP parsing + Progress bar active
3. Complete US3 $\rightarrow$ Pre-existing prompt + Full Schema population + Skipped files report
4. Polish & full verification
