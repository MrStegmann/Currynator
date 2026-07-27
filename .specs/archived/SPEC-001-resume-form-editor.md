# SPEC-001: Comprehensive Resume Form Editor Refactor

- **Status:** COMPLETED
- **Author:** Gemini Code Agent
- **Created Date:** 2026-07-27
- **Target Feature Path:** `src/renderer/src/features/studio/components/canvas/`

---

## 1. Executive Summary & Problem Statement
Currently, `ResumeFormEditor.tsx` only allows editing basic metadata (Resume Title), personal details (Name, Title, Email, Phone, Location, LinkedIn), professional summary, and project selection. Key sections of the `ResumeData` profile interface—specifically Work Experience (`experience`), Education (`education`), Certifications (`certifications`), Skills (`skills`), Languages (`languages`), and complete Personal Details (GitHub URL, Portfolio/Website URL)—cannot be edited through the form editor.

This feature refactors `ResumeFormEditor.tsx` into a modular form editing suite that enables users to completely view, add, edit, reorder, and remove all resume profile data. To prevent large monolithic components and adhere to AGENTS.md guidelines (< 40–50 lines per function/component), the form editor is split into dedicated, reusable sub-section components.

## 2. Functional Requirements
List user-facing capabilities using exact, testable criteria.
- [ ] **FR-1:** **Personal Details & Social Links:** User can edit GitHub URL, Website/Portfolio URL, and existing contact fields.
- [ ] **FR-2:** **Work Experience Management:** User can add new work experiences, edit role details (job title, company, dates, current role toggle, context), manage bullet points (highlights), and delete experiences.
- [ ] **FR-3:** **Education Management:** User can add, edit (degree, institution, graduation year, current study toggle), and delete education entries.
- [ ] **FR-4:** **Certifications Management:** User can add, edit (certification name, issuing organization, granted year, current study toggle), and delete certifications.
- [ ] **FR-5:** **Skills Management:** User can manage skill categories (add/edit category name/remove) and add/remove skills as tags/chips within each category.
- [ ] **FR-6:** **Languages Management:** User can add, edit, and delete spoken/written language entries.
- [ ] **FR-7:** **Projects Selection Integration:** Retain and integrate the existing `ProjectSelector` seamlessly within the section structure.
- [ ] **FR-8:** **Real-time Synchronization:** Every edit updates the parent `ResumeData` state via `onChange(updatedResume)` without state loss.

## 3. Technical Architecture & File Plan
Specify exact file paths to be created or modified according to `AGENTS.md` rules.

### New Files
- `src/renderer/src/features/studio/components/canvas/form-sections/PersonalDetailsForm.tsx` (Sub-form for personal details & social links)
- `src/renderer/src/features/studio/components/canvas/form-sections/WorkExperienceForm.tsx` (Sub-form for work experience array & highlights)
- `src/renderer/src/features/studio/components/canvas/form-sections/EducationForm.tsx` (Sub-form for education array)
- `src/renderer/src/features/studio/components/canvas/form-sections/CertificationForm.tsx` (Sub-form for certifications array)
- `src/renderer/src/features/studio/components/canvas/form-sections/SkillsForm.tsx` (Sub-form for skill categories & skill tags)
- `src/renderer/src/features/studio/components/canvas/form-sections/LanguagesForm.tsx` (Sub-form for languages array)
- `src/renderer/src/features/studio/components/canvas/form-sections/index.ts` (Barrel export for section form components)
- `src/renderer/src/features/studio/components/canvas/index.ts` (Barrel export for canvas components)

### Modified Files
- `src/renderer/src/features/studio/components/canvas/ResumeFormEditor.tsx` (Refactored main form container delegating section state updates to modular form sections)

## 4. API & Data Flow Contracts
No new IPC channels are required as resume editing operates synchronously in React state inside the Studio renderer feature before saving.

### Data Schemas / Type References
Uses existing `ResumeData`, `WorkExperienceItem`, `EducationItem`, `CertificationItem`, `SkillCategory`, and `PersonalDetails` definitions in `src/renderer/src/features/studio/types/resume.types.ts`.

All new item creations generate unique string IDs using `crypto.randomUUID()`.

## 5. Non-Functional & Security Constraints
- **JSDoc Mandatory:** All exported sub-components and handler functions must include structured JSDoc documentation (`@param`, `@returns`).
- **SRP & Line Limits:** Keep all component files and helper functions under 40–50 lines where possible by extracting input sub-fields into clean components.
- **Strict TypeScript:** No `any` type usage; all handlers strictly typed with `ResumeData` and corresponding sub-item interfaces.
- **UI & UX:** Dark-themed slate aesthetic (`bg-slate-900/60`, `border-slate-800`, `text-blue-400` headings, Lucide icons) matching existing Studio Canvas design language.

## 6. Implementation Checklist
- [x] **Step 1:** Create `.specs/active/SPEC-001-resume-form-editor.md` specification file.
- [x] **Step 2:** Create `form-sections/PersonalDetailsForm.tsx` for full personal contact and social details.
- [x] **Step 3:** Create `form-sections/WorkExperienceForm.tsx` supporting dynamic array management and highlights list editing.
- [x] **Step 4:** Create `form-sections/EducationForm.tsx` and `form-sections/CertificationForm.tsx` for education and certification arrays.
- [x] **Step 5:** Create `form-sections/SkillsForm.tsx` for category and skill tag management.
- [x] **Step 6:** Create `form-sections/LanguagesForm.tsx` for language entries.
- [x] **Step 7:** Create barrel export `form-sections/index.ts` and `canvas/index.ts`.
- [x] **Step 8:** Refactor `ResumeFormEditor.tsx` to compose all section components cleanly.
- [x] **Step 9:** Run `npm run lint` with Oxlint to verify zero linter errors and zero TypeScript errors.
