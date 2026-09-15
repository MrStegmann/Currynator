# Feature Specification: CV Job Application - Tailored CV Generator

**Feature Branch**: `009-cv-job-generator`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "We need to modificate the CV Job Application: It needs one status before applied that its called pending that will be the first status by default. During the creation of a New CV Job Application, it must send by Groq API to generate a Specific CV aligned to the Job requirements. The AI MUST use ONLY the data existing in the JSON Resume of the user, NEVER HALLUCINATE NOR ADD unexisting data. The task of the AI is to ADJUST the data to the Job Application and provide a Match Score to return a solid feedback to the user so he now how much his skills match to the job application. The CV Item Card need need 3 new buttons: Preview Curriculum, download CV in PDF AND Regenerate CV (for now, we only want the preview AND Regenerate CV). The AI MUST analyze the job application and generate a JSON response with the data from JSON resume that fetch the requeriment most. The result must be completly engagement with job application. When the user Regenerate the CV, redo the same step descripted above. What to Do: Groq API controller: New PCI groq:cv-job-driven that get the JSON Resume of the user AND the Job Application Schema. It must return a JSON with the properties success, match_score, json_resume. If properties are empty in the output JSON resume, don't add it to the result. New Job Application: Add the call to the service when a user creates a new Job Application. CV Item Card: The Cards have the 3 new buttons Preview CV, Download CV, Regenerate CV; Have the new first status pending. Job Application Form Page: Instead of using a Modal, the Form page must replace the actual view of the List of Job Application, with a Back arrow button to get back to the List. Update 009: The generated output JSON resume from Job Application NEVER would replace JSON resume. It will be saved with the Job Application ID in his own local storage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI-Driven Tailored CV Generation on Creation (Priority: P1)

As a job applicant creating a new Job Application record, I want the system to automatically analyze the target job description against my master JSON Resume and generate a job-specific tailored CV with a match score, setting the initial application status to `pending`, so that I can see how well my experience aligns with the job before applying without altering my master CV profile.

**Why this priority**: Core value of the feature—automates custom CV generation per job application without hallucinating data, preserving master profile integrity, establishing a clear starting status (`pending`) and actionable match score feedback.

**Independent Test**: Create a new Job Application with a sample job title and description. Confirm that the application saves with `pending` status, triggers the Groq AI alignment analysis, receives a non-hallucinated tailored JSON Resume and a match score percentage, stores the tailored CV in local storage associated with the Job Application ID, and leaves the user's master JSON Resume untouched.

**Acceptance Scenarios**:

1. **Given** a user has a valid stored master JSON Resume, **When** they submit a new Job Application form, **Then** the application is saved with default status `pending`, triggers AI CV tailoring using only existing master JSON Resume data, and displays the generated match score.
2. **Given** the AI CV generation completes, **When** examining the resulting tailored JSON Resume, **Then** empty or unpopulated properties are omitted from the JSON resume object, and no synthetic/hallucinated skills or experiences are added.
3. **Given** a tailored JSON Resume is generated for a Job Application, **When** the generation succeeds, **Then** the tailored CV is persisted associated with the Job Application ID in local storage and the master JSON Resume remains strictly unchanged.

---

### User Story 2 - CV Card Interactive Controls & Status Display (Priority: P2)

As a user browsing my CV Job Applications, I want each application card to clearly display its status (starting with `pending`) and offer action buttons to Preview CV, Download CV (PDF), and Regenerate CV so that I can evaluate and refresh my application materials directly from the card.

**Why this priority**: Essential for managing applications and inspecting/regenerating tailored CV output after creation.

**Independent Test**: Navigate to the Job Application list. Verify each card displays the `pending` status badge when applicable and features Preview, Download, and Regenerate buttons. Clicking Preview opens the tailored CV viewer for that specific Job Application ID; clicking Regenerate re-triggers the AI alignment and updates the application's stored tailored CV payload and match score.

**Acceptance Scenarios**:

1. **Given** a job application card in the list, **When** viewed by the user, **Then** it presents three action buttons (Preview CV, Download CV, Regenerate CV) and displays the current status including `pending`.
2. **Given** a job application card, **When** the user clicks "Preview CV", **Then** a preview viewer opens showing the application's specific tailored JSON Resume content.
3. **Given** a job application card, **When** the user clicks "Regenerate CV", **Then** the AI process re-analyzes the job description against the master JSON Resume and updates the tailored CV (associated with the Job Application ID) and match score without mutating the master JSON Resume.

---

### User Story 3 - Full Page Job Application Creation View (Priority: P3)

As a user, I want the Job Application creation/edit form to open as a full page view replacing the application list (with a back-arrow button to return) instead of popping up as a modal overlay, so that I have a clean, focused workspace for entering detailed job information.

**Why this priority**: Enhances usability and form workspace clarity, ensuring smooth navigation flow between the list view and form view.

