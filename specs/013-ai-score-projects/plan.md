# Implementation Plan: AI Score Projects

**Branch**: `013-ai-score-projects` | **Date**: 2026-09-18 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/013-ai-score-projects/spec.md)

**Input**: Feature specification from `/specs/013-ai-score-projects/spec.md`

## Summary

Implement AI-driven repository evaluation for project card items in Currynator. Each Project Card Item will feature a selection control (checkbox/toggle). A Floating Action Button (FAB) positioned beside the refresh button allows triggering AI scoring. If items are selected, only those items are sent to `GroqController.ts`. If 0 items are selected, a confirmation modal (`${n} projects will be Scored. Are you sure? Some Projects could be not scored due to limit rates of AI Agent.`) prompts the user to score all projects sequentially one-by-one. `GroqController.ts` sends project payloads to Groq API evaluating 7 quality criteria, returning a strict JSON response with a 1-100 score, section breakdown logs, and a list of bullet-point improvement suggestions (`improvements: string[]`), which are persisted and rendered in the UI.

## Technical Context

**Language/Version**: TypeScript 5.x (Electron Main + React Renderer)

**Primary Dependencies**: Groq SDK (`groq-sdk`), React 18, Zustand, Lucide React icons, TailwindCSS

**Storage**: LocalStorage (`currynator_project_scores`) for score persistence across sessions

**Testing**: Jest + React Testing Library

**Target Platform**: Electron Desktop Application (Windows)

**Project Type**: Electron Desktop Application

**Performance Goals**: Fast, non-blocking sequential processing of project repositories; responsive UI state transitions

**Constraints**: Strict JSON output validation from Groq API; main process `main.ts` line limit (<100 lines); strict adherence to `DESIGN.md` Tailwind tokens.

**Scale/Scope**: 1 to ~100+ user repositories synced from GitHub.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Frameworks**: Electron + React + TypeScript used. Pass.
- [x] **Architecture**: MVC for Electron main backend, Feature-based for renderer. Pass.
- [x] **Main Process Constraint**: `main.ts` kept under 100 lines. All handlers registered in `IpcController.ts`. Pass.
- [x] **State & Data**: Zustand used for global store, LocalStorage for persistence, Zod for schema validation. Pass.
- [x] **Testing**: Jest standard with TDD. Pass.
- [x] **Styling**: TailwindCSS exclusively using design system classes (`bg-surface-container`, `bg-primary`, `text-on-primary`), zero custom CSS files. Pass.
- [x] **Integrations**: Uses `groq-sdk` in `GroqController.ts`. Pass.

## Project Structure

### Documentation (this feature)

```text
specs/013-ai-score-projects/
├── plan.md              # Implementation plan
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data entities and state diagrams
├── quickstart.md        # Phase 1 verification and manual testing guide
└── contracts/           # Phase 1 IPC and Groq API contract definitions
    └── groq-scoring-contract.md
```

### Source Code (repository layout)

```text
src/
├── main/
│   ├── controllers/
│   │   ├── GroqController.ts      # [MODIFY] Add scoreProject method & system prompt with improvements list
│   │   └── IpcController.ts       # [MODIFY] Register groq:score-projects IPC handler
│   └── preload.cts                # [MODIFY] Expose groq.scoreProjects in context bridge
│
├── renderer/
│   └── src/
│       └── features/
│           └── projects/
│               ├── components/
│               │   ├── FloatingScoreButton.tsx   # [NEW] FAB positioned beside refresh button
│               │   ├── ScoreConfirmModal.tsx     # [NEW] Rate limit warning modal when 0 items selected
│               │   ├── ProjectCard.tsx           # [MODIFY] Add selection checkbox & AI score/improvements display
│               │   └── ProjectsView.tsx          # [MODIFY] Connect FAB, modal & selection handlers
│               ├── store/
│               │   └── useProjectsStore.ts       # [MODIFY] Add selection state, scoring actions & persistence
│               └── types/
│                   └── projects.ts               # [MODIFY] Add AIScoreResult & ScoreLogItem with improvements interface
```

**Structure Decision**: Integrated within existing `src/main/controllers` for main backend and `src/renderer/src/features/projects` for renderer UI.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations.*
