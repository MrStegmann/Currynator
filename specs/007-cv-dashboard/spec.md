# Feature Specification: CV Dashboard View

**Feature Branch**: `007-cv-dashboard`

**Created**: 2026-09-12

**Status**: Draft

**Input**: User description: "Implement a new CV Dashboard view that allows users to create and manage application-focused CVs separately from their main profile. Navigation via main navbar. Responsive grid layout displaying 3 columns on screens wider than 675px, and 1 column on screens under 675px. Empty state warning message if no CVs exist, or grid of CV item cards with vacancy title, description snippet, creation/update timestamps, and action icons (View, Edit, Delete with custom confirmation modal)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navbar Navigation & Empty Dashboard State (Priority: P1)

As a job applicant who hasn't created any custom CVs yet, I want to navigate to the CV Dashboard from the main navigation bar and see a clear empty state with an invitation to create my first CV so that I understand where to manage my vacancy-specific resumes.

**Why this priority**: Navigation and empty state represent the baseline entry point to the feature when a user opens the CV Dashboard for the first time.

**Independent Test**: Can be tested independently by clicking the "CV Dashboard" navigation link when no CV data exists, confirming view switching and verifying the empty state message and action button.

**Acceptance Scenarios**:

1. **Given** the user is anywhere in the application, **When** they click the "CV Dashboard" link in the main navbar, **Then** the active view switches to the CV Dashboard view.
2. **Given** the user has zero stored application CVs, **When** the CV Dashboard view is displayed, **Then** a centered empty-state container appears showing the text *"No has creado todavía ningún curriculum personalizado para ninguna vacante. Empieza ahora pulsando en el botón de abajo."* and a button labeled *"Crear nuevo CV"*.
3. **Given** the empty dashboard state is displayed, **When** the user clicks the *"Crear nuevo CV"* button, **Then** the action handler executes without error.

---

### User Story 2 - Application CV Grid & Responsive Display (Priority: P2)

As a job applicant with multiple tailored CVs, I want to see all my created CV items displayed in a responsive grid layout so that I can easily browse my saved application-focused CVs across different screen sizes.

**Why this priority**: Displaying stored CV cards in a responsive grid allows users to view and organize their tailored resumes efficiently on both mobile and desktop screens.

**Independent Test**: Can be tested independently by loading mock CV data and resizing the viewport above and below 675px width to confirm column adjustments and card details.

**Acceptance Scenarios**:

1. **Given** the user has one or more application CVs, **When** viewing the CV Dashboard on a screen width greater than 675px, **Then** the CV cards are arranged in a 3-column grid layout.
2. **Given** the user has one or more application CVs, **When** viewing the CV Dashboard on a screen width of 675px or less, **Then** the CV cards are arranged in a single-column layout.
3. **Given** a CV card is rendered in the grid, **Then** it displays the target vacancy title, job description snippet, creation timestamp, and last updated timestamp.

---

### User Story 3 - CV Item Card Actions & Custom Delete Confirmation (Priority: P3)

As a job applicant managing my saved CVs, I want to access quick actions (View, Edit, Delete) on each CV card and receive a clear custom modal prompt when requesting deletion so that I don't accidentally remove a tailored CV.

**Why this priority**: Card action icons enable managing individual items safely with explicit confirmation before removal.

**Independent Test**: Can be tested independently by clicking action icons on a CV card, verifying action handlers, and confirming that deletion requires confirmation via a custom modal dialog (without using browser-native dialogs).

**Acceptance Scenarios**:

1. **Given** a CV card in the grid, **When** the user clicks the View (Eye) or Edit (Pencil) icon button, **Then** the corresponding action handler triggers cleanly.
2. **Given** a CV card in the grid, **When** the user clicks the Delete (Trash) icon button, **Then** a custom modal confirmation dialog opens asking for confirmation before proceeding with deletion.
3. **Given** the delete confirmation modal is displayed, **When** the user confirms deletion, **Then** the selected CV is removed from the dashboard and the layout updates.

---

### Edge Cases

- **Screen Resize Across Breakpoint**: What happens when the viewport is resized dynamically across 675px while viewing the CV Dashboard? The layout should seamlessly transition between 3 columns and 1 column without layout distortion or content reflow glitches.
- **Deleting the Last CV Item**: What happens when the user deletes the only remaining CV card on the dashboard? The dashboard view must immediately transition from the grid view to the centered empty state.
- **Truncation of Long Titles & Descriptions**: What happens when target vacancy titles or job description snippets are extremely long? Text snippets must gracefully wrap or truncate to prevent card overflow while maintaining visual consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Main navigation bar MUST include a link labeled "CV Dashboard".
- **FR-002**: Clicking the "CV Dashboard" navbar link MUST update the application active view to display the CV Dashboard component.
- **FR-003**: System MUST display an empty state view whenever zero application CVs exist.
- **FR-004**: Empty state view MUST display a centered container with the text *"No has creado todavía ningún curriculum personalizado para ninguna vacante. Empieza ahora pulsando en el botón de abajo."* and an action button labeled *"Crear nuevo CV"*.
- **FR-005**: System MUST display a grid layout of CV item cards when one or more application CVs exist.
- **FR-006**: CV grid layout MUST render 3 columns on viewports wider than 675px and 1 column on viewports 675px or narrower.
- **FR-007**: Each CV item card MUST display the target vacancy title, job description snippet, creation timestamp, and last updated timestamp.
- **FR-008**: Each CV item card MUST provide actionable icons for View (Eye icon), Edit (Pencil icon), and Delete (Trash icon).
- **FR-009**: Clicking the Delete icon MUST trigger a custom deletion confirmation modal notification.
- **FR-010**: Custom deletion confirmation modal MUST NOT use native browser dialogs (`window.alert` or `window.confirm`).
- **FR-011**: Confirming deletion in the modal MUST remove the targeted CV item from state and update the view immediately.
- **FR-012**: System MUST include initial mock CV data supporting both empty and populated state verification.

### Key Entities

- **Custom Application CV**: Represents an application-tailored CV distinct from the main master profile. Attributes include unique identifier, target vacancy title, job description snippet, creation timestamp, and last updated timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of navbar navigation attempts cleanly switch active view to the CV Dashboard within 100 milliseconds.
- **SC-002**: Empty state container and required guidance text render centered whenever CV count is zero.
- **SC-003**: Viewport breakpoint switching accurately displays 3 columns at >675px and 1 column at <=675px with zero layout breakages across tested screen widths.
- **SC-004**: All CV item cards reliably display all required fields (title, snippet, creation date, updated date) and action icons.
- **SC-005**: 100% of delete requests trigger a custom modal confirmation dialog without invoking browser-native alert or confirm popups.

## Assumptions

- **Form Creation Scope**: The creation/editing forms for CVs are out of scope for this feature specification; action handlers for create, view, and edit act as placeholders.
- **Data Source**: Application CVs are stored in local state/storage following standard application entities pattern.
- **Design Alignment**: Modal and dashboard components follow existing design guidelines (`DESIGN.md`) and styling patterns.
