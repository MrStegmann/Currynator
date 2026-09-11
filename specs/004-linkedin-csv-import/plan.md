# Implementation Plan: LinkedIn CSV Import Page

**Branch**: `004-linkedin-csv-import` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-linkedin-csv-import/spec.md`

## Summary

Implement a full-featured LinkedIn CSV Import page enabling users to upload their LinkedIn data export ZIP file, parse its CSV contents in the main process using `adm-zip`, view dynamic progress feedback, handle pre-existing resume data prompts (Replace vs Merge), and populate the JSON Resume store (`resumeSchema.ts`).

## Technical Context

**Language/Version**: TypeScript 5.9 / ES2022 (Node.js 24)

**Primary Dependencies**: Electron, React 19, TailwindCSS, Zustand 5, Zod 4, `adm-zip`

**Storage**: Local Storage via `ResumeStorage` (`resume.json` in user data directory)

**Testing**: Jest, React Testing Library, ts-jest

**Target Platform**: Electron Desktop App (Windows/macOS/Linux)

**Project Type**: Desktop Application (Electron Main Process + React Renderer)

**Performance Goals**: Decompress ZIP and parse all CSV files in under 3 seconds for standard LinkedIn exports.

**Constraints**: Offline capable, strict Zod schema validation, Feature-Based architecture for renderer, MVC for main process backend, main.ts under 100 lines.

**Scale/Scope**: 1 ZIP export containing up to 10 CSV files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Architecture & Frameworks**:
   - Electron + React + TypeScript: PASS
   - Feature-Based architecture for renderer (`src/renderer/src/features/linkedin-import/`): PASS
   - MVC pattern for Electron backend (`src/main/controllers/`, `src/main/models/`): PASS
   - SOLID principles applied: PASS

2. **Main Process Constraints**:
   - `main.ts` kept under 100 lines: PASS

3. **State & Data Management**:
   - Zustand for state management (`useImportStore.ts`): PASS
   - Zod validation for JSON Resume: PASS

4. **Testing & Styling**:
   - TDD with Jest: PASS
   - TailwindCSS exclusively for styling: PASS

## Project Structure

### Documentation (this feature)

```text
specs/004-linkedin-csv-import/
├── plan.md              # Implementation plan
├── research.md          # Design decisions & research findings
├── data-model.md        # Entities, attributes, & transformation mapping
├── quickstart.md        # Scenario verification guide
└── contracts/
    └── ipc-contract.md  # Electron IPC channel contract
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── controllers/
│   │   ├── IpcController.ts
│   │   └── LinkedinImportController.ts
│   ├── models/
│   │   ├── ResumeStorage.ts
│   │   └── LinkedinCsvParser.ts
│   ├── views/
│   │   └── WindowView.ts
│   ├── main.ts
│   └── preload.cts
└── renderer/
    └── src/
        ├── features/
        │   ├── home/
        │   │   └── Home.tsx
        │   └── linkedin-import/
        │       ├── components/
        │       │   ├── ImportView.tsx
        │       │   ├── FloatingImportButton.tsx
        │       │   ├── InstructionStepList.tsx
        │       │   ├── ZipDropzone.tsx
        │       │   ├── ImportProgressBar.tsx
        │       │   └── PreExistingPromptModal.tsx
        │       └── store/
        │           └── useImportStore.ts
        ├── shared/
        └── store/
            └── useResumeStore.ts
```

**Structure Decision**: Renderer uses Feature-Based architecture under `src/renderer/src/features/linkedin-import/`. Backend uses MVC architecture under `src/main/controllers/` and `src/main/models/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations.*
