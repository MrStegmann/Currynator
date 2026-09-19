# Implementation Plan: Project Score Visual & Improvement Tips

**Branch**: `014-project-score-breakdown` | **Date**: 2026-09-19 | **Spec**: [`spec.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/spec.md)

**Input**: Feature specification from [`specs/014-project-score-breakdown/spec.md`](file:///d:/Github/Currynator/specs/014-project-score-breakdown/spec.md)

## Summary

Update `ProjectCard.tsx` layout to position the total score badge prominently in the top-right corner of each card as an interactive element. Clicking or keyboard-activating the score badge opens a newly created `ProjectScoreModal.tsx` displaying the complete section-by-section score breakdown and actionable repository improvement tips. The modal will enforce keyboard accessibility (`Enter`/`Space` activation, `Escape` key dismissal, focus trap, and ARIA attributes) and consistent TailwindCSS dark/light theme styling.

## Technical Context

**Language/Version**: TypeScript 5+ / React 18 / Electron

**Primary Dependencies**: React, TailwindCSS, Lucide React icons, Zustand

**Storage**: LocalStorage / Zustand project store (`useProjectsStore.ts`)

**Testing**: Jest, React Testing Library (`@testing-library/react`)

**Target Platform**: Electron Desktop App (Windows, macOS, Linux)

**Project Type**: desktop-app (Renderer React components in Feature-Based structure)

**Performance Goals**: Score modal render and open transition < 100ms

**Constraints**: TailwindCSS exclusively (no custom CSS files), WCAG 2.1 AA accessibility (dialog role, aria attributes, keyboard trap, escape close)

**Scale/Scope**: Projects grid cards and modal in `src/renderer/src/features/projects/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture & Frameworks**: React + TypeScript under feature-based architecture pattern in `src/renderer/src/features/projects/`.
- [x] **Main Process Constraints**: No main process changes required (`main.ts` untouched).
- [x] **State & Data Management**: Reuses existing Zustand `useProjectsStore` score state and domain types in `types/projects.ts`.
- [x] **Testing Standards**: TDD approach using Jest and React Testing Library before code modifications.
- [x] **Styling Constraints**: Uses TailwindCSS exclusively, following `DESIGN.md` guidelines.
- [x] **Integrations & Tooling**: N/A for UI display modal layer.

*Gate Status*: PASSED (Zero constitution violations).

## Project Structure

### Documentation (this feature)

```text
specs/014-project-score-breakdown/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model & state specifications
├── quickstart.md        # Phase 1 quickstart & manual validation scenarios
└── contracts/
    └── project-score-modal.md # Component interface & behavior contract
```

### Source Code Layout

```text
src/renderer/src/features/projects/
├── components/
│   ├── ProjectCard.tsx             # [MODIFY] Update top-right score badge layout & click handler
│   ├── ProjectScoreModal.tsx       # [NEW] Modal displaying breakdown logs & improvement tips
│   ├── ProjectsGrid.tsx            # [MODIFY] Pass modal state / handlers to ProjectCard grid items
│   └── ProjectsView.tsx            # [MODIFY] Render ProjectScoreModal and manage modal open state
├── tests/
│   ├── ProjectCard.test.tsx        # [MODIFY] Add tests for top-right score badge click & keyboard events
│   └── ProjectScoreModal.test.tsx  # [NEW] Add unit tests for modal render, accessibility, focus trap
└── types/
    └── projects.ts                 # Domain interfaces (AIScoreResult, ScoreLogItem)
```

**Structure Decision**: Standard feature-based structure under `src/renderer/src/features/projects/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. Section intentionally empty.*
