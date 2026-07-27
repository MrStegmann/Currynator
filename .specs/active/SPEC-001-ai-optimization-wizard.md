# SPEC-001: Step-by-Step AI Resume Optimization Wizard

- **Status:** COMPLETED
- **Author:** Gemini Code Agent
- **Created Date:** 2026-07-27
- **Target Feature Path:** `src/renderer/src/features/studio/components/modals/`

---

## 1. Executive Summary & Problem Statement
Currently, AI optimization in Studio runs as a monolithic one-shot operation that replaces resume content without step-by-step human oversight. Users lack the ability to inspect, refine, or re-prompt individual sections of their resume during the optimization process.

This feature refactors the AI Optimization workflow into a multi-step interactive wizard modal (`AiOptimizationWizardModal`). Powered by Groq SDK (`groq-sdk`) in the Main Process with the system role `"Technical Resume Strategist & ATS Optimization Specialist"`, the wizard guides the user through 6 sequential review steps:
1. **Professional Title:** Refines and optimizes the candidate's professional title.
2. **Professional Summary:** Optimizes summary for ATS parsing and recruiter impact.
3. **Work Experience:** Filters and rewrites relevant work roles and high-impact highlight bullets.
4. **Education & Certifications:** Selects supporting academic degrees and certifications fitting the title/summary.
5. **Skills & Competencies:** Categorizes and filters hard skills and soft skills.
6. **Technical Projects:** Selects relevant technical projects (minimum 3 projects) aligned with title/summary.

At each step, the user can **Accept**, **Skip/Keep Current**, or enter custom **Feedback / Re-proposal Instructions** to ask the AI to re-generate options for that specific step. Optimization completes when all steps are reviewed or when the user closes the modal.

## 2. Functional Requirements
- [ ] **FR-1: Wizard Modal Launch:** Clicking "AI Optimization" in Studio opens the 6-step interactive modal with active resume context.
- [ ] **FR-2: Groq AI Agent System Prompt & Constraints:** Backend Groq API calls configure the AI Agent with the following system_prompt: 
```typescript
system_prompt = `
# Role & Constraints
Role: Technical Resume Strategist & ATS Specialist.
Goal: Rewrite existing software engineering resumes for ATS compliance and recruiter impact to land interviews.

## STRICT CONSTRAINTS (ZERO-HALLUCINATION):
1. Only use facts, skills, tech, and history present in the original input. NEVER add unmentioned tools, metrics, or roles.
2. If metrics are missing, use placeholders like [X%] or ask the user directly.

## TASKS:
- ATS Optimization: Standardize section headers (Experience, Skills, Projects, Education). Rephrase descriptions to match technical terms accurately without altering facts.
- High Impact Rewriting: Use Google's XYZ formula (Accomplished [X], measured by [Y], by doing [Z]). Start bullets with strong technical verbs (Engineered, Architected, Refactored, Optimized).
- Formatting: Ensure output is clean, scannable plain text/Markdown. Remove tables, non-standard symbols, or complex layouts.

## OUTPUT REQUIREMENTS:
- Provide rewritten bullet points line-by-line.
- Highlight changes made and briefly state why.`
```
- [ ] **FR-3: Step 1 (Professional Title):** AI proposes refined job title; user can accept, skip, or input feedback for re-proposal.
- [ ] **FR-4: Step 2 (Professional Summary):** AI proposes ATS-optimized summary; user can accept, skip, or input feedback for re-proposal.
- [ ] **FR-5: Step 3 (Work Experience):** AI selects relevant roles and rewrites bullet points for impact; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-6: Step 4 (Education & Certifications):** AI selects degrees/certifications fitting the target title/summary; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-7: Step 5 (Skills):** AI categorizes hard skills and soft skills; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-8: Step 6 (Projects):** AI selects at least 3 matching projects; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-9: Step-by-Step Re-proposal:** Each step includes a user response input field allowing custom feedback to re-prompt Groq for alternative suggestions.
- [ ] **FR-10: Incremental State Commit:** Accepting a proposal commits that step's changes into the active working resume. Closing the modal or completing step 6 finalizes the optimized resume state.

## 3. Technical Architecture & File Plan

