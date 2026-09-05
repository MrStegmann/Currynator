# Implementation Plan: App Initialization & Dashboard

**Branch**: `002-app-initialization` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-app-initialization/spec.md`

## Summary

Implement the initial application loading state ("Greetings" window) that checks for existing user data via IPC. If no data exists, a multi-step onboarding form for the JSON Resume "basics" is shown. Upon completion or if data exists, users are routed to the Home dashboard, featuring a minimal header, a sidebar navigation menu, and modular sections for viewing and editing JSON Resume data.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: Electron, React, Zustand, Zod, TailwindCSS

**Storage**: Local Storage (Electron backend storage mechanism adhering to JSON Resume)

**Testing**: Jest (TDD mandatory)

**Target Platform**: Desktop app (Electron)

**Project Type**: desktop-app

**Performance Goals**: Fast IPC communication, instantaneous UI response

**Constraints**: main.ts < 100 lines, No custom CSS (Tailwind only)

**Scale/Scope**: App initialization and Dashboard for JSON Resume management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] MUST use Electron with TypeScript for both main and src/renderer processes.
- [x] MUST use React with TypeScript for the src/renderer interface.
- [x] MUST use a Feature-Based architecture pattern for the src/renderer.
- [x] MUST use an MVC (Model-View-Controller) architecture pattern for the Electron backend.
- [x] MUST use SOLID principles for code organization and structure.
- [x] The Electron `main.ts` file MUST be strictly kept below 100 lines of code.
- [x] MUST use Zustand for global state management.
- [x] MUST use Local Storage for data persistence.
- [x] MUST adhere to the JSON Resume format for user data storage.
- [x] MUST use Zod for all data validation.
- [x] Test-Driven Development (TDD) is MANDATORY.
- [x] MUST use Jest as the primary testing framework.
- [x] MUST use TailwindCSS exclusively for all styling.

## Project Structure

### Documentation (this feature)

```text
specs/002-app-initialization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ipc.md
└── tasks.md             # Phase 2 output (future)
```

### Source Code (repository root)

```text
src/main/
├── src/
│   ├── models/
│   │   └── ResumeStorage.ts
│   ├── controllers/
│   │   └── IpcController.ts
│   └── main.ts
└── tests/

src/renderer/
├── src/
│   ├── features/
│   │   ├── initialization/
│   │   │   ├── components/
│   │   │   │   ├── GreetingsView.tsx
│   │   │   │   └── OnboardingForm.tsx
│   │   │   └── store/
│   │   │       └── initStore.ts
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── Sidebar.tsx
│   │       │   └── ResumeSection.tsx
│   │       └── store/
│   │           └── dashboardStore.ts
│   └── shared/
│       ├── schema/
│       │   └── resumeSchema.ts
│       └── ipc/
│           └── ipcClient.ts
└── tests/
```

**Structure Decision**: Selected a clear separation between `src/main` (MVC pattern) and `src/renderer` (Feature-Based pattern) to strictly follow the constitution.
