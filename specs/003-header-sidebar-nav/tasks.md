---
description: "Task list for feature implementation"
---

# Tasks: Header, Sidebar Navigation, and Home Page Resume Editor

**Input**: Design documents from `/specs/003-header-sidebar-nav/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify/install required UI and form dependencies (lucide-react, react-hook-form, @hookform/resolvers, zod, zustand) in `package.json`
- [x] T002 [P] Create folder structure in `src/renderer/src/features/home` and `src/renderer/src/shared/components`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Implement Zod schemas in `src/renderer/src/store/resumeSchema.ts` based on data-model.md
- [x] T004 Setup Zustand store `useResumeStore` with initial data structure in `src/renderer/src/store/useResumeStore.ts`
- [x] T005 [P] Setup main process IPC handlers for Local Storage load/save in `src/main/controllers/ResumeController.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Sidebar Navigation (Priority: P1) 🎯 MVP

**Goal**: Toggle the sidebar navigation to access different parts of the application

**Independent Test**: Click the hamburger menu and observe the sidebar appearing and disappearing.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create Header component with hamburger icon in `src/renderer/src/shared/components/Header/Header.tsx`
- [x] T007 [P] [US1] Create RightNavBar component with slide toggle support in `src/renderer/src/shared/components/RightNavBar/RightNavBar.tsx`
- [x] T008 [US1] Create Home view layout integrating Header and RightNavBar in `src/renderer/src/features/home/Home.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Current Context (Priority: P1)

**Goal**: Display current view name in header and highlight active link in sidebar

**Independent Test**: Navigate to Home view and observe header title and sidebar link styling.

### Implementation for User Story 2

- [x] T009 [P] [US2] Update Header to display "Home" title based on current view in `src/renderer/src/shared/components/Header/Header.tsx`
- [x] T010 [P] [US2] Update RightNavBar to highlight "Home" active link in `src/renderer/src/shared/components/RightNavBar/RightNavBar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Resume Sections on Home Page (Priority: P1)

**Goal**: See all 7 sections of JSON resume on Home page

**Independent Test**: Verify that all 7 sections exist, each with an h2 heading displaying current JSON resume data.

### Implementation for User Story 3

- [x] T011 [P] [US3] Create BasicsArticle component (read-only view) in `src/renderer/src/features/home/BasicsArticle/BasicsArticle.tsx`
- [x] T012 [P] [US3] Create WorkArticle component (read-only view) in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`
- [x] T013 [P] [US3] Create EducationArticle component (read-only view) in `src/renderer/src/features/home/EducationArticle/EducationArticle.tsx`
- [x] T014 [P] [US3] Create CertificatesArticle component (read-only view) in `src/renderer/src/features/home/CertificatesArticle/CertificatesArticle.tsx`
- [x] T015 [P] [US3] Create SkillsArticle component (read-only view) in `src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx`
- [x] T016 [P] [US3] Create LanguagesArticle component (read-only view) in `src/renderer/src/features/home/LanguagesArticle/LanguagesArticle.tsx`
- [x] T017 [P] [US3] Create ReferencesArticle component (read-only view) in `src/renderer/src/features/home/ReferencesArticle/ReferencesArticle.tsx`
- [x] T018 [US3] Render all 7 articles within the main layout in `src/renderer/src/features/home/Home.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Edit Section Mode (Priority: P1)

**Goal**: Toggle an edit mode for each individual section using a pencil icon

**Independent Test**: Click pencil icon on any section and verify only that section switches to edit mode.

### Implementation for User Story 4

- [x] T019 [P] [US4] Add local edit toggle state and pencil icon to BasicsArticle in `src/renderer/src/features/home/BasicsArticle/BasicsArticle.tsx`
- [x] T020 [P] [US4] Add local edit toggle state and pencil icon to WorkArticle in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`
- [x] T021 [P] [US4] Add local edit toggle state and pencil icon to EducationArticle in `src/renderer/src/features/home/EducationArticle/EducationArticle.tsx`
- [x] T022 [P] [US4] Add local edit toggle state and pencil icon to CertificatesArticle in `src/renderer/src/features/home/CertificatesArticle/CertificatesArticle.tsx`
- [x] T023 [P] [US4] Add local edit toggle state and pencil icon to SkillsArticle in `src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx`
- [x] T024 [P] [US4] Add local edit toggle state and pencil icon to LanguagesArticle in `src/renderer/src/features/home/LanguagesArticle/LanguagesArticle.tsx`
- [x] T025 [P] [US4] Add local edit toggle state and pencil icon to ReferencesArticle in `src/renderer/src/features/home/ReferencesArticle/ReferencesArticle.tsx`

---

## Phase 7: User Story 6 - Edit Basics Section (Priority: P1)

**Goal**: Edit Basic information with mandatory field validation

**Independent Test**: Attempt to edit Basics section and save with missing mandatory fields (should fail). Edit and save with valid data (should succeed).

### Implementation for User Story 6

- [x] T026 [US6] Add react-hook-form inputs, validation, and Save button to BasicsArticle edit mode in `src/renderer/src/features/home/BasicsArticle/BasicsArticle.tsx`
- [x] T027 [US6] Wire BasicsArticle form save action to `useResumeStore` update method in `src/renderer/src/features/home/BasicsArticle/BasicsArticle.tsx`

---

## Phase 8: User Story 5 - Add/Update/Delete Items in Array Sections (Priority: P2)

**Goal**: Add, update, delete entries in array-based sections with modal forms

**Independent Test**: Add, modify, and delete a job in the Work section.

### Implementation for User Story 5

- [x] T028 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for WorkArticle in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`
- [x] T029 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for EducationArticle in `src/renderer/src/features/home/EducationArticle/EducationArticle.tsx`
- [x] T030 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for CertificatesArticle in `src/renderer/src/features/home/CertificatesArticle/CertificatesArticle.tsx`
- [x] T031 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for SkillsArticle in `src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx`
- [x] T032 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for LanguagesArticle in `src/renderer/src/features/home/LanguagesArticle/LanguagesArticle.tsx`
- [x] T033 [P] [US5] Implement Add/Edit Modal (react-hook-form) and CRUD methods for ReferencesArticle in `src/renderer/src/features/home/ReferencesArticle/ReferencesArticle.tsx`

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Refine UI spacing, typography, and Tailwind styling per DESIGN.md constraints across all articles
- [ ] T035 Review and verify integration of IPC save/load logic with `useResumeStore`
- [ ] T036 Run quickstart.md validation manually to ensure end-to-end functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion

### Parallel Opportunities

- Article components for displaying data (US3), toggling edit mode (US4), and implementing modals (US5) can be built in parallel.
- IPC integration in the main process can be worked on alongside Zustand store implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test independently
3. Add US2 → Test independently
4. Add US3 (Display) → Add US4 (Edit Mode) → Add US6 (Edit Basics) → Add US5 (Array Editing)
5. Each story adds value without breaking previous stories
