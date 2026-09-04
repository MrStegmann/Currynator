# Tasks: Project Initialization (Electron + React)

**Input**: Design documents from `specs/001-init-electron-react/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ipc.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize npm package at root and install Electron + TypeScript devDependencies in `package.json`
- [x] T002 Initialize Vite React + TypeScript project in `src/renderer/` directory
- [x] T003 [P] Install Constitution stack (TailwindCSS, Zustand, Zod, Groq, Playwright, Jest) in `package.json`
- [x] T004 [P] Configure TypeScript `tsconfig.json` for main and `src/renderer/tsconfig.json` for renderer
- [x] T005 [P] Configure Vite build in `vite.config.ts` to output to `dist/renderer`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup `src/main/main.ts` application entry point (strictly < 100 lines) per MVC constraint
- [x] T007 Setup `src/main/preload.ts` context bridge script

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Application Launch and Verification (Priority: P1) 🎯 MVP

**Goal**: Launch an application window displaying a greeting to verify Electron + React integration.

**Independent Test**: App starts up and the window shows "Hello, World, I'm Currynator" in less than 3 seconds with 0 console errors.

### Tests for User Story 1 ⚠️
> **NOTE: TDD is mandatory per Constitution. Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Write Jest tests for React greeting component in `src/renderer/features/greeting/__tests__/Greeting.test.tsx`

### Implementation for User Story 1

- [x] T009 [P] [US1] Configure Tailwind in `src/renderer/index.css`, `tailwind.config.js`, and `postcss.config.js`
- [x] T010 [US1] Create React Greeting component displaying the required text in `src/renderer/features/greeting/Greeting.tsx`
- [x] T011 [US1] Setup React root in `src/renderer/App.tsx` and `src/renderer/index.tsx` to render Greeting component
- [x] T012 [US1] Implement BrowserWindow factory in `src/main/views/WindowView.ts` (MVC Pattern)
- [x] T013 [US1] Update `src/main/main.ts` to instantiate `WindowView` when the app is ready

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The basic Electron+React bridge is complete.

---

## Phase 4: User Story 2 - IPC Connection Test (Priority: P1)

**Goal**: Renderer process successfully communicates with the main process via IPC on startup.

**Independent Test**: The renderer invokes a ping message to the main process and successfully displays the pong response on the screen below the greeting.

### Tests for User Story 2 ⚠️

- [x] T014 [P] [US2] Write unit tests for IPC ping handler in `src/main/controllers/__tests__/IpcController.test.ts`

### Implementation for User Story 2

- [x] T015 [US2] Define `ping` method contract in `src/main/preload.ts` context bridge
- [x] T016 [US2] Implement IPC ping handler in `src/main/controllers/IpcController.ts`
- [x] T017 [US2] Register IPC handler in `src/main/main.ts`
- [x] T018 [US2] Update `src/renderer/features/greeting/Greeting.tsx` to invoke `window.electron.ping()` on mount and display the response

**Checkpoint**: User Stories 1 AND 2 should both work independently. The IPC bridge is fully verified.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Update `package.json` with startup scripts (e.g., `npm run dev`) that concurrently run Vite and Electron
- [x] T020 Code review verification: Ensure `src/main/main.ts` remains strictly under 100 lines
- [x] T021 Run `quickstart.md` manual validation to ensure 0 console errors and < 3s startup time

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential priority order (P1 → P1) ensures React foundation is ready before IPC integration.
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1**: Depends on Foundational (Phase 2).
- **User Story 2**: Depends on User Story 1 (needs the React UI to display the ping response).

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution TDD Rule).
- Backend (Main) IPC controllers before Frontend (Renderer) integration.

### Parallel Opportunities

- Tasks T003, T004, T005 in Setup can run in parallel.
- Jest tests for React UI and IPC controllers can be authored concurrently with environment setup.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (TDD approach)
4. **STOP and VALIDATE**: Verify UI renders "Hello, World, I'm Currynator"
5. Continue to User Story 2 to finish the foundational communication bridge.