### New Files
- `src/main/ipc/aiOptimizationHandlers.ts` (IPC listeners for step-by-step Groq optimization)
- `src/renderer/src/features/studio/components/modals/ai-wizard/AiOptimizationWizardModal.tsx` (Main 6-step wizard modal container)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepTitle.tsx` (Step 1 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepSummary.tsx` (Step 2 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepExperience.tsx` (Step 3 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepEducationCert.tsx` (Step 4 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepSkills.tsx` (Step 5 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepProjects.tsx` (Step 6 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepControls.tsx` (Reusable bottom action buttons & feedback input)
- `src/renderer/src/features/studio/components/modals/ai-wizard/index.ts` (Barrel export for wizard components)

### Modified Files
- `src/main/services/groq.service.ts` (Add `optimizeResumeStepWithGroq` helper method with system role `"Expert recruiter and ATS"`)
- `src/main/ipc/channelHandlers.ts` (Register `STUDIO_OPTIMIZE_STEP` IPC listener)
- `src/preload/index.ts` (Expose `window.api.studio.optimizeStep` bridge method)
- `src/renderer/src/features/studio/index.tsx` (Wire modal state trigger from right sidebar AI action buttons)
- `src/renderer/src/features/studio/components/right-sidebar/AiActionButtons.tsx` (Connect "AI Optimization" button to trigger wizard modal)

## 4. API & Data Flow Contracts

### IPC Channels
- **`studio:optimize-step`**:
  - Request Payload:
    ```typescript
    {
      step: 1 | 2 | 3 | 4 | 5 | 6;
      currentResume: ResumeData;
      userFeedback?: string;
    }
    ```
  - Response Format:
    ```typescript
    {
      success: boolean;
      proposal: StepProposalData;
      error?: string;
    }
    ```

### Data Schemas
```typescript
import { z } from 'zod';

export const stepTitleProposalSchema = z.object({
  proposedTitle: z.string(),
  reasoning: z.string()
});

export const stepSummaryProposalSchema = z.object({
  proposedSummary: z.string(),
  reasoning: z.string()
});

export const stepExperienceProposalSchema = z.object({
  proposedExperience: z.array(workExperienceItemSchema),
  reasoning: z.string()
});

export const stepEducationCertProposalSchema = z.object({
  proposedEducation: z.array(educationItemSchema),
  proposedCertifications: z.array(certificationItemSchema),
  reasoning: z.string()
});

export const stepSkillsProposalSchema = z.object({
  proposedSkills: z.array(skillCategorySchema),
  reasoning: z.string()
});

export const stepProjectsProposalSchema = z.object({
  proposedProjects: z.array(projectItemSchema).min(3, "At least 3 projects must be selected"),
  reasoning: z.string()
});
```

## 5. Non-Functional & Security Constraints
- **Groq API Security:** Groq API calls execute exclusively in Electron Main process using secure token stored via `safeStorage`.
- **JSON Repair & Validation:** All raw Groq API JSON outputs pass through `jsonrepair` and Zod schema parsing before sending to renderer.
- **JSDoc Mandatory:** All exported functions, IPC handlers, service methods, and React components include full JSDoc documentation.
- **Line Limits & SRP:** Components separated into small focused files (< 40–50 lines per function).
- **Strict TypeScript:** No `any` type usage; all contracts validated using Zod schemas.

## 6. Implementation Checklist
- [x] **Step 1:** Create `.specs/active/SPEC-001-ai-optimization-wizard.md` specification file.
- [x] **Step 2:** Add `optimizeResumeStepWithGroq` service method in `groq.service.ts` using `"Technical Resume Strategist & ATS Specialist"` system role and Zod schemas.
- [x] **Step 3:** Register `studio:optimize-step` IPC channel in `main/ipc/` and expose bridge method in `preload/index.ts`.
- [x] **Step 4:** Create `WizardStepControls.tsx` for feedback input, Accept, Skip, and Re-propose actions.
- [x] **Step 5:** Create step views (`WizardStepTitle`, `WizardStepSummary`, `WizardStepExperience`, `WizardStepEducationCert`, `WizardStepSkills`, `WizardStepProjects`).
- [x] **Step 6:** Create `AiOptimizationWizardModal.tsx` container and barrel export `ai-wizard/index.ts`.
- [x] **Step 7:** Wire modal trigger into `AiActionButtons.tsx` and `Studio/index.tsx`.
- [x] **Step 8:** Run `npm run lint` and `npx tsc --noEmit` to verify zero linter errors and zero TypeScript errors.
