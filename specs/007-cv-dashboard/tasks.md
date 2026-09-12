# Tasks: CV Dashboard View

**Input**: Design documents from `/specs/007-cv-dashboard/`

**Prerequisites**: [plan.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/plan.md), [spec.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/spec.md), [data-model.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/data-model.md), [cv-dashboard-ui-contract.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/contracts/cv-dashboard-ui-contract.md), [quickstart.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/quickstart.md)

**Tests**: TDD required by constitution (tests written before implementation tasks).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`)
- Explicit file paths included in all descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize directory structure for the new `cv-dashboard` feature module.

- [x] T001 Create feature directory structure in `src/renderer/src/features/cv-dashboard/` (components, models, store, tests)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model schemas and Zustand store infrastructure required before implementing user story UI features.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Create Zod schema and TypeScript types for `ApplicationCv` in `src/renderer/src/features/cv-dashboard/models/applicationCvSchema.ts`
- [x] T003 [P] Write store unit test for CV data loading and state operations in `src/renderer/src/features/cv-dashboard/tests/useCvDashboardStore.test.ts`
- [x] T004 Implement Zustand store `useCvDashboardStore` with initial mock data and actions in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`

**Checkpoint**: Core model and store ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Navbar Navigation & Empty Dashboard State (Priority: P1) 🎯 MVP

**Goal**: Enable navigating to CV Dashboard from main navbar and displaying a centered empty state when 0 CVs exist.

**Independent Test**: Click "CV Dashboard" navbar link when CV list is empty; verify active view switches to CV Dashboard and centered empty state message + "Crear nuevo CV" button render correctly.

### Tests for User Story 1

- [x] T005 [P] [US1] Write unit tests for navbar link switching and empty dashboard state rendering in `src/renderer/src/features/cv-dashboard/tests/CvDashboardView.test.tsx`

### Implementation for User Story 1

- [x] T006 [P] [US1] Create empty state component `CvDashboardEmptyState.tsx` displaying required text and button in `src/renderer/src/features/cv-dashboard/components/CvDashboardEmptyState.tsx`
- [x] T007 [US1] Add "CV Dashboard" navigation link to `RightNavBar.tsx` in `src/renderer/src/shared/components/RightNavBar/RightNavBar.tsx`
- [x] T008 [US1] Create basic `CvDashboardView.tsx` rendering `CvDashboardEmptyState` when CV list is empty in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`
- [x] T009 [US1] Update view switcher in `Home.tsx` to render `CvDashboardView` when active view is "CV Dashboard" in `src/renderer/src/features/home/Home.tsx`

**Checkpoint**: User Story 1 (MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Application CV Grid & Responsive Display (Priority: P2)

**Goal**: Display stored/mock CV cards in a responsive grid layout (3 columns on >675px, 1 column on <=675px).

**Independent Test**: Load mock CV data and verify 3-column grid layout on screens >675px and 1-column layout on screens <=675px with complete card metadata (vacancy title, snippet, timestamps).

### Tests for User Story 2

- [x] T010 [P] [US2] Write unit tests for CV card rendering and responsive grid layout in `src/renderer/src/features/cv-dashboard/tests/CvDashboardView.test.tsx`

### Implementation for User Story 2

- [x] T011 [P] [US2] Create `CvItemCard.tsx` component displaying vacancy title, description snippet, creation date, and last updated date in `src/renderer/src/features/cv-dashboard/components/CvItemCard.tsx`
- [x] T012 [US2] Update `CvDashboardView.tsx` to render responsive grid layout (3 columns >675px, 1 column <=675px) when CV items exist in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`

**Checkpoint**: User Stories 1 AND 2 work independently and seamlessly together.

---

## Phase 5: User Story 3 - CV Item Card Actions & Custom Delete Confirmation (Priority: P3)

**Goal**: Provide View, Edit, and Delete action icons on each card and present a custom confirmation modal upon requesting deletion.

**Independent Test**: Click Delete icon on a CV card; confirm custom modal appears (without native browser dialogs) and confirming deletion removes item from grid or switches to empty state if last item.

### Tests for User Story 3

- [x] T013 [P] [US3] Write unit tests for card action triggers and delete modal workflow in `src/renderer/src/features/cv-dashboard/tests/CvDashboardView.test.tsx`

### Implementation for User Story 3

- [x] T014 [P] [US3] Create custom deletion confirmation modal `DeleteCvModal.tsx` in `src/renderer/src/features/cv-dashboard/components/DeleteCvModal.tsx`
- [x] T015 [US3] Wire View, Edit, and Delete action icons in `CvItemCard.tsx` and integrate `DeleteCvModal` confirmation flow in `CvDashboardView.tsx` in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`

**Checkpoint**: All user stories fully implemented, integrated, and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final test suite verification and quickstart scenario validation.

- [x] T016 [P] Execute full test suite via Jest (`npm test`) to ensure zero regressions
- [x] T017 Verify all validation scenarios from `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories.
- **User Story 1 (Phase 3 - P1)**: Depends on Foundational completion.
- **User Story 2 (Phase 4 - P2)**: Depends on Foundational completion.
- **User Story 3 (Phase 5 - P3)**: Depends on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of User Stories 1, 2, and 3.

### Parallel Opportunities

- T002 and T003 can be developed in parallel during Phase 2.
- Within User Story 1 (Phase 3), T005 and T006 can run in parallel.
- Within User Story 2 (Phase 4), T010 and T011 can run in parallel.
- Within User Story 3 (Phase 5), T013 and T014 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. Validate empty state and navigation independently.

### Incremental Delivery

1. Phase 1 + 2 → Foundational data models and store ready.
2. Phase 3 → User Story 1 (Navigation & Empty State MVP).
3. Phase 4 → User Story 2 (Populated 3-column / 1-column Grid).
4. Phase 5 → User Story 3 (Card Actions & Custom Delete Confirmation Modal).
5. Phase 6 → Polish & Full Verification.
