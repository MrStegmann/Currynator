# Feature Specification: GitHub Projects View Page

**Feature Branch**: `011-github-projects-view`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Feature: Project View Page. Crea la página Projects donde el usuario verá una lista de sus proyectos. Esta página es accesible a través del NavBar mediante el link Projects. Esta página se enlazará directamente con la cuenta de Github mediante un token de acceso generado desde la cuenta de Github. El usuario verá la primera vez que entra en el apartado de Projects una guía de cómo crear un token en github y un campo para añadir el token y guardarlo. Cuando el usuario guarda el token, este queda encriptado y protegido y se listaran todos los proyectos paginados. What to Do: Projects Page: Create the Project Page Component with the Step-by-step guide in one column and the input field with password type (and able to switch between password and text type) in the other column, and a save button to save the Token. Navbar link: A link in the Navbar that routes to the Projects page. List of projects: A list of Projects cards with a Title and short description. The page must Fetch the list from the github repository of the user, at least, one time and saved in local storage the repositories. The list must show 5 items in a row and máx 10 items per page. You must create a simple pagination. Refreshing: A floating button fixed top-right that allow the user to refresh a refech his projects from github."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - GitHub Access Token Setup & Secure Storage (Priority: P1)

As a first-time user navigating to the Projects page without a configured access token, I want to see a clear step-by-step guide explaining how to generate a GitHub Personal Access Token alongside a secure input field so that I can configure my GitHub connection easily and securely.

**Why this priority**: Essential prerequisite flow for authenticating with GitHub API to retrieve repositories.

**Independent Test**: Navigate to the Projects view when no token is saved. Confirm the 2-column layout displays the step-by-step guide on the left, and a password-masked input field with visibility toggle and a "Save Token" button on the right. Save a token and verify it encrypts/saves and transitions to the repository list view.

**Acceptance Scenarios**:

1. **Given** no GitHub token is saved in the application, **When** the user accesses the Projects view, **Then** the screen MUST render a 2-column setup layout:
   - Left column: Detailed step-by-step instructions on generating a Personal Access Token in GitHub settings.
   - Right column: Token input field with password mask by default, a visibility toggle button (show/hide token text), and a "Save Token" button.
2. **Given** the token input field, **When** the user clicks the visibility toggle icon, **Then** the input type MUST switch dynamically between `password` and `text`.
3. **Given** the user enters a valid token and clicks "Save Token", **Then** the application MUST encrypt and store the token securely, fetch the user's GitHub repositories, and display the Projects list view.

---

### User Story 2 - Paginated GitHub Projects List & Local Caching (Priority: P1)

As a user with a saved GitHub token, I want to view my GitHub repositories displayed as project cards in a responsive 5-column grid with pagination (max 10 items per page) and local offline caching so that I can browse my repositories quickly and reliably.

**Why this priority**: Core value feature allowing users to view and browse their imported GitHub projects.

**Independent Test**: View the Projects page with saved credentials. Verify repositories are displayed in a 5-item per row grid (up to 10 items per page), with working Previous/Next pagination controls and local storage persistence.

**Acceptance Scenarios**:

1. **Given** a valid saved GitHub token, **When** the Projects page loads, **Then** the system MUST fetch the user's repositories from GitHub API (if not already cached) and save them to local storage.
2. **Given** loaded repositories, **When** rendering the project cards, **Then** each card MUST display at least the repository title and short description in a 5-column grid layout on desktop screens.
3. **Given** more than 10 repositories, **When** navigating the list, **Then** the page MUST display maximum 10 items per page with clear pagination controls (Previous, Next, Page Numbers).
4. **Given** stored repository data in local storage, **When** re-opening the application offline, **Then** the Projects page MUST load cached repositories immediately from local storage.

---

### User Story 3 - NavBar Integration & Manual Refresh Action (Priority: P2)

As a user navigating the application, I want a "Projects" navigation link in the main navigation bar and a floating refresh button on the Projects view so that I can easily navigate to my projects and re-sync my repository list from GitHub at any time.

