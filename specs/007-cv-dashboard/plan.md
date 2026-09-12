# Implementation Plan: CV Dashboard View

**Branch**: `007-cv-dashboard` | **Date**: 2026-09-12 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/007-cv-dashboard/spec.md)

**Input**: Feature specification from `/specs/007-cv-dashboard/spec.md`

## Summary

Implement a new **CV Dashboard** feature in the renderer process allowing users to view and manage application-focused CVs separately from their main profile resume. Key components include navigation integration in `RightNavBar`, a responsive 3-column / 1-column grid layout (breakpoint at 675px), empty dashboard state view with exact required guidance text, reusable CV item cards with action icons (View, Edit, Delete), and a custom deletion confirmation modal (no native browser alerts). Global state management is handled by a dedicated Zustand store (`useCvDashboardStore`) with mock data for testing.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js
**Primary Dependencies**: React 18, Zustand, Lucide React icons, TailwindCSS
**Storage**: Local Storage / Zustand Store
**Testing**: Jest + React Testing Library (`@testing-library/react`)
**Target Platform**: Electron Desktop App (Windows / macOS / Linux)
**Project Type**: Desktop App (Renderer React Frontend)
**Performance Goals**: Instant view switching (<100ms), smooth responsive breakpoint layout transitions at 675px
**Constraints**: TailwindCSS exclusively (no custom CSS), strict TDD with Jest, Zod schema validation for models, custom modal notification dialogs (no `window.alert`/`window.confirm`)
**Scale/Scope**: 1 new navbar link, 1 new feature module (`cv-dashboard`), 4 component files, 1 Zustand store, unit tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture & Frameworks**: Electron + TypeScript + React with Feature-based renderer architecture (`src/renderer/src/features/cv-dashboard/`).
- [x] **Main Process Constraints**: `main.ts` untouched (<100 LOC maintained).
- [x] **State & Data Management**: Zustand used for `useCvDashboardStore`; Zod used for schema validation (`ApplicationCvSchema`).
- [x] **Testing Standards**: TDD mandatory; unit & component tests using Jest.
- [x] **Styling Constraints**: TailwindCSS exclusively; zero custom CSS files created.

## Project Structure

### Documentation (this feature)

```text
specs/007-cv-dashboard/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── cv-dashboard-ui-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
└── renderer/
    └── src/
        ├── features/
        │   └── cv-dashboard/
        │       ├── components/
        │       │   ├── CvDashboardView.tsx
        │       │   ├── CvDashboardEmptyState.tsx
        │       │   ├── CvItemCard.tsx
        │       │   └── DeleteCvModal.tsx
        │       ├── models/
        │       │   └── applicationCvSchema.ts
        │       ├── store/
        │       │   └── useCvDashboardStore.ts
        │       └── tests/
        │           ├── CvDashboardView.test.tsx
        │           ├── CvItemCard.test.tsx
        │           └── useCvDashboardStore.test.ts
        └── shared/
            └── components/
                ├── Header/Header.tsx
                └── RightNavBar/RightNavBar.tsx
```

**Structure Decision**: Renderer feature module layout inside `src/renderer/src/features/cv-dashboard/` adhering to the project's feature-based architecture.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | Fully compliant with constitution guidelines |
