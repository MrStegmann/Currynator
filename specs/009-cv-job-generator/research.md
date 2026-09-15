# Phase 0 Research: CV Job Application - CV Generator

**Feature**: `009-cv-job-generator`

## 1. Groq Prompting & Zero-Hallucination Strategy

### Problem Statement
The AI must take a user's master JSON Resume and target Job Application details (Title, Description, Requirements) and return a tailored JSON Resume along with a `match_score` (0-100). The AI must NEVER invent skills, experiences, dates, or companies not present in the master JSON Resume. Empty properties must be stripped from the final returned object.

### Solution / Decision
We define a dedicated system prompt in `GroqController.ts` for CV tailoring:

```text
You are an expert Technical Recruiter and Resume Alignment Engine.

Task:
Analyze the provided user Master JSON Resume against the target Job Application (title, description, requirements).
Output a tailored JSON Resume that highlights and selects the most relevant work experience, skills, highlights, and projects that match the job requirements.

Strict Rules:
1. ZERO HALLUCINATION: You MUST ONLY use data existing in the provided Master JSON Resume. DO NOT invent, extrapolate, or add non-existing skills, projects, companies, dates, or credentials.
2. MATCH SCORE: Calculate an honest numeric match score (integer from 0 to 100) reflecting how closely the user's master resume matches the job requirements.
3. OMIT EMPTY FIELDS: Do not include empty strings, empty arrays, or null properties in the output json_resume object.
4. Output JSON Format ONLY:
{
  "match_score": 85,
  "json_resume": { ... }
}
```

### Post-Processing Property Stripping
In `GroqController.ts`, we implement a recursive helper `cleanEmptyProperties(obj: any): any` that removes keys with `null`, `undefined`, `""`, or `[]` values from the returned `json_resume` payload before returning to the caller.

---

## 2. Main Process IPC & Data Storage Architecture

### Channel
- **Channel**: `groq:cv-job-driven`
- **Request payload**: `{ resume: Resume, jobApplication: { title: string; jobDescription: string; jobRequirement: string; companyDescription?: string } }`
- **Response payload**: `{ success: boolean; match_score?: number; json_resume?: Partial<Resume>; error?: string }`

### Data Storage & Master Resume Protection
- **Master JSON Resume Isolation**: Read strictly via `ResumeStorage.checkSavedData()`. No write operations are executed against `ResumeStorage` during this workflow.
- **Job Application Local Storage**: `JobApplicationSchema` is updated to include:
  - `status`: `z.enum(['pending', 'applied', 'called', 'interview', 'techTest', 'rejected', 'gotTheJob']).default('pending')`
  - `match_score`: `z.number().min(0).max(100).optional()`
  - `tailored_json_resume`: `z.record(z.any()).optional()`
- Persisted via `JobApplicationStorage.ts` to `job_applications.json`.

---

## 3. Renderer UI & Navigation Architecture

### Full-Page Form View Replacing Modal
- Current behavior: `JobApplicationFormModal.tsx` opens as a modal dialog over `CvDashboardView.tsx`.
- New behavior: `JobApplicationFormView.tsx` renders as a full-page component within `CvDashboardView.tsx` when view mode is `'create'` or `'edit'`.
- Includes a prominent header with a Back Arrow button (`← Back to Job Applications`) that returns the view mode to `'list'`.

### Card Buttons & Action Handling
- `CvItemCard.tsx` renders three buttons:
  1. `Preview CV`: Opens `PreviewCvModal` displaying formatted sections of the application's `tailored_json_resume`.
  2. `Download CV`: Triggers PDF download or print handler for the application's tailored CV.
  3. `Regenerate CV`: Calls `groq:cv-job-driven` via IPC, updates `match_score` and `tailored_json_resume`, and saves the updated record.