**Why this priority**: Provides smooth application navigation and manual data synchronization capability.

**Independent Test**: Click "Projects" in the navigation bar to open the Projects view. On the Projects view, click the floating refresh button pinned to the top-right to trigger a re-fetch of repositories from GitHub API.

**Acceptance Scenarios**:

1. **Given** the application navigation bar, **When** the user clicks the "Projects" navigation item, **Then** the view MUST switch to the Projects page.
2. **Given** the Projects page, **When** viewing the interface, **Then** a floating action button MUST be fixed to the top-right viewport section.
3. **Given** the user clicks the floating refresh button, **When** clicked, **Then** the system MUST execute a live re-fetch of repositories from GitHub API, update local storage cache, and refresh the project list.

---

### Edge Cases

- **Invalid or Expired GitHub Token**: What happens if the saved token is revoked or invalid? Display an error notification indicating authentication failure and allow the user to update or re-enter their token.
- **Empty Repositories List**: What happens if the GitHub account has 0 repositories? Display a friendly empty state message ("No repositories found on this GitHub account").
- **Offline / Network Disruption during Refresh**: What happens if the user clicks the refresh button while offline? Retain cached repositories, display a toast/alert notification ("Unable to reach GitHub. Showing offline cached data."), and restore full functionality when online.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST include a "Projects" link in the main navigation bar (`RightNavBar`) that routes to the Projects view.
- **FR-002**: When no GitHub token is configured, the Projects page MUST render a 2-column setup guide:
  - Column 1: Step-by-step instructions for creating a GitHub Personal Access Token.
  - Column 2: Password-masked input field, visibility toggle control, and "Save Token" button.
- **FR-003**: The token input field MUST support toggling between hidden (`password`) and visible (`text`) input types.
- **FR-004**: Upon clicking "Save Token", the application MUST validate non-empty input, encrypt/protect the token string, and persist it securely.
- **FR-005**: The application MUST fetch user repositories from the GitHub API using the saved access token.
- **FR-006**: Fetched repository data (including repository name/title, description, URL, primary language, and star count) MUST be saved in local storage to support offline access and fast loading.
- **FR-007**: Project cards MUST be rendered in a grid layout formatted to 5 items per row on large/desktop screens.
- **FR-008**: The Projects view MUST implement pagination limiting the display to a maximum of 10 project cards per page.
- **FR-009**: The pagination UI MUST include Previous, Next, and Page Indicator controls.
- **FR-010**: The Projects view MUST feature a floating action button fixed to the top-right area allowing users to re-fetch repositories from GitHub API on demand.
- **FR-011**: While re-fetching from GitHub, the floating action button MUST display a loading spinner state and disable duplicate clicks.
- **FR-012**: If API requests fail due to invalid tokens or network errors, user-friendly error messages MUST be presented with options to retry or re-configure the token.

### Key Entities

- **GitHub Credentials**: Encrypted storage entity holding the user's Personal Access Token and verification status.
- **GitHub Repository**: Profile project record containing `id`, `name`, `description`, `html_url`, `stargazers_count`, `language`, and `updated_at`.
- **Projects Pagination**: State tracking `currentPage`, `itemsPerPage` (default: 10), `totalItems`, and `totalPages`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of first-time setup flows render the 2-column guide and toggleable password field without layout breakage.
- **SC-002**: Projects page loads cached repositories from local storage in under 300ms on subsequent visits.
- **SC-003**: Grid layout presents exactly 5 project cards per row on screen widths >= 1280px.
- **SC-004**: Manual refresh action completes re-fetch and updates UI within 2 seconds on a standard broadband connection.

## Assumptions

- **GitHub API**: Uses GitHub REST API v3 endpoint (`GET https://api.github.com/user/repos?sort=updated&per_page=100`).
- **Token Security**: Tokens are encrypted before storage (using application-level crypto/storage protection) to ensure security per constitution constraints.
- **Responsive Grid**: 5 columns on large screens (`xl:grid-cols-5`), scaling down gracefully for smaller screen sizes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`).
