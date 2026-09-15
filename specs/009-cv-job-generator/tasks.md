# Tasks: CV Job Application - CV Generator

**Input**: Design documents from `/specs/009-cv-job-generator/`

**Prerequisites**: [plan.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/plan.md) (required), [spec.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/spec.md) (required), [research.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/research.md), [data-model.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/data-model.md), [contracts/groq-cv-job-driven.json](file:///d:/Github/Currynator/specs/009-cv-job-generator/contracts/groq-cv-job-driven.json), [quickstart.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/quickstart.md)

**Tests**: Test-Driven Development (TDD) is MANDATORY per Currynator Constitution (Principle IV). Unit and component tests are included for all phases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [X] T001 Setup feature task structure and verify schema imports in `src/main/shared/schema/jobApplicationSchema.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schema and IPC type infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update Zod schema `JobApplicationStatusSchema` to include `'pending'` and default status to `'pending'`, add `match_score` and `tailored_json_resume` fields in `src/main/shared/schema/jobApplicationSchema.ts`
- [X] T003 [P] Write unit tests for updated `JobApplicationSchema` (pending status, match score, tailored CV object) in `src/main/tests/schema/jobApplicationSchema.test.ts`
- [X] T004 [P] Update IPC type definitions in `src/renderer/src/shared/types/electron.d.ts` and `src/main/preload.cts` for `groq:cv-job-driven` channel

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - AI-Driven Tailored CV Generation on Creation (Priority: P1) 🎯 MVP

**Goal**: Automatically analyze job details against master JSON Resume using Groq API upon application creation, generating non-hallucinated tailored JSON Resume & match score with default `pending` status.

**Independent Test**: Create a Job Application record, verify status defaults to `pending`, AI CV generation triggers via Groq API without mutating master JSON Resume, empty fields are omitted, and `match_score` and `tailored_json_resume` are saved in `job_applications.json`.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T005 [P] [US1] Write unit test for `GroqController.analyzeCvJobDriven` method in `tests/main/controllers/GroqController.test.ts`
- [X] T006 [P] [US1] Write unit test for `JobApplicationStorage.save` with `match_score` and `tailored_json_resume` in `src/main/tests/JobApplicationStorage.test.ts`

### Implementation for User Story 1

- [X] T007 [US1] Implement `GroqController.analyzeCvJobDriven` with zero-hallucination system prompt and recursive empty property stripper in `src/main/controllers/GroqController.ts`
- [X] T008 [US1] Register `groq:cv-job-driven` IPC handler in `src/main/controllers/IpcController.ts`
- [X] T009 [US1] Update `JobApplicationStorage.ts` to persist `match_score` and `tailored_json_resume` associated with Job Application ID in `src/main/models/JobApplicationStorage.ts`
- [X] T010 [US1] Update `useCvDashboardStore.ts` to invoke `groq:cv-job-driven` on application creation, storing `pending` status, match score, and tailored CV payload in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready!)

---

## Phase 4: User Story 2 - CV Card Interactive Controls & Status Display (Priority: P2)

**Goal**: Display `pending` status badge and interactive action buttons for Preview CV, Download CV, and Regenerate CV on each Job Application item card.

**Independent Test**: View application cards in list view, confirm `pending` status badge and match score display correctly, clicking Preview opens tailored CV modal, clicking Regenerate re-runs Groq AI alignment and updates score/tailored CV payload.

### Tests for User Story 2 ⚠️

- [X] T011 [P] [US2] Write component tests for `CvItemCard` status badge and Preview/Download/Regenerate buttons in `src/renderer/src/features/cv-dashboard/tests/CvItemCard.test.tsx`

### Implementation for User Story 2

- [X] T012 [P] [US2] Create `PreviewCvModal.tsx` component to view tailored JSON Resume sections in `src/renderer/src/features/cv-dashboard/components/PreviewCvModal.tsx`
- [X] T013 [US2] Update `CvItemCard.tsx` to render `pending` status badge, Match Score badge, and Preview CV, Download CV, Regenerate CV action buttons in `src/renderer/src/features/cv-dashboard/components/CvItemCard.tsx`
- [X] T014 [US2] Implement CV regeneration action handler in `src/renderer/src/features/cv-dashboard/store/useCvDashboardStore.ts` that re-triggers AI alignment and updates card state

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Full Page Job Application Creation View (Priority: P3)

**Goal**: Replace modal form overlay with a dedicated full-page form view featuring a top-left Back Arrow button for clean navigation.

**Independent Test**: Click "Add New Application" or edit application, confirm full-page view replaces list view and Back Arrow button (`← Back to Job Applications`) navigates seamlessly back to list view.

### Tests for User Story 3 ⚠️

- [X] T015 [P] [US3] Write component test for full-page `JobApplicationFormView` and Back Arrow navigation in `src/renderer/src/features/cv-dashboard/tests/JobApplicationFormView.test.tsx`

### Implementation for User Story 3

- [X] T016 [P] [US3] Create `JobApplicationFormView.tsx` full-page form workspace with top-left Back Arrow navigation button in `src/renderer/src/features/cv-dashboard/components/JobApplicationFormView.tsx`
- [X] T017 [US3] Update `CvDashboardView.tsx` to switch between list view and full-page `JobApplicationFormView` (replacing `JobApplicationFormModal`) in `src/renderer/src/features/cv-dashboard/components/CvDashboardView.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, testing, and final polish across all stories

- [X] T018 [P] Perform regression testing and verify complete Jest test suite passes with `npm test`
- [X] T019 Run quickstart validation scenarios defined in `specs/009-cv-job-generator/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities

- T003 & T004 in Foundational phase can run in parallel
- T005 & T006 in US1 can run in parallel (tests)
- T011 & T012 in US2 can run in parallel
- T015 & T016 in US3 can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 & Phase 2
2. Complete Phase 3 (US1)
3. **STOP and VALIDATE**: Verify AI CV generation, zero hallucination, pending status default, and storage isolation.

### Incremental Delivery
1. US1 → Core AI CV generation & pending status (MVP)
2. US2 → Card buttons & CV preview / regeneration
3. US3 → Full-page form view navigation with Back Arrow
