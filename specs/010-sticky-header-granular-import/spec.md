# Feature Specification: Sticky Header and Granular LinkedIn Import

**Feature Branch**: `010-sticky-header-granular-import`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Refactor: Header and Import. The header need a change; by now the header get out of the view when the user scrolls; the header must be completly sticky and never get out of the viewport. The import by now show a message to replace or keep and merge all the content; the import must ask for each section if the user want to replace or keep & merge so the user CAN decide which section to replace or not. Also, there must be 3 options: Replace, Keep original, Merge; each option with a description explained what does each one. What To Do: Sticky Header: When the user scrolls down, if can, the header must still stand visible. Linkedin Import files: When the user import a ZIP and the are original data inside Basic, the app shall ask if the user wants to Replace, Keep Original or Merge data for Basic section. (This must be happened for each section individual: Work, Education, Certificates, etc). Linkedin Import for Onboarding: When the user opens for the first time the application and does not have data stored; the option of Import Linkedin ZIP must be present as an alternative option."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Always-Visible Sticky Application Header (Priority: P1)

As a user navigating through long pages or scrolling resume content, I want the application header to stay pinned to the top of the viewport at all times so that key controls and navigation elements are immediately accessible without scrolling back up.

**Why this priority**: Essential UX improvement that impacts every user interaction across all screens where content overflows vertically.

**Independent Test**: Scroll down any main content page that exceeds viewport height and verify the application header remains visible at the top edge of the window.

**Acceptance Scenarios**:

1. **Given** the user is viewing any screen in the application with scrollable content, **When** the user scrolls down vertically, **Then** the header MUST remain fixed at the top of the viewport without clipping or disappearing.
2. **Given** the header is fixed in position, **When** the content area scrolls beneath it, **Then** the main content MUST render behind/under the header without obscuring header items or obscuring click targets within the header.

---

### User Story 2 - Granular Section-by-Section LinkedIn Data Import Options (Priority: P1)

As a user importing a LinkedIn data archive (ZIP) who already has existing profile data, I want to choose independently for each profile section (Basic Info, Work Experience, Education, Certificates, Skills, Languages, Projects, etc.) whether to Replace, Keep Original, or Merge the data, with clear descriptions explaining what each option does.

**Why this priority**: Prevents accidental data destruction and gives users fine-grained control when updating specific parts of their resume profile from LinkedIn archives.

**Independent Test**: Trigger a LinkedIn ZIP import while existing profile data is present. Verify that a prompt appears for each section containing conflicting data, presenting 3 explicit choices (Replace, Keep Original, Merge) with descriptions, and applying the chosen action per section upon confirmation.

**Acceptance Scenarios**:

1. **Given** existing data in one or more resume sections and a selected LinkedIn ZIP archive, **When** the user initiates the import process, **Then** the application MUST evaluate existing data against imported data section by section.
2. **Given** a section has existing data, **When** presenting the import resolution dialog for that section, **Then** the system MUST display three explicit choices for that specific section:
   - **Replace**: Overwrites existing section data completely with the imported section data.
   - **Keep Original**: Retains existing section data and ignores the imported section data.
   - **Merge**: Combines existing section data with imported section data without deleting original items.
3. **Given** the resolution choices are displayed, **When** viewing each option, **Then** each option MUST present an accompanying explanatory description detailing its exact effect.
4. **Given** the user configures conflict resolution choices across sections, **When** the user confirms the import action, **Then** each section MUST be updated according to its individually selected resolution option.

---

### User Story 3 - LinkedIn Archive Import as First-Time Onboarding Alternative (Priority: P2)

As a new user launching the application for the first time without any stored profile data, I want an option to import a LinkedIn ZIP archive directly during onboarding so that I can set up my complete profile quickly without manual data entry.

**Why this priority**: Streamlines initial onboarding for users migrating existing LinkedIn data, significantly reducing friction for first-time application setup.

