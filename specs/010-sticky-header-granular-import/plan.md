# Implementation Plan: Sticky Header and Granular LinkedIn Import

**Branch**: `010-sticky-header-granular-import` | **Date**: 2026-09-16 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/spec.md)

**Input**: Feature specification from [`/specs/010-sticky-header-granular-import/spec.md`](file:///d:/Github/Currynator/specs/010-sticky-header-granular-import/spec.md)

## Summary

This feature refactors the application header layout to be 100% sticky across scrollable views, enhances the LinkedIn ZIP import conflict resolution flow to support granular per-section decision making (**Replace**, **Keep Original**, **Merge**) with detailed descriptions, and introduces a LinkedIn ZIP import alternative directly into the first-time onboarding screen.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js
**Primary Dependencies**: React 18, TailwindCSS, Lucide-React, JSZip, Papaparse, Zustand, Zod
**Storage**: Local Storage via `useResumeStore` / `initStore` (JSON Resume schema)
**Testing**: Jest + React Testing Library (TDD enforced)
**Target Platform**: Electron Desktop Application (Windows/macOS/Linux)
**Project Type**: Desktop application (Electron main + React renderer)
**Performance Goals**: Header sticky rendering with 0 layout shift (<16ms frame target); import resolution execution under 100ms
**Constraints**: Follow project constitution (strictly TailwindCSS styling, feature-based architecture, Zod validation, JSON Resume standard)
**Scale/Scope**: 1 layout component (`Header.tsx`), 3 import components (`PreExistingPromptModal.tsx`, `ImportView.tsx`, new `GranularImportConflictModal.tsx`), 1 onboarding component (`OnboardingForm.tsx`), 1 utility helper for section resolution (`applyGranularImportResolution.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Architecture & Frameworks**: Electron + React + TypeScript in feature-based renderer pattern used.
- [x] **II. Main Process Constraints**: No changes to `main.ts`.
- [x] **III. State & Data Management**: Zustand stores used; Local Storage persistence; JSON Resume format strictly preserved; Zod validation.
- [x] **IV. Testing Standards**: Jest tests written before implementation (TDD).
- [x] **V. Styling Constraints**: Exclusively TailwindCSS styling; follows `DESIGN.md`.
- [x] **VI. Integrations & Tooling**: N/A for Groq/Playwright in this feature.

**Status**: ALL CONSTITUTION GATES PASSED.

## Project Structure

### Documentation (this feature)

```text
specs/010-sticky-header-granular-import/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Data models & section resolution rules
├── quickstart.md        # Runnable validation scenarios
└── contracts/           # Interfaces & function contracts
    └── import-resolution-contract.md
```

### Source Code Layout

```text
src/
└── renderer/
    └── src/
        ├── shared/
        │   ├── components/
        │   │   └── Header/
        │   │       └── Header.tsx                    # [MODIFY] Add sticky positioning
        │   └── types/
        │       └── resume.ts                         # [REFERENCE] JSON Resume types
        ├── features/
        │   ├── home/
        │   │   └── Home.tsx                          # [MODIFY] Layout parent container for sticky header
        │   ├── initialization/
        │   │   └── components/
        │   │       └── OnboardingForm.tsx            # [MODIFY] Add LinkedIn ZIP import option
        │   └── linkedin-import/
        │       ├── components/
        │       │   ├── ImportView.tsx                # [MODIFY] Connect granular conflict modal
        │       │   ├── PreExistingPromptModal.tsx    # [MODIFY/REFRACTOR] Replace global prompt with section modal
        │       │   └── GranularImportConflictModal.tsx # [NEW] Granular section resolution UI
        │       ├── utils/
        │       │   └── applyGranularImportResolution.ts # [NEW] Section resolution & merge engine
        │       └── types/
        │           └── importResolution.ts           # [NEW] Resolution types & descriptors
        └── store/
            └── useResumeStore.ts                     # [REFERENCE] Global resume state
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
