# Implementation Plan: Work Section AI Optimization

**Branch**: `006-work-ai-optimization` | **Date**: 2026-09-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-work-ai-optimization/spec.md`

## Summary

Add an "Analyze with AI" action button to the Work section header. When triggered, the system serializes the Work section JSON array, passes it via IPC (`groq:analyze-work`) to `GroqController.analyzeWorkSection()`, where the Groq SDK (`qwen/qwen3.8-27b`) refines professional vocabulary and bullet-point phrasing while strictly preserving dates, URLs, company names, and metrics. The refined response is validated against the Work schema contract, updated in Zustand store state, and persisted to storage.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js
**Primary Dependencies**: React 18, Zustand, Electron IPC, Groq SDK, Lucide React icons, Zod
**Storage**: Local Storage (via `ResumeStorage`) adhering to JSON Resume format
**Testing**: Jest + `@testing-library/react` (TDD mandatory)
**Target Platform**: Electron Desktop App (Windows/macOS/Linux)
**Project Type**: Desktop application (Electron + React)
**Performance Goals**: AI section analysis completes in < 5 seconds; UI updates within 100ms
**Constraints**: TailwindCSS exclusively (custom CSS prohibited); strictly adhere to JSON Resume schema

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Electron + TypeScript for main & renderer processes (Pass)
- [x] Feature-based architecture in renderer & MVC in Electron backend (Pass)
- [x] Zustand for state management & Local Storage for persistence (Pass)
- [x] Strict JSON Resume format compliance (Pass)
- [x] Mandated TDD with Jest tests written before code (Pass)
- [x] Exclusive use of TailwindCSS (Pass)
- [x] Integration with Groq SDK (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/006-work-ai-optimization/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 decisions
├── data-model.md        # Data model & schema contracts
├── quickstart.md        # Validation guide
└── contracts/
    └── ipc-groq-work.md # IPC channel contract
```

### Source Code

```text
src/
├── main/
│   ├── controllers/
│   │   ├── GroqController.ts      # [MODIFY] Add analyzeWorkSection()
│   │   └── IpcController.ts       # [MODIFY] Register groq:analyze-work handler
├── renderer/src/
│   ├── features/home/WorkArticle/
│   │   └── WorkArticle.tsx        # [MODIFY] Add "Analyze with AI" button & loading/error UI
│   └── store/
│       └── useResumeStore.ts      # [MODIFY] Add analyzeWork() store action

tests/
├── main/controllers/
│   └── GroqController.test.ts     # [MODIFY] Unit tests for analyzeWorkSection()
└── renderer/
    └── features/home/
        └── WorkArticle.test.tsx   # [NEW/MODIFY] Tests for AI button & loading states
```

**Structure Decision**: Standard Electron MVC main process + React Feature-Based renderer.

## Complexity Tracking

*No constitution violations.*
