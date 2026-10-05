# Implementation Plan: Header, Sidebar, and Dynamic Toolbar

**Branch**: `015-header-sidebar-toolbar` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-header-sidebar-toolbar/spec.md`

## Summary

This feature updates the application window and navigation layout to launch maximized by default, pins the side navigation bar on desktop screens, removes the burger toggle button in the header at maximized window sizes, reorders the sidebar links strictly to **Home -> Projects -> CV Dashboard**, and implements a contextual **Dynamic Toolbar** on the right side with view-specific action buttons (`Import LinkedIn CSV` for Home, `New Apply` for CV Dashboard, and `Sync Projects` / `Score Projects` for Projects).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Electron, React 19, Lucide-React, TailwindCSS, Zustand  
**Storage**: Local Storage (Resume / CV Dashboard / Projects stores)  
**Testing**: Jest, React Testing Library, ts-jest  
**Target Platform**: Electron Desktop (Windows, macOS, Linux)  
**Project Type**: Desktop Application  
**Performance Goals**: Instant view switching and toolbar rendering with zero layout shift (<50ms)  
**Constraints**: Electron `main.ts` kept under 100 LOC, strict adherence to `DESIGN.md` and TailwindCSS utility classes, SOLID design principles, Test-Driven Development (TDD)  
**Scale/Scope**: 3 core views (Home, Projects, CV Dashboard), 1 dynamic toolbar component, 1 layout/header update, 1 main window initialization update  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Electron + TypeScript for main process, React + TypeScript for renderer
- [x] Feature-based directory architecture in renderer
- [x] Electron `main.ts` strictly under 100 LOC
- [x] Zustand used for state management
- [x] TailwindCSS exclusively for styling (no custom CSS)
- [x] TDD approach with Jest unit and integration tests

## Project Structure

### Documentation (this feature)

```text
specs/015-header-sidebar-toolbar/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── toolbar.contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── views/
│   │   └── WindowView.ts                # Add window.maximize() on creation
│   └── tests/
│       └── views/
│           └── WindowView.test.ts
└── renderer/
    ├── src/
    │   ├── shared/
    │   │   └── components/
    │   │       ├── Header/
    │   │       │   └── Header.tsx        # Add rightSlot and responsive burger visibility
    │   │       ├── RightNavBar/
    │   │       │   └── RightNavBar.tsx   # Reorder links to Home -> Projects -> CV Dashboard, pinned state
    │   │       └── DynamicToolbar/
    │   │           └── DynamicToolbar.tsx # Context-aware right toolbar buttons
    │   └── features/
    │       └── home/
    │           └── Home.tsx              # Wire DynamicToolbar into top-level layout
    └── tests/
        └── shared/
            └── components/
                ├── Header.test.tsx
                ├── RightNavBar.test.tsx
                └── DynamicToolbar.test.tsx
```

**Structure Decision**: Standard feature/shared component architecture matching the existing Currynator repository structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
