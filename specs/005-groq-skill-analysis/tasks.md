# Tasks: Groq API Skill Analysis & Categorization

**Input**: Design documents from `/specs/005-groq-skill-analysis/`

**Prerequisites**: [`plan.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/plan.md), [`spec.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/spec.md), [`research.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/research.md), [`data-model.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/data-model.md), [`contracts/groq-ipc-contract.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/contracts/groq-ipc-contract.md)

**Tests**: TDD approach is mandatory per project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment and project setup for Groq SDK integration

- [X] T001 Configure `GROQ_API_KEY=` template variable in [.env.example](file:///d:/Github/Currynator/.env.example)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Groq controller and IPC backend routing that MUST be complete before UI integration

- [X] T002 [P] Create unit test suite for Groq controller and JSON response parser in [tests/main/controllers/GroqController.test.ts](file:///d:/Github/Currynator/tests/main/controllers/GroqController.test.ts)
- [X] T003 [P] Implement `GroqController` with SDK prompt execution and JSON parsing/sanitization in [src/main/controllers/GroqController.ts](file:///d:/Github/Currynator/src/main/controllers/GroqController.ts)
- [X] T004 Register `groq:analyze-skills` IPC channel handler in [src/main/controllers/IpcController.ts](file:///d:/Github/Currynator/src/main/controllers/IpcController.ts)

---

## Phase 3: User Story 1 - Automatic Skill Categorization via Groq API (Priority: P1) 🎯 MVP

**Goal**: Automatically process imported LinkedIn CSV skills via Groq API into tech stack categories and update the resume store.

**Independent Test**: Send array of raw skill strings via `groq:analyze-skills` IPC channel and verify categorized `SkillCategory[]` output matching JSON Resume format.

### Implementation for User Story 1

- [X] T005 [P] [US1] Add `analyzeSkills` action to Zustand store in [src/renderer/src/store/useResumeStore.ts](file:///d:/Github/Currynator/src/renderer/src/store/useResumeStore.ts)
- [X] T006 [US1] Integrate `groq:analyze-skills` invocation into the skills import workflow in [src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx](file:///d:/Github/Currynator/src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx)

**Checkpoint**: At this point, User Story 1 is fully functional and skill categorization operates end-to-end.

---

## Phase 4: User Story 2 - Non-Elemental Category Visual Indicator & Tooltip (Priority: P2)

**Goal**: Render `Skills no necesarias/prescindibles` floating label with steady hover tooltip in Spanish for `Non-Elemental` skills.

**Independent Test**: Render `NonElementalLabel` component and verify floating label text rendering and hover tooltip display/hide behavior.

### Implementation for User Story 2

- [X] T007 [P] [US2] Create unit test for floating label and hover tooltip interaction in [tests/renderer/components/NonElementalLabel.test.tsx](file:///d:/Github/Currynator/tests/renderer/components/NonElementalLabel.test.tsx)
- [X] T008 [P] [US2] Implement `NonElementalLabel` component with TailwindCSS styling and hover tooltip in [src/renderer/src/features/home/SkillsArticle/NonElementalLabel.tsx](file:///d:/Github/Currynator/src/renderer/src/features/home/SkillsArticle/NonElementalLabel.tsx)
- [X] T009 [US2] Integrate `NonElementalLabel` into `SkillsArticle` for `Non-Elemental` skill categories in [src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx](file:///d:/Github/Currynator/src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx)

**Checkpoint**: At this point, User Stories 1 AND 2 are both fully functional.

---

## Phase 5: User Story 3 - Secure API Configuration & Graceful Error Handling (Priority: P3)

**Goal**: Ensure API key security and present clear user-facing error feedback on network failures or malformed responses without crashing.

**Independent Test**: Simulate missing `GROQ_API_KEY` or API timeout to verify error handling and UI fallback presentation.

### Implementation for User Story 3

- [X] T010 [P] [US3] Add API key validation and timeout error tests in [tests/main/controllers/GroqController.test.ts](file:///d:/Github/Currynator/tests/main/controllers/GroqController.test.ts)
- [X] T011 [US3] Implement UI error notification and fallback handling when skill categorization fails in [src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx](file:///d:/Github/Currynator/src/renderer/src/features/home/SkillsArticle/SkillsArticle.tsx)

**Checkpoint**: All user stories are functional, resilient, and fully tested.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 [P] Execute full test suite `npm test` to ensure zero regressions
- [X] T013 Validate end-to-end feature behavior against [quickstart.md](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS User Stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2).
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) and `SkillsArticle` layout.
- **User Story 3 (Phase 5)**: Depends on `GroqController` and `SkillsArticle` integration.
- **Polish (Phase 6)**: Depends on all User Stories complete.

### Parallel Opportunities

- T002 and T003 can run in parallel during Foundational phase.
- T005 and T007 / T008 can run in parallel across US1 and US2 once Foundational completes.
- T012 can run asynchronously during polish.
