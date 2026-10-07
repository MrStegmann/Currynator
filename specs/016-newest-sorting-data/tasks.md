# Tasks: Newest-First Chronological Data Sorting & GitHub Project Keyword Matching

**Input**: Design documents from `specs/016-newest-sorting-data/`
**Prerequisites**: [plan.md](file:///d:/Github/Currynator/specs/016-newest-sorting-data/plan.md), [spec.md](file:///d:/Github/Currynator/specs/016-newest-sorting-data/spec.md), [research.md](file:///d:/Github/Currynator/specs/016-newest-sorting-data/research.md), [data-model.md](file:///d:/Github/Currynator/specs/016-newest-sorting-data/data-model.md), [contracts/](file:///d:/Github/Currynator/specs/016-newest-sorting-data/contracts/)

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared schemas for sorting and keyword matching.

- [X] T001 Setup types and schemas for date sorting and project keyword matching in `src/renderer/src/shared/types/sorting.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date comparison and sorting utilities that MUST be completed before story implementations.

- [X] T002 [P] Write unit tests for universal date comparator and sorting functions in `src/renderer/src/shared/utils/tests/dateSorting.test.ts`
- [X] T003 Implement universal date comparator and sorting functions in `src/renderer/src/shared/utils/dateSorting.ts`

**Checkpoint**: Universal date sorting utility is verified and available for all stores, UI articles, and CV generation pipelines.

---

## Phase 3: User Story 1 - Universal Chronological Sorting Across All Data (Priority: P1) 🎯 MVP

**Goal**: Automatically sort every data category (work, education, certificates, projects) in descending chronological order (newest first) by default in stores and UI views.

**Independent Test**: Add/edit entries with various dates; verify rendered order and store state always place newest/current items first with undated items at the end.

### Tests for User Story 1
- [X] T004 [P] [US1] Write unit tests for store chronological auto-sorting in `src/renderer/tests/features/home/store/useResumeStore.sorting.test.ts`

### Implementation for User Story 1
- [X] T005 [US1] Update `useResumeStore.ts` to automatically apply newest-first sorting when adding, updating, or loading resume sections in `src/renderer/src/store/useResumeStore.ts`
- [X] T006 [P] [US1] Update `WorkArticle.tsx` to ensure work experiences are displayed in newest-first order in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`
- [X] T007 [P] [US1] Update `EducationArticle.tsx` to ensure education entries are displayed in newest-first order in `src/renderer/src/features/home/EducationArticle/EducationArticle.tsx`
- [X] T008 [P] [US1] Update `CertificatesArticle.tsx` to ensure certificates are displayed in newest-first order in `src/renderer/src/features/home/CertificatesArticle/CertificatesArticle.tsx`

**Checkpoint**: User Story 1 complete — all resume data categories display in newest-first order across the application.

---

## Phase 4: User Story 2 - Chronologically Ordered CV Generation (Priority: P1)

**Goal**: Ensure generated and tailored CVs strictly enforce newest-first descending chronological ordering across all resume sections.

**Independent Test**: Generate a tailored CV from unsorted master resume data; verify preview modal and stored tailored JSON resume render work, education, certificates, and projects sorted newest first.

### Tests for User Story 2
- [X] T009 [P] [US2] Write tests for CV generation chronological sorting in `src/renderer/src/features/cv-dashboard/tests/cvChronologicalSorting.test.ts`

### Implementation for User Story 2
- [X] T010 [US2] Update `useCvDashboardStore.ts` and `GroqController.ts` to enforce newest-first sorting on all tailored CV sections upon generation in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts` and `src/main/controllers/GroqController.ts`
- [X] T011 [US2] Update `PreviewCvModal.tsx` to guarantee newest-first rendered order for work, education, certificates, and projects in `src/renderer/src/features/cv-dashboard/components/PreviewCvModal.tsx`

**Checkpoint**: User Story 2 complete — generated CVs and CV preview modals strictly adhere to chronological sorting.

---

## Phase 5: User Story 3 - Dynamic GitHub Project Fetching and Keyword Preselection (Priority: P2)

**Goal**: Retrieve GitHub repositories dynamically during CV generation and automatically preselect projects matching target job language keywords.

**Independent Test**: Provide job requirements with technical keywords (e.g., "TypeScript", "React", "Python"); verify projectMatcher extracts keywords and preselects matching GitHub repositories during CV creation.

### Tests for User Story 3
- [X] T012 [P] [US3] Write unit tests for language keyword extraction and project matching in `src/renderer/src/features/projects/tests/projectMatcher.test.ts`

### Implementation for User Story 3
- [X] T013 [US3] Implement `extractLanguageKeywords` and `matchProjectsByKeywords` utility in `src/renderer/src/features/projects/utils/projectMatcher.ts`
- [X] T014 [US3] Update `useCvDashboardStore.ts` to integrate GitHub project fetching and keyword preselection during CV creation in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`
- [X] T015 [US3] Update `JobApplicationFormView.tsx` and `JobApplicationFormModal.tsx` with project selection step/preselection indicators matching language keywords in `src/renderer/src/features/cv-dashboard/components/JobApplicationFormView.tsx`

**Checkpoint**: User Story 3 complete — GitHub repositories are fetched and automatically preselected based on matched language keywords.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full validation, regression testing, and verification.

- [X] T016 [P] Run all test suites across sorting, matcher, store, and UI components
- [X] T017 Execute manual validation workflow per `specs/016-newest-sorting-data/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks US1, US2, US3.
- **Phase 3 (User Story 1)**: Depends on Phase 2.
- **Phase 4 (User Story 2)**: Depends on Phase 2 & Phase 3.
- **Phase 5 (User Story 3)**: Depends on Phase 2.
- **Phase 6 (Polish)**: Depends on completion of all user stories.

### Parallel Opportunities
- T002 can be written before/in parallel with T001.
- T006, T007, T008 can be executed in parallel after T005.
- T009 can be written in parallel with T004/T012.
- T012 can be written in parallel with earlier test tasks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (T001) + Foundational (T002, T003).
2. Implement User Story 1 (T004-T008).
3. Validate universal sorting on the Home view.

### Incremental Delivery
1. Foundation & US1: Universal chronological sorting active across all home sections.
2. US2: CV generation and preview modals enforce descending chronological order.
3. US3: GitHub project dynamic retrieval and keyword-based preselection.
4. Polish: Test suite validation and end-to-end verification.
