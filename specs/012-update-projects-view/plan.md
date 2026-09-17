# Implementation Plan: Projects Grid Pagination and Filtering

**Branch**: `012-update-projects-view` | **Date**: 2026-09-17 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/012-update-projects-view/spec.md)

**Input**: Feature specification from `/specs/012-update-projects-view/spec.md`

## Summary

Update the Projects view business logic and UI grid layout:
1. **GitHub Fetch Service**: Filter fetched GitHub repositories to include only valid codebase repositories (`size > 0 && language !== null`), excluding empty or documentation-only repositories.
2. **3x3 Grid Layout**: Change items per page to 9 and configure the grid layout to 3 columns x 3 rows (9 items total per page).
3. **Filter Bar & Dynamic Hydration**: Add a filter bar component above the grid with real-time text search by name, minimum stars dropdown filter, dynamic programming language dropdown populated from available project languages, and pagination auto-reset on filter changes.

## Technical Context

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: React, Zustand, Lucide-react, TailwindCSS
**Storage**: Local Storage (`currynator_github_token`, `currynator_github_repos`)
**Testing**: Jest, React Testing Library
**Target Platform**: Electron Desktop App (Renderer Process)
**Project Type**: Desktop Application UI (Feature-based React module)
**Performance Goals**: Instant UI filtering updates (<100ms) on user input change
**Constraints**: 3x3 desktop grid layout (9 items per page), strict codebase filtering
**Scale/Scope**: 1 feature module update (`src/renderer/src/features/projects`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Architecture & Frameworks**: Electron + React with TypeScript, Feature-Based architecture for renderer (`features/projects`), SOLID principles. -> PASS
- **II. Main Process Constraints**: Main process unchanged (`main.ts` untouched). -> PASS
- **III. State & Data Management**: Zustand used for store management (`useProjectsStore`), Local Storage for persistence, Zod for validation. -> PASS
- **IV. Testing Standards**: Test-Driven Development (TDD) using Jest. -> PASS
- **V. Styling Constraints**: TailwindCSS exclusively, adhering to `DESIGN.md` tokens. No custom CSS. -> PASS
- **VI. Integrations & Tooling**: N/A for Groq/Playwright in this view. -> PASS

## Project Structure

### Documentation (this feature)

```text
specs/012-update-projects-view/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── projects-ui-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
src/renderer/src/features/projects/
├── components/
│   ├── FloatingRefreshButton.tsx
│   ├── PaginationControls.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectFilterBar.tsx     # [NEW] Search, stars filter, dynamic language select
│   ├── ProjectsGrid.tsx         # [MODIFY] Updated to 3x3 layout (3 cols) & filter empty state
│   ├── ProjectsView.tsx         # [MODIFY] Wired with ProjectFilterBar and filtered pagination
│   ├── TokenGuide.tsx
│   ├── TokenInputForm.tsx
│   └── TokenSetupView.tsx
├── store/
│   └── useProjectsStore.ts      # [MODIFY] Add filter states, search/filter setters, itemsPerPage=9
├── types/
│   └── projects.ts              # [MODIFY] Updated repo and filter interfaces
└── utils/
    ├── githubService.ts         # [MODIFY] Filter non-codebase repositories (size > 0 && language !== null)
    └── tokenEncryption.ts

tests/renderer/features/projects/
├── githubService.test.ts        # [NEW/MODIFY] Test codebase filtering logic
├── useProjectsStore.test.ts     # [NEW/MODIFY] Test filter actions & pagination reset
└── ProjectFilterBar.test.tsx    # [NEW] Test filter UI interactions
```

**Structure Decision**: Single React feature module within `src/renderer/src/features/projects/` adhering to project's Feature-Based architecture.

## Complexity Tracking

> No constitution violations. Table left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
