# Feature Specification: App Initialization & Onboarding

**Feature Branch**: `002-app-initialization`

**Created**: 2026-09-05

**Status**: Updated (Scope Reduction)

**Input**: Multi-step onboarding form for the "basics" section of the JSON Resume. Upon completion or if data already exists, show the saved data as raw JSON on a blank screen.

## Clarifications

### Session 2026-09-05
- Q: How should the application handle an IPC failure or timeout when checking for saved data during startup? → A: Show an error screen with a "Retry" button.
- Q: Which fields in the "basics" section should be mandatory when the user fills out the onboarding form? → A: Name, email, and label are mandatory.
- Q: How should the application handle a situation where the user closes the app halfway through the multi-step basics onboarding form? → A: Discard partial progress; user starts over next time they launch the app.
- Q: How should the application handle a situation where the saved local storage data is corrupted or invalid according to the JSON Resume schema? → A: Display an error screen offering a modal form for the user to rewrite the data and overwrite the corrupted data.
- Q: How should the "basics" fields be divided across the multi-step form? (FR-002) → A: Option A: 3 steps (Personal, Contact, Details).
- Q: In the edge case where data is corrupted, how should the modal allow the user to "rewrite the data"? (Edge Cases) → A: Option A: Reset and redirect to the GUI onboarding form.
- Q: How should the final "blank screen" display the formatted JSON text? (FR-004) → A: Option C: Read-only `<textarea>`.

### Update 2026-09-05 (Scope Reduction)
- Home dashboard, header, sidebar, and section-based editing have been **removed** from this feature's scope.
- The application MUST produce no frontend errors when fetching data from electron-backend via IPC.
- The application MUST produce no errors during the initialization flow (startup, data check, routing).
- After the onboarding form is completed, or if data already exists, the application MUST display the saved data as raw JSON text on a blank screen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial load without data (Priority: P1)

Users opening the app for the first time are greeted with a loading screen and then guided through a setup process to input their basic information.

**Why this priority**: It's the core onboarding experience that establishes the foundational user data.

**Independent Test**: Launch the app with an empty local storage, observe the Greetings view, complete the multi-step basics form, and verify the saved JSON data is displayed on a blank screen.

**Acceptance Scenarios**:

1. **Given** the app is launched and no data is saved, **When** the startup IPC check completes, **Then** the application displays a multi-step form for the "basics" JSON Resume section.
2. **Given** the user is filling the basics form, **When** they complete all steps and submit, **Then** the data is saved locally and the application transitions to a blank screen displaying the saved data as formatted JSON.

---

### User Story 2 - Initial load with existing data (Priority: P1)

Returning users seamlessly bypass the onboarding process and are shown their saved data.

**Why this priority**: Returning users shouldn't be blocked or forced to re-enter data they've already provided.

**Independent Test**: Launch the application with pre-existing valid data in local storage and verify the Greetings loading state leads directly to the raw JSON display screen.

**Acceptance Scenarios**:

1. **Given** the app is launched and valid data exists locally, **When** the startup IPC check completes, **Then** the application navigates directly to a blank screen displaying the saved data as formatted JSON.

---

### Edge Cases

- **IPC Failure/Timeout**: The system will display an error screen with a "Retry" button.
- **Midway Exit during Onboarding**: If the user closes the app during the basics form, partial progress is discarded and they must start over upon next launch.
- **Corrupted Data**: If the local storage data is invalid or corrupted according to the JSON Resume schema, display an error screen indicating the issue, with a button to reset the data and redirect the user back to the GUI onboarding form to re-enter their information.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST show a "Greetings" loading state on startup while communicating via IPC to the electron-backend to check for saved data.
- **FR-002**: If no data is found, the application MUST display a multi-step form to collect the "basics" section of the JSON Resume. The form MUST be divided into 3 logical steps: Personal (Name, Email, Label - all mandatory), Contact (Phone, URL, Profiles - optional), and Details (Location, Summary - optional).
- **FR-003**: The system MUST save the collected "basics" data locally upon successful form completion.
- **FR-004**: After data is successfully saved or if data already existed, the system MUST display a blank screen showing the saved data as formatted JSON text inside a read-only `<textarea>` element.
- **FR-005**: If the IPC check for saved data times out or fails, the system MUST display an error screen with a "Retry" button instead of proceeding to onboarding.
- **FR-006**: The application MUST produce no frontend errors when fetching data from electron-backend via IPC.
- **FR-007**: The application MUST complete the initialization flow (startup, IPC check, routing decision) without runtime errors under all initial states.

### Key Entities

- **Resume Data**: The central entity conforming to the JSON Resume schema format.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new users are routed to the multi-step onboarding form after the initial loading state.
- **SC-002**: 100% of returning users with valid saved data bypass the onboarding form and see the raw JSON display screen directly after the loading state.
- **SC-003**: Zero frontend errors are produced during the full initialization flow and data fetch cycle under normal operating conditions.

## Assumptions

- Data persistence relies on Local Storage as mandated by the project constitution.
- The IPC communication is fast and reliable; standard Electron IPC mechanisms are used.
- The "Greetings" window refers to a full-screen view or splash screen component within the application's main window that masks the data-loading process.
- The multi-step form only collects data for the "basics" JSON Resume property; other properties will be added later or are optional.
- The JSON display screen is intentionally minimal — a blank screen with formatted JSON output. No navigation, header, sidebar, or section editing is included in this feature's scope.
