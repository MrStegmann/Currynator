# Implementation Plan: Newest-First Chronological Data Sorting & GitHub Project Keyword Matching

**Branch**: `016-newest-sorting-data` | **Date**: 2026-10-05 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/016-newest-sorting-data/spec.md)

**Input**: Feature specification from `specs/016-newest-sorting-data/spec.md`

## Summary

Implement universal newest-first chronological sorting across all date-bearing resume sections (work experience, education, certificates, projects) in both UI views and generated/tailored CVs. In addition, implement dynamic GitHub project fetching and keyword-based filtering during CV generation to automatically preselect repositories matching the target job opening's language requirements.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+

**Primary Dependencies**: React 18, Zustand, Zod, Lucide-React, Groq SDK

**Storage**: Local Storage (encrypted tokens, cached repositories, JSON Resume data)

**Testing**: Jest, React Testing Library (@testing-library/react)

**Target Platform**: Electron (Windows, macOS, Linux)

**Project Type**: Desktop Application (Electron + React)

**Performance Goals**: Instantaneous sorting (<10ms for typical resume datasets), seamless GitHub project matching (<50ms for 100 repositories)

**Constraints**: Strict JSON Resume schema compliance, zero-dependency lightweight date parsing, TailwindCSS styling only

**Scale/Scope**: Universal sorting across 4+ data categories, CV generation store pipeline, project keyword matching utility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Electron with TypeScript used for main and renderer processes.
- [x] React with TypeScript used for renderer interface.
- [x] Feature-Based architecture pattern followed in renderer.
- [x] MVC architecture pattern followed in Electron backend.
- [x] SOLID principles applied in code structure.
- [x] `main.ts` kept strictly below 100 lines.
- [x] Zustand used for state management.
- [x] Local Storage used for persistence.
- [x] JSON Resume schema adhered to for resume data.
- [x] Zod used for data validation.
- [x] Test-Driven Development (TDD) with Jest is mandatory.
- [x] TailwindCSS used exclusively for styling; custom CSS prohibited.

## Project Structure

### Documentation (this feature)

```text
specs/016-newest-sorting-data/
├── plan.md              # Implementation plan
├── research.md          # Technical research & decisions
├── data-model.md        # Entities, schemas & lifecycle
├── quickstart.md        # Validation & verification scenarios
├── contracts/           # Interfaces & behavioral contracts
│   ├── date-sorting-service.md
│   └── project-keyword-matcher.md
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository layout)

```text
src/
├── main/
│   ├── controllers/
│   │   ├── GroqController.ts      # CV tailoring with sorted sections
│   │   └── IpcController.ts
│   └── shared/
│       └── schema/
│           └── resumeSchema.ts
└── renderer/
    └── src/
        ├── shared/
        │   └── utils/
        │       ├── dateSorting.ts # Universal newest-first date sorting utility
        │       └── tests/
        │           └── dateSorting.test.ts
        ├── store/
        │   └── useResumeStore.ts  # Auto-sorts resume collections on mutations
        └── features/
            ├── home/              # WorkArticle, EducationArticle, CertificatesArticle
            ├── projects/
            │   ├── utils/
            │   │   └── projectMatcher.ts # Language keyword matching for GitHub repos
            │   └── tests/
            │       └── projectMatcher.test.ts
            └── cv-dashboard/
                ├── store/
                │   └── useCvDashboardStore.ts # Preselects matching projects & enforces sort
                └── components/
                    ├── PreviewCvModal.tsx     # Renders sorted sections
                    └── JobApplicationFormView.tsx
```

**Structure Decision**: Universal date sorting lives in `src/renderer/src/shared/utils/dateSorting.ts` so it can be cleanly imported across all resume articles, stores, and CV generation pipelines. Project keyword matching lives in `src/renderer/src/features/projects/utils/projectMatcher.ts` and connects seamlessly to `useCvDashboardStore`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. All design patterns align 100% with the Currynator Constitution.*
