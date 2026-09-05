# Feature Specification: Header, Sidebar Navigation, and Home Page Resume Editor

**Feature Branch**: `[003-header-sidebar-nav]`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description updated: 
Create Home page/view. Home page MUST have 7 articles with an h2 for each article (Basics, Work, Education, Certificates, Skills, Languages AND References), that shows the content of the JSON Resume with the same property name.
User MUST be able to add or edit any field from Basic (NEVER able to left empty mandatory one: name, email, label). Each section MUST have and EDIT button mode (pencil icon) that switch between read-only to edit fields (Edit mode is independet for each article).
For Work, Education, Certificate, Skills, Languages AND References, user can add, update or delete information.
Given user in Home in the application AND in Edit mode, When click over a button to add new item, then Open a modal Form with fields, save and cancel button.
Given a user in Home in the application AND in edit mode AND in modal Form, When user type valid data in each field for the specific article AND click save, Then a new entry for this article is successfully added to the list AND modal form closes.
Given a user in Home in the application AND in edit mode AND in modal Form, When user type invalid data in each field for the specific article AND click save, Then show a error notification AND not closes open modal AND not save anything.
In Work AND Education, endDate must be able to be a DATE and String "Currently".
In Work, name, position, startDate and endDate are MANDATORY.
In Education, institution, area, startDate AND endDate are MANDATORY.
In certificates, name, date, issuer are MANDATORY
In Skills, name and, at least, 1 keyword are MANDATORY
In languages, language is MANDATORY
In references, name and reference are MANDATORY

## Clarifications
### Session 2026-09-05
- Q: How should the user save changes when editing a non-array section like Basics? → A: A dedicated "Save" button appears within the section when in Edit mode (clear user intent).
- Q: How should the UI represent the "Currently" option for the `endDate` field in Work and Education? → A: A checkbox labeled "I currently work/study here" that hides or disables the end date input.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Sidebar Navigation (Priority: P1)

As a user, I want to click the hamburger menu button in the header so that I can open or close the sidebar navigation to access different parts of the application.

**Why this priority**: Core navigation requirement to allow users to move through the application.

**Independent Test**: Can be fully tested by clicking the hamburger menu and observing the sidebar appearing and disappearing.

**Acceptance Scenarios**:

1. **Given** the user is in Home and the RightNavBar is not visible, **When** they click on the hamburger menu button, **Then** the RightNavBar is displayed.
2. **Given** the user is in Home and the RightNavBar is visible, **When** they click on the hamburger menu button, **Then** the RightNavBar is hidden.

---

### User Story 2 - View Current Context (Priority: P1)

As a user, I want to see the name of the current view in the header and have the active link highlighted in the sidebar.

**Why this priority**: Essential for user orientation and navigation context.

**Independent Test**: Can be tested by navigating to the Home view and observing the header title and sidebar link styling.

**Acceptance Scenarios**:

1. **Given** the user is in Home and the RightNavBar is visible, **When** the user looks at the application, **Then** the "Home" link in the sidebar is bold and highlighted, AND the header title displays "Home".

---

### User Story 3 - View Resume Sections on Home Page (Priority: P1)

As a user, I want to see all 7 sections of my JSON resume on the Home page (Basics, Work, Education, Certificates, Skills, Languages, References), so that I can review my information.

**Why this priority**: Core functionality of the Home view.

**Independent Test**: Navigate to Home and verify that all 7 sections exist, each with an `h2` heading and displaying the current JSON resume data.

**Acceptance Scenarios**:

1. **Given** the user is in the Home view, **When** they look at the page content, **Then** they see 7 distinct articles (Basics, Work, Education, Certificates, Skills, Languages, References) with appropriate data displayed.

---

### User Story 4 - Edit Section Mode (Priority: P1)

As a user, I want to toggle an edit mode for each individual section using a pencil icon, so that I can modify the information without affecting other sections.

**Why this priority**: Editing functionality is required to manage the resume data.

**Independent Test**: Click the pencil icon on any section and verify that only that section switches to edit mode.

**Acceptance Scenarios**:

1. **Given** the user is in Home, **When** they click the pencil icon for a specific article, **Then** that article switches from read-only to edit mode.
2. **Given** the user is in Home and an article is in edit mode, **When** they click the pencil icon again, **Then** that article switches back to read-only mode.

---

### User Story 5 - Add/Update/Delete Items in Array Sections (Priority: P2)

As a user, I want to add new entries, update existing ones, or delete entries in sections that support multiple items (Work, Education, Certificates, Skills, Languages, References), so that I can manage my history.

**Why this priority**: Required for full CRUD capability on array-based resume data.

