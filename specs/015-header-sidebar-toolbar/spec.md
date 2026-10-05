# Feature Specification: Header, Sidebar, and Dynamic Toolbar

**Feature Branch**: `015-header-sidebar-toolbar`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "Side navbar, header, and toolbar. Remove the burger menu button from the header for maximum window size. Make side navbar always visible in maximum window size. Reorder navigation links to Home, Projects, CV Dashboard. Implement dynamic right-side toolbar with view-specific action buttons (Home: Import Linkedin CSV, CV Dashboard: New Apply, Projects: Sync and Score projects). Configure application window to launch maximized by default."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pinned Navigation and Maximized Layout (Priority: P1)

As a user opening Currynator on a desktop screen, I want the application to automatically start maximized with the left-hand navigation sidebar pinned open and without redundant toggle controls, so that I can immediately access all core application sections without unnecessary clicks.

**Why this priority**: Efficient screen space utilization and frictionless navigation form the primary visual layout foundation of the desktop experience.

**Independent Test**: Launch the application from startup; verify the window opens in maximized state, the sidebar is visible by default along the left edge, no burger toggle button is visible in the header at maximized/large screen size, and the navigation links appear strictly in the order: Home, Projects, CV Dashboard.

**Acceptance Scenarios**:

1. **Given** the application is started from desktop, **When** the main window initializes, **Then** it automatically opens in maximized window mode.
2. **Given** the application is running in maximized window mode, **When** viewing the header bar, **Then** the sidebar toggle menu (burger button) is hidden from the header.
3. **Given** the application is in maximized window mode, **When** viewing the left sidebar, **Then** the navigation bar is permanently pinned and visible with items listed in exact sequence: Home, Projects, and CV Dashboard.
4. **Given** the application is in a non-maximized or constrained viewport size, **When** the user resizes the window down, **Then** responsive fallback controls allow toggling or collapsing the sidebar appropriately.

---

### User Story 2 - Contextual Dynamic Right-Side Toolbar (Priority: P2)

As a user navigating across different application views (Home, Projects, CV Dashboard), I want a dedicated action toolbar on the right side of the interface that automatically updates its action buttons to match the active view, so that the most relevant workflows are always directly accessible in a consistent location.

**Why this priority**: Consolidates primary view actions into an intuitive, consistent toolbar location rather than scattering action buttons across different page areas.

**Independent Test**: Navigate sequentially between Home, CV Dashboard, and Projects views; verify the right toolbar immediately updates to display "Import LinkedIn CSV" on Home, "New Apply" on CV Dashboard, and "Sync Projects" / "Score Projects" on Projects view, and clicking each button triggers its respective feature workflow.

**Acceptance Scenarios**:

1. **Given** the user is on the "Home" view, **When** viewing the right-side toolbar, **Then** an "Import LinkedIn CSV" action button is displayed, and clicking it opens the LinkedIn CSV import flow.
2. **Given** the user navigates to the "CV Dashboard" view, **When** viewing the right-side toolbar, **Then** the toolbar displays a "New Apply" action button, and clicking it opens the application creation dialog/flow.
3. **Given** the user navigates to the "Projects" view, **When** viewing the right-side toolbar, **Then** the toolbar displays action buttons for "Sync Projects" and "Score Projects", enabling synchronization and AI scoring for repository projects.
4. **Given** the user switches between any of the views, **When** the active view changes, **Then** the previous view's actions are unmounted and the new view's actions are rendered immediately without layout shift or UI flickering.

---

### Edge Cases

- **Window Un-maximizing / Resizing**: What happens when the user un-maximizes or resizes the window to a smaller width? The layout gracefully adapts so that the sidebar can toggle via a menu control if viewport width is below standard desktop thresholds, while maintaining access to view actions.
- **Action In-Progress State**: How does the toolbar handle actions that require asynchronous processing (e.g., scoring projects or importing CSV)? Toolbar buttons visually reflect pending/disabled states during active execution to prevent duplicate submissions.
- **Overlay and Modal Interactions**: When an action triggers a modal or fullscreen flow (such as the LinkedIn import or a New Apply form), does the toolbar remain accessible or temporarily disable? Toolbar buttons remain stable, and backdrop modals properly focus the user on the active workflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST launch the main application window in maximized state on initial startup.
- **FR-002**: System MUST keep the side navigation bar permanently visible and pinned open in maximized window mode.
- **FR-003**: System MUST hide the header's hamburger toggle menu button when the application window is in maximized view or above standard desktop width.
- **FR-004**: System MUST display the navigation links in the side navigation bar in the exact sequential order: 1. Home, 2. Projects, 3. CV Dashboard.
- **FR-005**: System MUST render a dedicated dynamic toolbar located on the right side of the screen layout (opposite side of the left navigation bar).
- **FR-006**: System MUST dynamically display the "Import LinkedIn CSV" action button in the right toolbar when the active view is "Home".
- **FR-007**: System MUST dynamically display the "New Apply" action button in the right toolbar when the active view is "CV Dashboard".
- **FR-008**: System MUST dynamically display the "Sync Projects" and "Score Projects" action buttons in the right toolbar when the active view is "Projects".
- **FR-009**: System MUST execute the corresponding view-specific action when a user clicks any toolbar button.
- **FR-010**: System MUST seamlessly update toolbar actions upon view transitions without causing layout jumping or visual glitches.

### Key Entities

- **Navigation Item**: Represents a primary view link in the sidebar, characterized by its display label (`Home`, `Projects`, `CV Dashboard`), icon representation, order index, and route/view identifier.
- **Dynamic Toolbar Slot / Action**: Represents a context-aware action item displayed in the right toolbar, characterized by its target action handler, display label/icon, active view association, and execution status.
- **Window State Configuration**: Represents the window presentation settings, specifying maximized startup behavior and responsive layout breakpoints.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of application startup launches open the main window in maximized state by default.
- **SC-002**: Sidebar navigation link order is consistently verified as Home -> Projects -> CV Dashboard across all app loads.
- **SC-003**: 0 hamburger menu toggle buttons are visible in the header when the window is maximized.
- **SC-004**: Right-side dynamic toolbar transitions and reflects active view actions within 50ms of view switching without UI layout shifts.
- **SC-005**: Users can trigger primary actions (Import CSV, New Apply, Sync/Score) from their respective views with a single click from the dedicated right toolbar.

## Assumptions

- Maximized startup applies across desktop operating systems (Windows, macOS, Linux).
- The right-side toolbar is integrated into the primary application layout structure (either in the top-right header area or as a dedicated right toolbar panel) while preserving the main content reading area width.
- Existing functionality for LinkedIn CSV import, CV job application creation, and GitHub project sync/score are preserved and linked directly to the new toolbar buttons.
