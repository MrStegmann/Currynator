# Implementation Plan: GitHub Projects View Page

**Branch**: `011-github-projects-view` | **Date**: 2026-09-16 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/011-github-projects-view/spec.md)

**Input**: Feature specification from [`/specs/011-github-projects-view/spec.md`](file:///d:/Github/Currynator/specs/011-github-projects-view/spec.md)

## Summary

This feature creates a dedicated **Projects Page** in the application where users can view, browse, and sync their GitHub repositories. For first-time users without a configured token, it renders a 2-column setup interface (step-by-step guide + toggleable password input + Save button). When configured, token credentials are stored securely and repositories are fetched from GitHub, cached in local storage, and displayed in a 5-column responsive grid with 10-item pagination and a top-right floating refresh button.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js
**Primary Dependencies**: React 19, TailwindCSS, Lucide-React, Zustand
**Storage**: Local Storage (`currynator_github_token`, `currynator_github_repos`)
**Testing**: Jest + React Testing Library (TDD enforced)
**Target Platform**: Electron Desktop Application (Windows/macOS/Linux)
**Project Type**: Desktop application (React renderer feature)
**Performance Goals**: Projects view initial load from local storage cache < 300ms; smooth pagination transitions
**Constraints**: Follow project constitution (strictly TailwindCSS styling, feature-based architecture, Zustand global state, zero custom CSS)
**Scale/Scope**: 1 main view component (`ProjectsView.tsx`), 2 setup components (`TokenSetupForm.tsx`, `TokenGuide.tsx`), 2 list components (`ProjectCard.tsx`, `PaginationControls.tsx`), 1 floating button (`FloatingRefreshButton.tsx`), 1 store (`useProjectsStore.ts`), 1 service helper (`githubService.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Architecture & Frameworks**: React + TypeScript in feature-based renderer pattern.
- [x] **II. Main Process Constraints**: Main process files unchanged / strictly under lines limit.
- [x] **III. State & Data Management**: Zustand store (`useProjectsStore`); Local Storage persistence; encrypted token string.
- [x] **IV. Testing Standards**: Jest tests written before implementation (TDD).
- [x] **V. Styling Constraints**: Exclusively TailwindCSS styling (`xl:grid-cols-5`, `fixed top-20 right-6`, etc.); follows `DESIGN.md`.
- [x] **VI. Integrations & Tooling**: GitHub REST API integration.

**Status**: ALL CONSTITUTION GATES PASSED.

## Project Structure

### Documentation (this feature)

```text
specs/011-github-projects-view/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & state schema
├── quickstart.md        # Runnable validation scenarios
└── contracts/           # API interfaces & contracts
    └── github-projects-contract.md
```

### Source Code Layout

```text
src/
└── renderer/
    └── src/
        ├── shared/
        │   └── components/
        │       └── RightNavBar/
        │           └── RightNavBar.tsx               # [MODIFY] Add "Projects" link to navigation
        └── features/
            ├── cv-dashboard/
            │   └── store/
            │       └── useCvDashboardStore.ts        # [MODIFY] Add 'Projects' to ActiveView type
            ├── home/
            │   └── Home.tsx                          # [MODIFY] Render ProjectsView when activeView === 'Projects'
            └── projects/
                ├── components/
                │   ├── ProjectsView.tsx              # [NEW] Main page container
                │   ├── TokenSetupView.tsx            # [NEW] 2-column setup layout
                │   ├── TokenGuide.tsx                # [NEW] Left column step-by-step guide
                │   ├── TokenInputForm.tsx            # [NEW] Right column token input with show/hide toggle
                │   ├── ProjectCard.tsx               # [NEW] Individual repository card
                │   ├── ProjectsGrid.tsx              # [NEW] 5-column responsive grid container
                │   ├── PaginationControls.tsx        # [NEW] Simple pagination UI
                │   └── FloatingRefreshButton.tsx     # [NEW] Top-right floating refresh action button
                ├── store/
                │   └── useProjectsStore.ts           # [NEW] Zustand store for token & repositories
                ├── utils/
                │   ├── githubService.ts              # [NEW] GitHub REST API fetcher & error handling
                │   └── tokenEncryption.ts            # [NEW] Encrypt/decrypt storage helpers
                └── types/
                    └── projects.ts                   # [NEW] Type definitions for GitHub projects
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