**Independent Test**: Enter edit mode in the Work section, add a new job, modify it, and delete it.

**Acceptance Scenarios**:

1. **Given** the user is in Home in Edit mode for a section, **When** they click the button to add a new item, **Then** a modal form opens with relevant fields and Save/Cancel buttons.
2. **Given** the user is in the modal form, **When** they type valid data in all fields and click Save, **Then** a new entry is added to the list and the modal closes.
3. **Given** the user is in the modal form, **When** they type invalid data (e.g. missing a mandatory field) and click Save, **Then** an error notification is shown, the modal remains open, and nothing is saved.

---

### User Story 6 - Edit Basics Section (Priority: P1)

As a user, I want to edit my Basic information directly, ensuring I provide all mandatory fields, so that my core identity is accurate.

**Why this priority**: Core identity data is essential for a resume.

**Independent Test**: Attempt to edit the Basics section and save with missing mandatory fields.

**Acceptance Scenarios**:

1. **Given** the user is in Edit mode for Basics, **When** they attempt to save using the dedicated "Save" button with an empty name, email, or label, **Then** an error is shown and the save is prevented.
2. **Given** the user is in Edit mode for Basics, **When** they edit fields and click the dedicated "Save" button, **Then** changes are persisted and the section returns to read-only mode.

### Edge Cases

- What happens if the user leaves the page while a section is in edit mode with unsaved changes?
- How are dates validated when the user selects "Currently" for an `endDate`?

## Requirements *(mandatory)*

### Functional Requirements

#### Header & Sidebar
- **FR-001**: System MUST display a Header with minimum necessary height.
- **FR-002**: System MUST display a hamburger menu button aligned left in the Header.
- **FR-003**: System MUST display an `h1` with the current view name aligned right in the Header.
- **FR-004**: System MUST display a left-aligned aside dropdown (RightNavBar) with exactly one option ("Home").
- **FR-005**: Header and RightNavBar MUST be reusable components.
- **FR-006**: System MUST toggle RightNavBar visibility via the hamburger menu button.
- **FR-007**: System MUST highlight the active view link in RightNavBar.

#### Home Page & Sections
- **FR-008**: Home view MUST display 7 articles: Basics, Work, Education, Certificates, Skills, Languages, References.
- **FR-009**: Each article MUST have an `h2` heading and display content mapped from the JSON Resume property of the same name.
- **FR-010**: Each article MUST have an independent "Edit" button mode (pencil icon) that toggles between read-only and edit states.

#### Data Validation & Editing
- **FR-011**: Basics section MUST NOT allow saving if `name`, `email`, or `label` are empty.
- **FR-012**: Work, Education, Certificates, Skills, Languages, and References sections MUST allow adding, updating, and deleting entries.
- **FR-013**: Adding a new item in Edit mode MUST open a modal Form with fields, Save, and Cancel buttons.
- **FR-014**: Validating a modal form on Save MUST close the modal and append the item if valid.
- **FR-015**: Invalidating a modal form on Save MUST show an error notification, keep the modal open, and prevent saving.
- **FR-016**: For Work and Education sections, `endDate` MUST accept either a Date or the string "Currently" (represented in the UI by a checkbox labeled "I currently work/study here" that disables the end date input).
- **FR-017**: Mandatory fields for Work: `name`, `position`, `startDate`, `endDate`.
- **FR-018**: Mandatory fields for Education: `institution`, `area`, `startDate`, `endDate`.
- **FR-019**: Mandatory fields for Certificates: `name`, `date`, `issuer`.
- **FR-020**: Mandatory fields for Skills: `name` and at least 1 `keyword`.
- **FR-021**: Mandatory fields for Languages: `language`.
- **FR-022**: Mandatory fields for References: `name`, `reference`.

### Key Entities

- **JSON Resume Object**: The overarching data structure containing all resume properties.
- **Article/Section**: Represents a logical grouping of data (e.g., Basics or Work) with read/edit states.
- **Modal Form**: The UI component for inputting and validating new array entries (Work, Education, etc.).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of clicks on the hamburger menu button successfully toggle the sidebar state.
- **SC-002**: 100% of mandatory field validations correctly block saving and display an error notification.
- **SC-003**: 100% of articles can independently toggle edit mode without affecting the state of other articles.
- **SC-004**: Users can successfully add, update, and delete entries in all array-based sections, verified by the updated JSON Resume output.

## Assumptions

- The JSON Resume format provided in the project's constitution (`constitution.md`) will serve as the exact schema for these sections.
- "RightNavBar" refers to the left-aligned sidebar menu.
- A global or localized form validation library (e.g., Zod with React Hook Form) will be used to enforce mandatory fields and date/"Currently" types, as standard in modern React apps.