**Independent Test**: Click "New Job Application". Verify the application list view is replaced by the dedicated form page and a visible back-arrow button. Clicking the back-arrow returns the user to the application list view without losing context.

**Acceptance Scenarios**:

1. **Given** the user is on the Job Application list page, **When** they click to add a new application, **Then** the list view is replaced by the full-page form view containing a back-arrow navigation button.
2. **Given** the user is on the full-page form view, **When** they click the back-arrow button, **Then** the application returns to the Job Application list view.

---

### Edge Cases

- **AI API Error or Offline State**: If the Groq AI service encounters an error or timeout during creation or regeneration, the job application is still saved with `pending` status, and an error notice is displayed with an option to retry via "Regenerate CV".
- **Empty or Partial Master JSON Resume**: If the user's master JSON Resume is empty or missing key sections (e.g. no work history), the AI engine returns only the available data fields, omitting empty properties, and provides an appropriate match score based strictly on existing data.
- **Empty AI Response Properties**: Any JSON Resume properties that have no matching data or are empty in the AI output must be removed/omitted from the stored tailored JSON structure.
- **Master Resume Protection**: Under no circumstances should the master JSON Resume file/record be modified or overwritten when tailored CVs are created, previewed, or regenerated for individual job applications.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support `pending` as the initial default status for all newly created Job Applications before moving to `applied` or subsequent statuses.
- **FR-002**: System MUST invoke an AI job-driven CV tailoring process (via `groq:cv-job-driven`) upon creation of a new Job Application, passing the user's master JSON Resume and the target Job Application details.
- **FR-003**: The AI tailoring process MUST strictly use existing data from the user's master JSON Resume and MUST NOT hallucinate, invent, or extrapolate non-existent skills, job titles, or experience.
- **FR-004**: The AI tailoring process MUST evaluate alignment between the job requirements and user profile to return a numeric `match_score` along with the tailored `json_resume`.
- **FR-005**: The generated `json_resume` MUST omit any properties that are empty, null, or unpopulated.
- **FR-006**: The system MUST persist the returned `match_score` and tailored `json_resume` in local storage associated specifically with the Job Application ID.
- **FR-007**: The system MUST NOT modify, overwrite, or mutate the user's master JSON Resume during CV generation, preview, or regeneration for job applications.
- **FR-008**: Job Application item cards MUST feature action buttons for "Preview CV", "Download CV", and "Regenerate CV".
- **FR-009**: Clicking "Preview CV" on a job application card MUST display the tailored CV data associated with that specific Job Application ID in a readable preview view.
- **FR-010**: Clicking "Regenerate CV" on a job application card MUST re-trigger the AI CV tailoring process, updating the application's stored `json_resume` and `match_score` while keeping the master JSON Resume untouched.
- **FR-011**: The Job Application form MUST be rendered as a full-page view replacing the list view instead of using a modal dialog.
- **FR-012**: The Job Application full-page form view MUST include a top-level "Back arrow" button allowing the user to navigate back to the Job Application list view.
- **FR-013**: The status options for Job Applications MUST include `pending`, `applied`, `interviewing`, `offered`, `rejected`, and `withdrawn` (or existing status set), with `pending` set as default.

### Key Entities

- **Job Application**: Represents a targeted job application record, including job title, company, job description, application status (default `pending`), match score, and attached/associated tailored JSON Resume stored by Job Application ID.
- **Master JSON Resume**: The user's master career profile adhering to the JSON Resume schema format. This profile is strictly read-only during job application CV tailoring.
- **Tailored JSON Resume**: A job-specific filtered and re-aligned subset of the Master JSON Resume generated by AI for a specific Job Application ID, omitting empty properties.
- **AI CV Tailoring Request/Response**: Payload exchanged with the Groq service containing master JSON Resume + job specs, returning `success`, `match_score`, and `json_resume`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly created Job Applications default to `pending` status upon initial creation.
- **SC-002**: AI tailored CV generation returns valid structured JSON Resume data with a `match_score` within 5 seconds under normal network conditions.
- **SC-003**: 0% hallucinated entries—100% of facts (company names, dates, skill names) in generated tailored CVs trace directly back to items in the user's master JSON Resume.
- **SC-004**: 0% mutation rate on Master JSON Resume—generating, previewing, or regenerating CVs across 100 job applications results in 0 modifications to the user's master JSON Resume file/record.
- **SC-005**: All empty properties in the AI-generated JSON Resume output are cleanly stripped out of the persisted object.
- **SC-006**: Users can navigate between the Job Application list view and the full-page form view in a single click using the back-arrow button without UI modal popups.

## Assumptions

- The Groq API key is already configured and available in the system environment/settings.
- The user has created or imported a master JSON Resume profile prior to generating targeted CV applications.
- Download CV in PDF button UI will be visible on the card, while interactive PDF generation execution can be hooked into existing PDF printing utilities or stubbed for future expansion if Playwright PDF renderer is not fully linked in v1.
