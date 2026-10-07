# Feature Specification: Newest-First Chronological Data Sorting & GitHub Project Keyword Matching

**Feature Branch**: `016-newest-sorting-data`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "The task is to sort the data by the must newest first always in each kind of data. In addition, when a CV is generated, this sort shall applied too; and the projects selected must be preselected by the projects fetched with GitHub, selecting the ones that match language keywords. What To Do: Implement a universal sorting logic that orders every category of data by newest first. Update the CV generation module to respect and apply this newest-first chronological sorting. Integrate a GitHub API or fetch utility to retrieve user projects. Implement a matching filter to automatically preselect fetched GitHub projects based on relevant language keywords."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Universal Chronological Sorting (Newest First) Across All Data (Priority: P1)

As a user viewing and managing my professional resume data across the application, I want all entries within every data category (work experiences, education, certificates, and projects) to be automatically ordered from newest to oldest by default, so that my most recent achievements and positions are immediately prominent.

**Why this priority**: Chronological consistency (newest first) is the standard expectation for professional portfolios and resumes. Presenting the latest experience first ensures immediate relevance and clarity.

**Independent Test**: Populate work experiences, education entries, certificates, and projects with varying dates and ongoing/current flags; verify all lists in the UI display entries starting with current/most recent items down to older entries.

**Acceptance Scenarios**:

1. **Given** multiple work experiences with various start and end dates, **When** viewed on the profile or home view, **Then** they appear sorted with the most recent roles first (ongoing/current roles at the top, followed by descending end dates).
2. **Given** education history entries and certificates with graduation/completion dates, **When** displayed, **Then** they are ordered descending from the most recent date to oldest.
3. **Given** data items with partial dates (e.g. "2024" or "2024-05") or missing dates, **When** sorting is applied, **Then** partial dates are accurately ordered and undated entries are placed gracefully at the end without errors.

---

### User Story 2 - Chronologically Ordered CV Generation (Priority: P1)

As a job applicant generating a customized CV for an application, I want the generated CV preview and exported document to strictly follow newest-first ordering across all sections, so that hiring managers read my most recent qualifications first.

**Why this priority**: A generated CV must reflect professional formatting standards with strict chronological consistency across work experience, education, certificates, and projects.

**Independent Test**: Generate a CV from profile data that contains out-of-order or randomly entered records; verify the resulting CV sections render all items in descending chronological order (newest first).

**Acceptance Scenarios**:

1. **Given** a user triggers CV generation for a target job application, **When** the CV document and preview are assembled, **Then** work experience entries are listed in descending order starting from the latest.
2. **Given** education, certifications, and project sections in the generated CV, **When** rendered, **Then** each section maintains strict newest-first ordering.

---

### User Story 3 - Dynamic GitHub Project Fetching and Keyword Preselection (Priority: P2)

As a user tailoring a CV for a specific job application or technology stack, I want the CV generator to fetch my GitHub repositories and automatically preselect projects whose programming languages match the target job's language keywords, so that I save time choosing relevant technical portfolio highlights.

**Why this priority**: Automates the discovery and selection of technical proof points tailored to the job opening, reducing manual effort and improving CV targeting.

**Independent Test**: Provide a target job description or skill profile mentioning specific language keywords (e.g., "TypeScript", "Python"); trigger the CV project selection workflow; verify GitHub projects are fetched and repositories featuring those primary languages/topics are automatically preselected in the selection list.

**Acceptance Scenarios**:

1. **Given** a user initiates the CV creation/generator workflow with target language keywords, **When** projects are fetched from GitHub, **Then** repositories whose primary languages or tags match the target keywords are automatically preselected.
2. **Given** projects have been auto-preselected, **When** the user reviews the project selection step, **Then** the user can freely toggle, check, or uncheck any project prior to final CV compilation.
3. **Given** no fetched GitHub projects match the target keywords, **When** the project selection step loads, **Then** the user is notified that no direct keyword matches were found and can manually select from their full project list.

---

### Edge Cases

- **Ongoing / Present Entries**: Work experiences or projects with an empty end date or marked as "current/present" are treated as the newest entries and placed before completed entries.
- **Identical Dates**: When multiple entries share identical start and end dates, a deterministic secondary sort (e.g., creation order or title) preserves stable ordering.
- **GitHub Network Failure or Offline Mode**: If GitHub project fetching encounters network failure, rate limiting, or invalid credentials, the system falls back to previously cached local projects and displays a non-blocking informational toast/alert.
- **Keyword Casing and Synonyms**: Matching logic accounts for case-insensitivity and common language variations (e.g., `JS` / `JavaScript`, `TS` / `TypeScript`, `Py` / `Python`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST sort all profile data categories (work experience, education, certifications, and projects) in descending chronological order (newest first) by default across all views.
- **FR-002**: System MUST evaluate ongoing/current roles (where end date is unspecified or indicates current) as newer than completed historical roles.
- **FR-003**: System MUST robustly parse and sort ISO dates, partial dates (e.g. `YYYY`, `YYYY-MM`), and place undated items at the end of sorted collections.
- **FR-004**: System MUST apply newest-first chronological sorting across all relevant sections during CV generation and document rendering.
- **FR-005**: System MUST dynamically retrieve user GitHub repositories during the CV generation and customization workflow.
- **FR-006**: System MUST evaluate repository programming languages and topics against target job language keywords.
- **FR-007**: System MUST automatically mark matching GitHub projects as preselected in the CV generation project selection step.
- **FR-008**: System MUST allow users to inspect, override, add, or remove project selections before finalizing CV generation.
- **FR-009**: System MUST display an informative status and allow manual project selection if no repositories match the target language keywords or if project fetching fails.

### Key Entities

- **Chronological Entry**: Any resume entity (work, education, certificate, project) possessing date boundaries (`startDate`, `endDate`, `date`, or ongoing status) utilized for chronological sorting.
- **GitHub Repository**: A remote project entity retrieved via the GitHub API, characterized by repository name, description, primary language, language breakdown/topics, stars, updated timestamp, and repository URL.
- **Language Keyword Filter**: A set of normalized language keywords derived from a job description or skill profile used to score and preselect relevant repositories for a CV.
- **CV Selection State**: The interactive state during CV generation capturing selected experiences, education, and preselected GitHub projects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of data lists in the UI and generated CVs consistently display newest/current items first without manual user reordering.
- **SC-002**: Generated CVs render all chronological sections in descending order within 100ms of generation.
- **SC-003**: 100% of fetched GitHub projects matching specified language keywords are automatically marked as preselected upon entering the project selection step.
- **SC-004**: Users can complete project selection and customization for a tailored CV in under 30 seconds.
- **SC-005**: Project fetching and keyword matching operations execute with zero unhandled exceptions when encountering missing dates, offline network states, or empty repositories.

## Assumptions

- User has previously configured or provided a GitHub personal access token (or public username) for repository fetching, or local project data is used as fallback.
- Target language keywords can be extracted from the target job application description or selected skill keywords in the CV generator workflow.
- Chronological sorting applies universally across resume sections while preserving user-defined manual overrides if explicitly requested in custom templates.
