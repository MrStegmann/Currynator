# Implementation Plan: CV Job Application Management

**Branch**: `008-cv-job-applications` | **Date**: 2026-09-13 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/008-cv-job-applications/spec.md)

**Input**: Feature specification from `/specs/008-cv-job-applications/spec.md`

## Summary

Implement a local-first CRUD workflow for **CV Job Applications** within Currynator. Backend persistence is handled isolated in `JobApplicationStorage.ts` (`job_applications.json`) and routed via `JobApplicationController.ts` in `IpcController.ts`. Frontend renderer uses Zustand state management (`useCvDashboardStore.ts`), a top-right floating action button (FAB) on `CvDashboardView.tsx`, a pre-hydrating `JobApplicationFormModal.tsx`, and updated `CvItemCard.tsx` with top-left status badges and fast-status progression logic.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js  
**Primary Dependencies**: React, Electron, Zustand, Zod, Lucide React, TailwindCSS  
**Storage**: Isolated local JSON storage (`job_applications.json` in `app.getPath('userData')`)  
**Testing**: Jest + React Testing Library  
**Target Platform**: Desktop Electron (Windows, macOS, Linux)  
**Project Type**: Desktop App (Electron MVC Main + React Feature-Based Renderer)  
**Performance Goals**: < 100ms response for status toggles, instant card rendering  
**Constraints**: Main process `main.ts` under 100 lines, TailwindCSS exclusively, strict Zod schema validation  
**Scale/Scope**: Local isolated storage for single desktop user  

## Constitution Check

*GATE: Passed. Complies with all core project principles.*

- [x] **Architecture**: Electron + TS (Main), React + TS (Renderer), Feature-Based UI, MVC Main.
- [x] **Main Process Constraint**: No changes to `main.ts` required; IPC channels registered in `IpcController.ts`.
- [x] **Data & Validation**: Zod schema in `src/main/shared/schema/jobApplicationSchema.ts`. Isolated JSON storage in `JobApplicationStorage.ts`. Zustand for frontend state.
- [x] **Testing Standards**: TDD with Jest.
- [x] **Styling**: TailwindCSS exclusively.

## Project Structure

### Documentation (this feature)

```text
specs/008-cv-job-applications/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 technical choices
├── data-model.md        # Data models & schemas
├── quickstart.md        # E2E manual & automated testing guide
└── contracts/
    └── job-application-ipc.md # IPC contract definition
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── models/
│   │   └── JobApplicationStorage.ts      # Persistent JSON storage handler
│   ├── controllers/
│   │   ├── JobApplicationController.ts   # Main process controller for job applications
│   │   └── IpcController.ts               # IPC handler registration
│   ├── shared/
│   │   └── schema/
│   │       └── jobApplicationSchema.ts   # Zod schema and types
│   └── preload.cts                       # ContextBridge API exposing jobApplication handlers
└── renderer/
    └── src/
        └── features/
            └── cv-dashboard/
                ├── components/
                │   ├── CvDashboardView.tsx       # Main dashboard view with FAB
                │   ├── CvItemCard.tsx             # Card component with status badge & fast-status action
                │   ├── JobApplicationFormModal.tsx# Form modal for Create/Edit
                │   └── CvDashboardEmptyState.tsx  # Empty state view
                ├── store/
                │   └── useCvDashboardStore.ts    # Zustand store hydrated from IPC
                ├── models/
                │   └── jobApplicationTypes.ts   # Types re-exported for renderer
                └── tests/
                    ├── CvDashboardView.test.tsx
                    └── CvItemCard.test.tsx
```

**Structure Decision**: Standard Electron MVC (Backend) + Feature-Based (Renderer) single desktop project layout.

## Complexity Tracking

> **No violations**. Standard architecture patterns maintained.
