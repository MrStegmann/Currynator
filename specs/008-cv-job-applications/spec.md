# Feature Specification: CV Job Application Management

**Feature Branch**: `008-cv-job-applications`

**Created**: 2026-09-13

**Status**: Draft

**Input**: User description: "Implement a local-first CRUD workflow for CV Job Applications within the Electron application..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create CV Job Application (Priority: P1)

As a job applicant using the application, I want to create and save new job applications from the CV Dashboard using a top-right floating action button, so that I can track all my targeted job applications locally.

**Why this priority**: Core entry point for managing job applications. Without application creation, no tracking or management can take place.

**Independent Test**: Click the floating action button on the CV Dashboard, fill in job application details in the modal/view, and submit. Verify the newly created job application appears immediately on the CV Dashboard.

**Acceptance Scenarios**:

1. **Given** the user is on the CV Dashboard, **When** they click the top-right floating action button, **Then** a blank Job Application creation form is presented.
2. **Given** the user is in the Job Application form in Creation Mode, **When** they enter required fields (`title`, `jobDescription`, `jobRequirement`) and submit, **Then** the application is saved locally with default status `applied` and displayed as a card on the dashboard.

---

### User Story 2 - Track and Update Application Status (Priority: P1)

As a job applicant, I want to see the status of each job application on its card and advance its status with a single fast-status progression action, so that I can easily track my application pipeline progress.

**Why this priority**: Primary workflow value proposition: tracking status changes efficiently across stages (`applied` ➔ `called` ➔ `interview` ➔ `techTest` ➔ `rejected` ➔ `gotTheJob`).

**Independent Test**: Click the fast-status progression button on a card and observe the status badge updating through the predefined pipeline stages.

**Acceptance Scenarios**:

1. **Given** a job application card with status `applied`, **When** the user clicks the fast-status progression button, **Then** the status advances to `called` and the top-left status badge updates accordingly.
2. **Given** a job application card at a terminal status (`rejected` or `gotTheJob`), **When** the user clicks the fast-status progression button, **Then** the status caps or loops back according to defined workflow rules without causing error.

---

### User Story 3 - View, Edit, and Delete Job Applications (Priority: P2)

As a job applicant, I want to view details, edit existing entries, and delete unwanted job applications directly from their dashboard cards, so that my application list remains clean and up-to-date.

**Why this priority**: Crucial for maintenance and lifecycle management of saved job applications.

**Independent Test**: Click Edit on a card to hydrate and modify fields; click Delete to remove a card; click View to inspect complete job requirements and descriptions.

**Acceptance Scenarios**:

1. **Given** an existing application card, **When** the user clicks Edit, **Then** the form opens pre-hydrated with all existing field values.
2. **Given** an existing application card, **When** the user confirms deletion, **Then** the item is permanently removed from local storage and disappears from the dashboard.

---

### Edge Cases

- **Empty Dashboard**: What happens when no job applications exist yet? A clear empty state prompt is displayed guiding the user to create their first application via the floating action button.
- **Incomplete Required Fields**: How does the system handle submission without required fields (`title`, `jobDescription`, `jobRequirement`)? Form validation prevents submission and highlights missing required input.
- **Long Text Content**: How does the UI handle long job descriptions or requirement listings on cards? Cards visually truncate long descriptions gracefully while keeping full content accessible in View mode.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a top-right floating action button (FAB) on the CV Dashboard to trigger job application creation.
- **FR-002**: System MUST allow users to input job application details including title, job description, company description, job requirements, and company website URL.
- **FR-003**: System MUST enforce required fields (`title`, `jobDescription`, `jobRequirement`) before saving a job application.
- **FR-004**: System MUST assign an initial default status of `applied` and auto-generate `id`, `created_at`, and `updated_at` timestamps upon creation.
- **FR-005**: System MUST display a status badge on the top-left corner of each job application card representing its current status (`applied`, `called`, `interview`, `techTest`, `rejected`, `gotTheJob`).
- **FR-006**: System MUST provide a fast-status progression button on each card allowing single-click progression through the status lifecycle (`applied` ➔ `called` ➔ `interview` ➔ `techTest` ➔ `rejected` ➔ `gotTheJob`).
- **FR-007**: System MUST support Edit mode, opening the form pre-hydrated with existing job application data and updating the `updated_at` timestamp upon saving.
- **FR-008**: System MUST support deletion of job application records from persistent local storage.
- **FR-009**: System MUST persist all job application data locally in complete isolation from other domain models.
- **FR-010**: System MUST replace mock dashboard card data with real application state retrieved from persistent storage.

### Key Entities

- **JobApplication**:
  - `id` (string, required): Unique identifier (UUID or timestamp).
  - `title` (string, required): Title or name of the position.
  - `jobDescription` (string, required): Full description of the role.
  - `companyDescription` (string, optional): Background information about the hiring company.
  - `jobRequirement` (string, required): Qualifications and requirements for the role.
  - `companyWebsiteUrl` (string, optional): Web link to company or posting.
  - `created_at` (string, required): ISO creation timestamp.
  - `updated_at` (string, required): ISO last modified timestamp.
  - `status` (enum/union, required): Current pipeline state (`applied` | `called` | `interview` | `techTest` | `rejected` | `gotTheJob`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and save a new job application in under 30 seconds.
- **SC-002**: Status updates performed via the fast-status progression button reflect instantly on the UI (< 100ms response).
- **SC-003**: 100% of job application operations (create, read, update, delete) persist across application restarts with full offline isolation.
- **SC-004**: Dashboard cards display accurate, live data without reliance on mock data placeholders.

## Assumptions

- Application data is stored strictly in local isolation on the user's desktop environment.
- The workflow sequence for status progression follows standard recruitment stages (`applied` ➔ `called` ➔ `interview` ➔ `techTest` ➔ `rejected` ➔ `gotTheJob`).
- Form validation requires at minimum `title`, `jobDescription`, and `jobRequirement` to ensure valid entries.
