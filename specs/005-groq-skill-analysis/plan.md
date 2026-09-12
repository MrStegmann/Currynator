# Implementation Plan: Groq API Skill Analysis & Categorization

**Branch**: `005-groq-skill-analysis` | **Date**: 2026-09-12 | **Spec**: [`spec.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/spec.md)

**Input**: Feature specification from [`specs/005-groq-skill-analysis/spec.md`](file:///d:/Github/Currynator/specs/005-groq-skill-analysis/spec.md)

## Summary

Implement the Groq API integration for analyzing and categorizing imported LinkedIn skills. A dedicated `GroqSkillController` in the Electron Main process communicates with the Groq SDK using a structured prompt and environment-configured `GROQ_API_KEY`. Categorized skill outputs are returned to the Renderer, stored in Zustand, and displayed in the Home View. Skills categorized under `Non-Elemental` render an adjacent floating label (`Skills no necesarias/prescindibles`) with an interactive hover tooltip explaining non-elemental skills in Spanish.

## Technical Context

**Language/Version**: TypeScript 5.9+, Node.js (Electron 44+, React 19)

**Primary Dependencies**: `groq-sdk` (v1.6.0), React 19, Zustand 5, Zod 4

**Storage**: Local Storage (`window.localStorage`), JSON Resume schema

**Testing**: Jest, ts-jest, React Testing Library

**Target Platform**: Electron Desktop App (Windows, macOS, Linux)

**Project Type**: Desktop App (Electron MVC Main process + React Feature-Based Renderer process)

**Performance Goals**: Groq API response parsing < 50ms; UI label & tooltip rendering < 100ms

**Constraints**: `main.ts` kept strictly under 100 lines; zero API key hardcoding (`GROQ_API_KEY` via env); TailwindCSS exclusively for styling (no custom CSS files); TDD mandatory.

**Scale/Scope**: Skill categorization for CSV imports containing up to hundreds of skills.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture & Frameworks**: Uses Electron + TypeScript for Main process (MVC controller) and React + TypeScript for Renderer process (Feature-based component).
- [x] **Main Process Constraints**: `main.ts` remains strictly under 100 lines (IPC route delegated to `IpcController`).
- [x] **State & Data Management**: Uses Zustand global store, Local Storage persistence, Zod schema validation, and adheres to JSON Resume `skills` model.
- [x] **Testing Standards**: TDD with Jest mandatory before implementation.
- [x] **Styling Constraints**: TailwindCSS exclusively used for floating label and tooltip positioning (no custom CSS files).
- [x] **Integrations & Tooling**: Uses `groq-sdk`.

## Project Structure

### Documentation (this feature)

```text
specs/005-groq-skill-analysis/
├── spec.md              # Feature Specification
├── plan.md              # Implementation Plan
├── research.md          # Technical decisions & rationale
├── data-model.md        # Entities, schemas & validation rules
├── quickstart.md        # Validation & test execution guide
├── contracts/
│   └── groq-ipc-contract.md # IPC request/response contract & system prompt
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── controllers/
│   |   ├── GroqController.ts    # Groq SDK controller & prompt execution
│   |   └── IpcController.ts          # IPC route registration (groq:analyze-skills)
│   └── shared/
│       └── schema/
│           └── resumeSchema.ts           # JSON Resume Skill schema & validation
└── renderer/
    └── src/
        ├── features/
        |  └── home/
        |      └── SkillsArticle/
        │          ├── SkillsArticle.tsx # Categorized skill list renderer
        │          └── NonElementalLabel.tsx     # Floating label & hover tooltip
        └── store/
            └── useResumeStore.ts          # Zustand store for skills


tests/
├── main/
│   └── controllers/
│       └── GroqController.test.ts # TDD tests for Groq controller & parser
└── renderer/
    └── components/
        └── NonElementalLabel.test.tsx  # TDD tests for label and tooltip
```

**Structure Decision**: Standard Electron MVC (Main) and Feature-Based (Renderer) project structure aligned with project constitution.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | N/A | Fully compliant with project constitution |
