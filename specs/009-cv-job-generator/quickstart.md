# Quickstart & Verification Guide: CV Job Application - CV Generator

**Feature**: `009-cv-job-generator`

This guide outlines runnable validation scenarios to verify end-to-end functionality for the AI CV Job Application generator.

---

## 1. Unit & Integration Testing Scenarios

Run the automated test suite with Jest:

```bash
npm test
```

### Key Automated Test Coverage:

1. **Job Application Schema Validation** (`tests/jobApplicationSchema.test.ts`):
   - Validates that default status is set to `'pending'`.
   - Validates acceptance of `match_score` (number between 0 and 100) and `tailored_json_resume` (object).
2. **Groq Controller CV Job Driven Analysis** (`tests/GroqController.test.ts`):
   - Tests `analyzeCvJobDriven` with mocked Groq SDK client response.
   - Verifies recursive stripping of empty string/array/null properties from output `json_resume`.
   - Verifies zero hallucination constraints.
3. **IPC Registration** (`tests/IpcController.test.ts`):
   - Verifies `groq:cv-job-driven` IPC channel handles request and returns `{ success, match_score, json_resume }`.
4. **Card Buttons & Full Page Navigation** (`src/renderer/src/features/cv-dashboard/tests/`):
   - Verifies full page form view renders with Back Arrow button.
   - Verifies clicking Back Arrow transitions back to list view.
   - Verifies card renders `pending` status badge and Preview CV, Download CV, and Regenerate CV buttons.

---

## 2. Manual End-to-End Verification Scenarios

### Scenario A: Create Job Application with AI CV Generation
1. Launch app in development mode (`npm run dev`).
2. Navigate to **CV Applications** section.
3. Click **Add New Application**. Verify list view is replaced by full-page form view with top-left Back Arrow button (`← Back to Job Applications`).
4. Fill in:
   - **Job Title**: "Senior Frontend Engineer"
   - **Job Description**: "Looking for React, TypeScript, and TailwindCSS expert."
   - **Job Requirement**: "5+ years React, state management experience."
5. Click **Save Application**.
6. Observe:
   - Form submits and transitions back to the Job Application list.
   - The newly created card displays status **Pending**.
   - The card displays the AI calculated **Match Score** (e.g. `85% Match`).
7. Inspect Local Storage / Master Resume:
   - Verify the master JSON Resume remains untouched.
   - Verify the job application in `job_applications.json` contains `status: "pending"`, `match_score`, and `tailored_json_resume`.

### Scenario B: Preview Tailored CV
1. On the newly created Job Application card, click **Preview CV**.
2. Observe:
   - Modal/Drawer opens showing the tailored JSON Resume sections (Work, Skills, Education).
   - Only non-empty properties derived from the master CV are displayed.

### Scenario C: Regenerate CV
1. On the Job Application card, click **Regenerate CV**.
2. Observe:
   - Loading indicator appears on the card.
   - AI re-runs alignment and updates match score and tailored JSON Resume payload.

### Scenario D: Navigation Back Arrow
1. Click **Add New Application** or edit an existing application.
2. Click top-left **Back Arrow** button (`← Back to Job Applications`).
3. Verify view returns to application list without making changes or losing list state.
