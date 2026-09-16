# Tasks: Sticky Header and Granular LinkedIn Import

**Input**: Design documents from `/specs/010-sticky-header-granular-import/`

**Prerequisites**: [spec.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/spec.md), [plan.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/plan.md), [research.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/research.md), [data-model.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/data-model.md), [contracts/import-resolution-contract.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/contracts/import-resolution-contract.md)

**Tests**: TDD standard is enforced per project constitution. Tests MUST be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- File paths are relative to repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Resolution types and shared definitions

- [X] T001 Create resolution types and option descriptors in `src/renderer/src/features/linkedin-import/types/importResolution.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core resolution engine required by import features

- [X] T002 Implement `applyGranularImportResolution` utility in `src/renderer/src/features/linkedin-import/utils/applyGranularImportResolution.ts`
- [X] T003 [P] Add unit tests for resolution engine in `tests/unit/linkedin-import/applyGranularImportResolution.test.ts`

---

## Phase 3: User Story 1 - Always-Visible Sticky Application Header (Priority: P1) 🎯 MVP

**Goal**: Make header remain sticky and visible at top of viewport when content scrolls.

**Independent Test**: Scroll down any long page in the app, confirm header remains pinned at `top: 0` without disappearing.

### Tests for User Story 1
- [X] T004 [P] [US1] Create unit tests for Header sticky positioning in `tests/unit/components/Header.test.tsx`

### Implementation for User Story 1
- [X] T005 [US1] Update `src/renderer/src/shared/components/Header/Header.tsx` to apply sticky positioning classes (`sticky top-0 z-50`)
- [X] T006 [US1] Refactor `src/renderer/src/features/home/Home.tsx` container elements to ensure proper scroll boundaries for sticky header

**Checkpoint**: User Story 1 complete and independently testable.

---

## Phase 4: User Story 2 - Granular Section-by-Section LinkedIn Data Import Options (Priority: P1)

**Goal**: Allow user to pick Replace, Keep Original, or Merge per section with clear explanatory descriptions.

**Independent Test**: Import a LinkedIn ZIP file when profile data exists, verify per-section choices (Replace, Keep Original, Merge) with descriptions appear, select strategies, and confirm data updates accordingly.

### Tests for User Story 2
- [X] T007 [P] [US2] Create unit tests for GranularImportConflictModal in `tests/unit/linkedin-import/GranularImportConflictModal.test.tsx`

### Implementation for User Story 2
- [X] T008 [US2] Create `src/renderer/src/features/linkedin-import/components/GranularImportConflictModal.tsx` rendering section choices with descriptions
- [X] T009 [US2] Refactor `src/renderer/src/features/linkedin-import/components/PreExistingPromptModal.tsx` to delegate to `GranularImportConflictModal`
- [X] T010 [US2] Connect granular conflict modal and `applyGranularImportResolution` to `src/renderer/src/features/linkedin-import/components/ImportView.tsx`

**Checkpoint**: User Story 2 complete and independently testable.

---

## Phase 5: User Story 3 - LinkedIn Archive Import as First-Time Onboarding Alternative (Priority: P2)

**Goal**: Provide a LinkedIn ZIP import alternative directly on the first-time Onboarding screen.

**Independent Test**: Launch app with empty store, open Onboarding screen, upload LinkedIn ZIP, confirm profile creation and transition to main app.

### Tests for User Story 3
- [X] T011 [P] [US3] Create unit tests for OnboardingForm LinkedIn ZIP import in `tests/unit/initialization/OnboardingForm.test.tsx`

### Implementation for User Story 3
- [X] T012 [US3] Update `src/renderer/src/features/initialization/components/OnboardingForm.tsx` to present "Import LinkedIn ZIP" choice
- [X] T013 [US3] Integrate LinkedIn ZIP file extraction and profile initialization in `src/renderer/src/features/initialization/components/OnboardingForm.tsx`

**Checkpoint**: All user stories complete and independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T014 [P] Execute quickstart validation guide in `specs/010-sticky-header-granular-import/quickstart.md`
- [X] T015 Run complete test suite (`npm test`) to verify zero regressions

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: No dependencies - start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS User Story 2.
- **Phase 3 (User Story 1)**: Depends on Phase 1 - Can run in parallel with Phase 2.
- **Phase 4 (User Story 2)**: Depends on Phase 2 completion.
- **Phase 5 (User Story 3)**: Depends on Phase 2 completion.
- **Phase 6 (Polish)**: Depends on all user stories complete.

### MVP Scope
- User Story 1 (Sticky Header) + User Story 2 (Granular Import).
