# Tasks: Work Section AI Optimization

**Input**: Design documents from `/specs/006-work-ai-optimization/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ipc-groq-work.md, quickstart.md

**Tests**: Mandated by project constitution (TDD approach).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment setup and configuration verification

- [ ] T001 Verify Groq API environment variable handling and test setup in `src/main/controllers/GroqController.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend Groq controller extension and IPC channel registration

- [ ] T002 Write unit tests for `GroqController.analyzeWorkSection()` covering prompt execution, JSON array parsing, and field validation in `tests/main/controllers/GroqController.test.ts`
- [ ] T003 Implement `analyzeWorkSection()` in `src/main/controllers/GroqController.ts` using `qwen/qwen3.8-27b` model and specified prompt contract
- [ ] T004 Register `groq:analyze-work` IPC handler in `src/main/controllers/IpcController.ts`

**Checkpoint**: Backend controller and IPC contracts complete and verified.

---

## Phase 3: User Story 1 - Optimize Work Experience Descriptions with AI (Priority: P1) 🎯 MVP

**Goal**: Allow users to click "Analyze with AI" to send Work JSON data to Groq AI, receiving refined summaries and bullet points that update application state and persist automatically.

**Independent Test**: Populated work entries updated with polished phrasing, preserving key names, dates, company names, URLs, and numeric figures.

### Tests for User Story 1 (TDD) ⚠️

- [ ] T005 [P] [US1] Write unit tests for `analyzeWork()` store action in `src/renderer/tests/features/home/store/useResumeStore.work.test.ts`
- [ ] T006 [P] [US1] Write component tests for "Analyze with AI" button in `src/renderer/tests/features/home/WorkArticle.test.tsx`

### Implementation for User Story 1

- [ ] T007 [US1] Implement `analyzeWork()` store action in `src/renderer/src/store/useResumeStore.ts`
- [ ] T008 [US1] Add "Analyze with AI" button positioned immediately to the left of the Edit button in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - User Feedback and Error Recovery during AI Processing (Priority: P2)

**Goal**: Provide visual feedback (spinner, disabled state) during processing, and display error banners with a Retry option upon failure.

**Independent Test**: Triggering AI call displays loading state and disables duplicate clicks; simulated API failure shows error alert banner with Retry button.

### Tests for User Story 2 (TDD) ⚠️

- [ ] T009 [P] [US2] Write component tests for loading state and error banner rendering/retrying in `src/renderer/tests/features/home/WorkArticle.test.tsx`

### Implementation for User Story 2

- [ ] T010 [US2] Implement loading state (spinning `Loader2` icon), button disabled state, and error alert banner with retry trigger in `src/renderer/src/features/home/WorkArticle/WorkArticle.tsx`

**Checkpoint**: User Stories 1 AND 2 complete with complete error handling and loading feedback.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end verification and quality checks

- [ ] T011 [P] Run full Jest test suite `npm test` and TypeScript check `npx tsc -b tsconfig.json`
- [ ] T012 Run quickstart validation steps per `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion.
- **Polish (Phase 5)**: Depends on all user stories completed.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (Phase 1) and Foundational (Phase 2).
2. Complete User Story 1 (Phase 3).
3. Validate User Story 1 independently.

### Incremental Delivery

1. Setup + Foundational -> Backend ready.
2. User Story 1 -> MVP functional.
3. User Story 2 -> Loading feedback and error handling ready.
4. Polish -> Clean test suite and verification.
