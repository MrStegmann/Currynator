# Tasks: Header, Sidebar, and Dynamic Toolbar

**Input**: Design documents from `/specs/015-header-sidebar-toolbar/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/toolbar.contract.md, quickstart.md

**Tests**: TDD is mandatory per project constitution. Unit and component tests must be created and verified to fail prior to implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish type definitions and contracts for navigation and dynamic toolbar actions.

- [X] T001 [P] Define navigation and toolbar interfaces in `src/renderer/src/shared/types/navigation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core window initialization and shared layout prerequisites.

- [X] T002 [P] Create unit tests for maximized window initialization in `src/main/tests/views/WindowView.test.ts`
- [X] T003 Update `src/main/views/WindowView.ts` to maximize the main window on startup

**Checkpoint**: Main Electron window initializes in maximized state on startup.

---

## Phase 3: User Story 1 - Pinned Navigation and Maximized Layout (Priority: P1) 🎯 MVP

**Goal**: Make the side navigation permanently visible at maximized/desktop window size, remove the burger menu toggle from the header in maximized state, and strictly order navigation links as Home -> Projects -> CV Dashboard.

**Independent Test**: Launch the application; verify the window opens maximized, sidebar is pinned open with links strictly in order (Home, Projects, CV Dashboard), and the header no longer renders a burger toggle button on desktop view.

### Tests for User Story 1 (TDD) ⚠️

- [X] T004 [P] [US1] Create unit tests for Header responsive burger visibility and rightSlot in `src/renderer/tests/shared/components/Header.test.tsx`
- [X] T005 [P] [US1] Create unit tests for RightNavBar link ordering and pinned desktop layout in `src/renderer/tests/shared/components/RightNavBar.test.tsx`

### Implementation for User Story 1

- [X] T006 [US1] Update `src/renderer/src/shared/components/Header/Header.tsx` to support `rightSlot` and hide the burger toggle button on maximized/desktop screen sizes
- [X] T007 [US1] Update `src/renderer/src/shared/components/RightNavBar/RightNavBar.tsx` to reorder links to `Home` -> `Projects` -> `CV Dashboard` and apply pinned sidebar styling for desktop viewport
- [X] T008 [US1] Update `src/renderer/src/features/home/Home.tsx` to integrate pinned sidebar layout without requiring manual burger toggle on desktop

**Checkpoint**: User Story 1 is complete and independently testable (Sidebar pinned, links reordered, burger toggle removed on desktop).

---

## Phase 4: User Story 2 - Contextual Dynamic Right-Side Toolbar (Priority: P2)

**Goal**: Provide a dynamic action toolbar on the right side of the interface displaying context-specific action buttons for Home (`Import LinkedIn CSV`), CV Dashboard (`New Apply`), and Projects (`Sync Projects` and `Score Projects`).

**Independent Test**: Switch between Home, Projects, and CV Dashboard views; verify the right toolbar dynamically renders the corresponding action buttons and triggers each workflow when clicked.

### Tests for User Story 2 (TDD) ⚠️

- [X] T009 [P] [US2] Create unit tests for DynamicToolbar context switching and button triggers in `src/renderer/tests/shared/components/DynamicToolbar.test.tsx`
- [X] T010 [P] [US2] Create integration tests for dynamic toolbar action workflows in `src/renderer/tests/features/home/DynamicToolbarIntegration.test.tsx`

### Implementation for User Story 2

- [X] T011 [US2] Implement `DynamicToolbar` component in `src/renderer/src/shared/components/DynamicToolbar/DynamicToolbar.tsx`
- [X] T012 [US2] Wire `DynamicToolbar` into `src/renderer/src/features/home/Home.tsx` passing active view handlers (Import CSV, New Apply, Sync Projects, Score Projects)
- [X] T013 [US2] Refactor and remove redundant floating action buttons from `src/renderer/src/features/home/Home.tsx`, `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`, and `src/renderer/src/features/projects/components/ProjectsView.tsx`

**Checkpoint**: User Story 2 is complete. Contextual dynamic action buttons appear on the right side across all views.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end verification, cleanup, and regression testing.

- [X] T014 Run full test suite across main and renderer (`npm test`) to ensure zero regressions
- [X] T015 Verify `quickstart.md` validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - establishes window maximization
- **User Story 1 (Phase 3)**: Depends on Phase 2 - delivers Pinned Navigation MVP
- **User Story 2 (Phase 4)**: Depends on Phase 3 - integrates Dynamic Toolbar into the new layout
- **Polish (Phase 5)**: Depends on User Story 1 and 2 completion

### Within Each User Story

- TDD tests (T004-T005, T009-T010) must be written first and verified to fail before implementing components
- Component updates before top-level view integration
- Clean up redundant UI elements after new toolbar wiring

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (T001) & Foundational (T002, T003)
2. Complete US1 tests (T004, T005) & implementation (T006, T007, T008)
3. Validate US1 independently: Window launches maximized, sidebar pinned with Home -> Projects -> CV Dashboard, no burger button on desktop.

### Incremental Delivery (User Story 2)
1. Complete US2 tests (T009, T010)
2. Implement DynamicToolbar (T011) and wire to layout (T012, T013)
3. Validate US2 independently: Contextual action buttons work seamlessly across Home, Projects, and CV Dashboard.
4. Run full test suite (T014, T015).
