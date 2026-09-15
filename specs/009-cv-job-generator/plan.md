# Implementation Plan: CV Job Application - CV Generator

**Branch**: `009-cv-job-generator` | **Date**: 2026-09-15 | **Spec**: [spec.md](file:///d:/Github/Currynator/specs/009-cv-job-generator/spec.md)

**Input**: Feature specification from `/specs/009-cv-job-generator/spec.md`

## Summary

Implement an AI-powered job-driven CV generator that analyzes a user's master JSON Resume against a targeted Job Application using the Groq API. The initial application status defaults to `pending`. A new IPC handler `groq:cv-job-driven` receives the master JSON Resume and Job Application details, returning a `match_score` and a tailored `json_resume` without hallucinations and with empty properties stripped out. The tailored JSON Resume and match score are saved specifically with the Job Application record in local storage, leaving the user's master JSON Resume untouched. The UI is updated to feature Preview CV, Download CV, and Regenerate CV buttons on item cards, and the modal creation form is replaced with a full-page view featuring a top-level back-arrow navigation button.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js / Electron / React 18)

**Primary Dependencies**: Electron, React, Zustand, Zod, Groq SDK (`groq-sdk`), TailwindCSS

**Storage**: Local Storage / JSON file persistence (`JobApplicationStorage.ts` writing `job_applications.json`)

**Testing**: Jest (Unit & Component testing)

**Target Platform**: Desktop (Electron on Windows/macOS/Linux)

**Project Type**: Desktop Application (Electron + React)

**Performance Goals**: Groq AI CV generation & match score response within 5 seconds under normal network conditions

**Constraints**: Zero hallucination (facts strictly from master JSON Resume), zero master resume mutation, strip empty properties from output JSON resume, default status `pending`

**Scale/Scope**: 1 IPC channel (`groq:cv-job-driven`), 1 main process controller method, updated Zod schemas, 1 full-page form view replacing modal, 3 card buttons on `CvItemCard`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Architecture & Frameworks**: Uses Electron + TypeScript for main/renderer, React + TypeScript for renderer, Feature-Based architecture for renderer, MVC for main process, SOLID principles.
- [x] **II. Main Process Constraints**: `main.ts` kept under 100 lines.
- [x] **III. State & Data Management**: Zustand for global state, Local Storage for persistence, JSON Resume schema standard, Zod for data validation.
- [x] **IV. Testing Standards**: Test-Driven Development (TDD) mandatory with Jest.
- [x] **V. Styling Constraints**: TailwindCSS exclusively following `DESIGN.md`. No custom CSS.
- [x] **VI. Integrations & Tooling**: Groq SDK integrated for AI analysis.

## Project Structure

### Documentation (this feature)

```text
specs/009-cv-job-generator/
├── spec.md              # Feature Specification
├── plan.md              # Implementation Plan
├── research.md          # Phase 0 Output
├── data-model.md        # Phase 1 Output
├── quickstart.md        # Phase 1 Output
└── contracts/           # Phase 1 Output
    └── groq-cv-job-driven.json
```

### Source Code Layout

```text
src/
├── main/
│   ├── controllers/
│   │   ├── GroqController.ts          # [MODIFY] Add analyzeCvJobDriven method
│   │   ├── IpcController.ts           # [MODIFY] Register 'groq:cv-job-driven' handler
│   │   └── JobApplicationController.ts# [MODIFY] Save/update job application with match_score & tailored CV
│   ├── models/
│   │   └── JobApplicationStorage.ts   # [MODIFY] Support storing match_score and tailored_json_resume
│   ├── shared/
│   │   └── schema/
│   │       └── jobApplicationSchema.ts# [MODIFY] Add 'pending' status, match_score, and tailored_json_resume fields
│   └── preload.cts                    # [MODIFY] Expose groq.analyzeCvJobDriven API method
└── renderer/
    └── src/
        ├── features/
        │   └── cv-dashboard/
        │       ├── components/
        │       │   ├── CvDashboardView.tsx     # [MODIFY] Handle page view toggle (List vs Full-page Form)
        │       │   ├── CvItemCard.tsx          # [MODIFY] Display 'pending' status & Preview, Download, Regenerate buttons
        │       │   ├── JobApplicationFormView.tsx # [NEW] Full-page form view replacing modal, with back arrow
        │       │   ├── PreviewCvModal.tsx      # [NEW] Render tailored CV preview
        │       │   └── JobApplicationFormModal.tsx # [DELETE/DEPRECATE] Replaced by JobApplicationFormView
        │       └── store/
        │           └── useCvDashboardStore.ts  # [MODIFY] Manage form view state, pending status, preview modal & regeneration
        └── shared/
            └── types/
                └── electron.d.ts               # [MODIFY] Update type definitions for IPC methods
```

**Structure Decision**: Selected single desktop app structure (Option 1 equivalent with Electron Main `src/main` + Renderer `src/renderer`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations. All design choices strictly align with Currynator Constitution v1.3.0.*
