# SPEC-002: Step-by-Step AI Resume Optimization Wizard

- **Status:** COMPLETED
- **Author:** Gemini Code Agent
- **Created Date:** 2026-07-27
- **Completed Date:** 2026-07-28
- **Target Feature Path:** `src/renderer/src/features/studio/components/modals/`

---

## 1. Executive Summary & Problem Statement
Currently, AI optimization in Studio runs as a monolithic one-shot operation that replaces resume content without step-by-step human oversight. Users lack the ability to inspect, refine, or re-prompt individual sections of their resume during the optimization process, or specify their output language preference.

This feature refactors the AI Optimization workflow into a 7-step interactive wizard modal (`AiOptimizationWizardModal`). Powered by Groq SDK (`groq-sdk`) in the Main Process with the system role defined in `src/main/prompts/technical-resume-editor-agent.md` ("Technical Resume Editor & ATS Specialist"), the wizard guides the user through 7 sequential review steps:
1. **Output Language Selection:** Prompts user for output language preference (e.g., English, Spanish) using a `<select>` dropdown powered by a reusable constant array (`SUPPORTED_LANGUAGES`) for fast language additions.
2. **Professional Title:** Refines and optimizes the candidate's professional title in the selected language.
3. **Professional Summary:** Optimizes summary for ATS parsing and recruiter impact in the selected language.
4. **Work Experience:** Filters and rewrites relevant work roles and high-impact highlight bullets in the selected language.
5. **Education & Certifications:** Selects supporting academic degrees and certifications fitting the title/summary in the selected language.
6. **Skills & Competencies:** Categorizes and filters hard skills and soft skills in the selected language.
7. **Technical Projects:** Selects relevant technical projects by analyzing project scores and programming languages/technologies, using project data verbatim without changing it.

At each step from Step 2 onwards, the user can **Accept**, **Skip/Keep Current**, or enter custom **Feedback / Re-proposal Instructions** to ask the AI to re-generate options for that specific step. Optimization completes when all steps are reviewed or when the user closes the modal.

## 2. Functional Requirements
- [ ] **FR-1: Wizard Step 1 (Language Selection):** First step prompts the user to select their output language preference using a `<select>` dropdown labeled "Output Language Preference". Options include English (`en`) and Spanish (`es`), built from a `SUPPORTED_LANGUAGES` constant array to easily add new languages. Selection determines the target language for all subsequent AI optimization calls.
- [ ] **FR-2: Groq AI Agent System Prompt & Constraints:** Backend Groq API calls configure the AI Agent using the prompt stored in `src/main/prompts/technical-resume-editor-agent.md`:
```textplain
Role: Technical Resume Editor & ATS Specialist.
Goal: Rewrite software engineering resume text for ATS compliance without inventing ANY new information.

CRITICAL RULE (ZERO INVENTED DATA):
- NEVER invent metrics, percentages, team sizes, dollar amounts, tools, or responsibilities.
- IF A METRIC IS MISSING: Use a exact placeholder like [X%] or [Y metric]. DO NOT fabricate numbers like "50%" or "25%".
- Work ONLY with facts directly stated in the input text.

PROJECT SELECTION RULE:
- AI Agents must select projects by analyzing the score and the languages/technologies.
- Use the data of selected projects verbatim without changing or altering it.

TASKS:
1. ATS Standardization: Translate to English if needed. Standardize technical terms and headers.
2. Structure & Clarity: Use action verbs (Engineered, Architected, Refactored) and clear technical descriptions.
3. Formatting: Output plain text/Markdown bullets.

OUTPUT RULES:
- Provide the optimized text.
- If placeholders like [X%] were inserted, explicitly list them under a section called "Action Items for Candidate".
```
- [ ] **FR-3: Step 2 (Professional Title):** AI proposes refined job title in selected target language; user can accept, skip, or input feedback for re-proposal.
- [ ] **FR-4: Step 3 (Professional Summary):** AI proposes ATS-optimized summary; user can accept, skip, or input feedback for re-proposal.
- [ ] **FR-5: Step 4 (Work Experience):** AI selects relevant roles and rewrites bullet points for impact; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-6: Step 5 (Education & Certifications):** AI selects degrees/certifications fitting the target title/summary; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-7: Step 6 (Skills & Competencies):** AI categorizes hard skills and soft skills; user reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-8: Step 7 (Technical Projects Selection):** AI Agents must select projects by analyzing the score and the languages/technologies of the projects, and use the project data verbatim without changing or altering it. User reviews, accepts, skips, or requests re-proposal.
- [ ] **FR-9: Step-by-Step Re-proposal:** Each step includes a user response input field allowing custom feedback to re-prompt Groq for alternative suggestions.
- [ ] **FR-10: Incremental State Commit:** Accepting a proposal commits that step's changes into the active working resume. Closing the modal or completing step 7 finalizes the optimized resume state.