**Independent Test**: Launch the app with an empty data store, verify the Onboarding screen displays "Import LinkedIn ZIP" as an alternative choice alongside manual setup, select it, upload a valid ZIP, and confirm that the profile is populated immediately.

**Acceptance Scenarios**:

1. **Given** a user opening the application for the first time with no stored profile data, **When** the onboarding screen renders, **Then** an "Import LinkedIn ZIP" option MUST be prominently available alongside manual creation.
2. **Given** a user selects "Import LinkedIn ZIP" on the onboarding screen, **When** a valid LinkedIn ZIP archive is uploaded, **Then** all extracted sections MUST be populated into the user's profile and onboarding MUST complete successfully.
3. **Given** an empty initial state, **When** performing an onboarding LinkedIn import, **Then** section conflict resolution dialogs MAY be bypassed automatically since no original data exists to conflict.

---

### Edge Cases

- **Empty Sections in Import File**: What happens when an imported ZIP file contains no data for a specific section (e.g., no Certificates)? The system skips conflict resolution for that empty imported section and retains existing data.
- **Corrupted or Invalid ZIP File during Onboarding**: How does the system handle an invalid file during first-time onboarding? Display an informative error message and return the user to the onboarding selection state without leaving partial data.
- **Identical / Duplicate Entries on Merge**: What happens when choosing "Merge" for a section containing identical items? The system deduplicates items based on primary properties (e.g., matching company + job title + start date for Work) to avoid duplicate entries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application header MUST remain sticky and visible at the top of the viewport across all scrollable views.
- **FR-002**: The layout MUST ensure content scrolling occurs underneath the sticky header without header occlusion or layout shift.
- **FR-003**: When importing a LinkedIn ZIP archive while existing profile data exists, the application MUST process data resolution on a per-section basis (including Basic Info, Work Experience, Education, Certificates, Skills, Languages, Projects, and References).
- **FR-004**: For each section with existing data, the application MUST provide three explicit choices: Replace, Keep Original, and Merge.
- **FR-005**: Each of the three resolution options MUST include an intuitive, user-facing description explaining its behavior before the user confirms.
- **FR-006**: The "Replace" option MUST overwrite the existing section data with the imported data for that specific section.
- **FR-007**: The "Keep Original" option MUST preserve the existing section data unchanged and discard the imported data for that specific section.
- **FR-008**: The "Merge" option MUST combine existing items and imported items for that specific section, avoiding unnecessary duplication.
- **FR-009**: The first-time application onboarding screen MUST present a clear alternative option to import data via LinkedIn ZIP file.
- **FR-010**: Selecting the LinkedIn ZIP import during onboarding MUST parse the uploaded archive, initialize the profile store, and transition the user out of the onboarding workflow into the main application.

### Key Entities

- **Resume Section**: A distinct grouping of profile data adhering to the JSON Resume schema (e.g., Basics, Work, Education, Certificates, Skills, Languages, Projects, References).
- **Import Conflict Decision**: A user choice for a specific Resume Section specifying the resolution strategy (`replace`, `keep_original`, `merge`).
- **Import Session**: The state and payload of an in-progress file import containing parsed section data and chosen resolution strategies per section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application header remains 100% visible at top viewport position (0px top offset) regardless of page scroll depth.
- **SC-002**: 100% of profile sections with existing data allow independent resolution selection during LinkedIn ZIP import.
- **SC-003**: 0% loss of unselected sections' data during granular section import (e.g., choosing "Replace" on Work experience leaves Education untouched).
- **SC-004**: First-time users can complete full profile setup via LinkedIn ZIP import in under 1 minute during onboarding.

## Assumptions

- **Data Schema**: All profile sections map cleanly to the JSON Resume standard as defined in the project constitution.
- **Import Format**: LinkedIn export ZIP archives follow the standard LinkedIn data export structure (containing relevant CSV files).
- **Viewport Layout**: The main application layout utilizes top-level container scrolling where sticky header positioning can be cleanly enforced.