## 3. Technical Architecture & File Plan

### New Files
- `src/main/prompts/technical-resume-editor-agent.md` (AI Agent system prompt file)
- `src/main/ipc/aiOptimizationHandlers.ts` (IPC listeners for step-by-step Groq optimization)
- `src/renderer/src/features/studio/constants/languages.ts` (Contains `SUPPORTED_LANGUAGES` constant array for output language options)
- `src/renderer/src/features/studio/components/modals/ai-wizard/AiOptimizationWizardModal.tsx` (Main 7-step wizard modal container)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepLanguage.tsx` (Step 1 view component for language selection)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepTitle.tsx` (Step 2 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepSummary.tsx` (Step 3 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepExperience.tsx` (Step 4 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepEducationCert.tsx` (Step 5 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepSkills.tsx` (Step 6 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepProjects.tsx` (Step 7 view component)
- `src/renderer/src/features/studio/components/modals/ai-wizard/WizardStepControls.tsx` (Reusable bottom action buttons & feedback input)
- `src/renderer/src/features/studio/components/modals/ai-wizard/index.ts` (Barrel export for wizard components)

### Modified Files
- `src/main/services/groq.service.ts` (Add `optimizeResumeStepWithGroq` helper method loading prompt from agent markdown file)
- `src/main/ipc/channelHandlers.ts` (Register `STUDIO_OPTIMIZE_STEP` IPC listener)
- `src/preload/index.ts` (Expose `window.api.studio.optimizeStep` bridge method)
- `src/renderer/src/features/studio/index.tsx` (Wire modal state trigger from right sidebar AI action buttons)
- `src/renderer/src/features/studio/components/right-sidebar/AiActionButtons.tsx` (Connect "AI Optimization" button to trigger wizard modal)

## 4. API & Data Flow Contracts

### Extensible Language Constant (`src/renderer/src/features/studio/constants/languages.ts`)
```typescript
export interface LanguageOption {
  value: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' }
] as const;
```

### IPC Channels
- **`studio:optimize-step`**:
  - Request Payload:
    ```typescript
    {
      step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
      targetLanguage: string;
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
- [x] **Step 1:** Create `.specs/active/SPEC-002-ai-optimization-wizard.md` specification file.
- [x] **Step 2:** Create system prompt markdown file `src/main/prompts/technical-resume-editor-agent.md`.
- [x] **Step 3:** Define `SUPPORTED_LANGUAGES` constant in `src/renderer/src/features/studio/constants/languages.ts`.
- [x] **Step 4:** Add `optimizeResumeStepWithGroq` service method in `groq.service.ts` using system prompt from `technical-resume-editor-agent.md` with project selection rules (scores & languages, verbatim project data) and Zod schemas.
- [x] **Step 5:** Register `studio:optimize-step` IPC channel in `main/ipc/` and expose bridge method in `preload/index.ts`.
- [x] **Step 6:** Create `WizardStepLanguage.tsx` for step 1 language selection and `WizardStepControls.tsx` for feedback input, Accept, Skip, and Re-propose actions.
- [x] **Step 7:** Create step views (`WizardStepTitle`, `WizardStepSummary`, `WizardStepExperience`, `WizardStepEducationCert`, `WizardStepSkills`, `WizardStepProjects`).
- [x] **Step 8:** Create `AiOptimizationWizardModal.tsx` container and barrel export `ai-wizard/index.ts`.
- [x] **Step 9:** Wire modal trigger into `AiActionButtons.tsx` and `Studio/index.tsx`.
- [x] **Step 10:** Run `npm run lint` and `npx tsc --noEmit` to verify zero linter errors and zero TypeScript errors.
