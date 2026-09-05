# Feature Specification: App Initialization & Dashboard

**Feature Branch**: `[###-feature-name]`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "/speckit-specify Crea un estado de carga al iniciar la aplicación que muestre la ventana Greetings mientras se comprueba si existen datos guardados, accediendo a través de un IPC a electron-backend. Si no encuentra ningún dato,  mostrará un formulario a rellenar dividido en varios pasos para completar el apartado "basics" del JSON Resume. Cuando se complete todos los pasos, se guardarán los datos introducidos localmente y se enviará al usuario a su pestaña home de la dashboard de la aplicación.
En este apartado la aplicación deberá tener un header MÍNIMO que contendrá a la izquierda un menú hamburguesa que desplegará un menú lateral izquierdo con el link Home (con highlight y efecto visual para diferenciarlo de un link activo y otro no. A la derecha del header se mostrará el nombre actual de la vista que el usuario está viendo. Home contendrá la información guardada del JSON Resume, divididos en secciones por su propiedad padre con un header identificador de cada sección. Cada sección debe tener su propio botón editar que SÓLO afecte a dicha sección y permita añadir, modificar o eliminar información para esa sección."

## Clarifications

### Session 2026-09-05
- Q: How should the application handle an IPC failure or timeout when checking for saved data during startup? → A: Show an error screen with a "Retry" button.
- Q: Which fields in the "basics" section should be mandatory when the user fills out the onboarding form? → A: Name, email, and label are mandatory.
- Q: How should the application handle a situation where the user closes the app halfway through the multi-step basics onboarding form? → A: Discard partial progress; user starts over next time they launch the app.
- Q: How should the application handle a situation where the saved local storage data is corrupted or invalid according to the JSON Resume schema? → A: Display an error screen offering a modal form for the user to rewrite the data and overwrite the corrupted data.
- Q: How should the fields in the "basics" onboarding form be divided across the multiple steps? → A: Step 1: Mandatory fields, Step 2: Contact info, Step 3: Profiles/Summary.
- Q: What interface should the "modal form" for corrupted data recovery display? → A: The same multi-step "basics" onboarding form.
- Q: What is the acceptable timeout threshold for the initial IPC data check before showing the error screen? → A: 5 seconds.
- Q: How many times should the user be allowed to click "Retry" for an IPC failure before the application enters an unrecoverable "Fatal Error" state? → A: 3 attempts, then show Fatal Error with restart instruction.
- Q: What should happen if the user clicks "Cancel" or attempts to close the corrupted data modal without rewriting the data? → A: Modal cannot be dismissed; rewriting data is mandatory to proceed.
- Q: What exactly constitutes "corrupted data" that triggers the recovery modal? → A: Any failure to parse as valid JSON or missing any mandatory 'basics' fields (Name, Email, Label).
- Q: How should the application handle a situation where some sections of the saved JSON Resume are valid, but others are corrupted or missing? → A: Preserve valid sections; only force rewriting of the mandatory 'basics' if they are corrupted.
- Q: What should happen if the application crashes or the save operation fails while the user is actively rewriting their corrupted data in the recovery modal? → A: Ensure atomic saves: write to a temporary file first, then rename. If it fails, the original corrupted file remains and the recovery modal persists.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial load without data (Priority: P1)

Users opening the app for the first time are greeted with a loading screen and then guided through a setup process to input their basic information.

**Why this priority**: It's the core onboarding experience that enables all other application features by establishing the foundational user data.

**Independent Test**: Can be fully tested by launching the app with an empty local storage, observing the Greetings view, completing the multi-step basics form, and verifying that the user is redirected to the Home dashboard with their newly entered data.

**Acceptance Scenarios**:

1. **Given** the app is launched and no data is saved, **When** the startup check completes, **Then** the application displays a multi-step form for the "basics" JSON Resume section.
2. **Given** the user is filling the basics form, **When** they complete all steps and submit, **Then** the data is saved locally and they are redirected to the Home dashboard.

---

### User Story 2 - Initial load with existing data (Priority: P1)

Returning users seamlessly bypass the onboarding process and are taken directly to their dashboard.

**Why this priority**: Returning users shouldn't be blocked or forced to re-enter data they've already provided.

**Independent Test**: Can be tested by launching the application with pre-existing data in local storage and ensuring the user lands directly on the Home dashboard after the Greetings loading state.

**Acceptance Scenarios**:

1. **Given** the app is launched and data exists locally, **When** the startup check completes, **Then** the application navigates directly to the Home dashboard.

---

### User Story 3 - Dashboard Layout and Navigation (Priority: P2)

Users have a consistent and minimal interface for navigating between different views of the application.

**Why this priority**: Provides the main navigation structure for the app, but relies on data existing first.

**Independent Test**: Can be tested by verifying the header presence on the dashboard, opening the hamburger menu, and observing the visual active state on the Home link.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard, **When** they look at the header, **Then** they see a hamburger menu on the left and the current view name on the right.
2. **Given** the user clicks the hamburger menu, **When** the sidebar opens, **Then** the "Home" link is visible and visually highlighted to indicate it is the active view.

---

### User Story 4 - Home Dashboard Data Display and Editing (Priority: P2)

Users can view their JSON Resume data structured by sections and edit each section independently.

**Why this priority**: Core functionality for managing resume data, allowing incremental updates without risking unintended changes to other sections.

**Independent Test**: Can be tested by navigating to the Home dashboard, verifying the presence of distinct sections (e.g., basics, work, education), and using the edit button of a specific section to modify its data in isolation.

**Acceptance Scenarios**:

1. **Given** the user is viewing the Home dashboard, **When** the data is displayed, **Then** it is grouped by JSON Resume parent properties, each with its own header.
2. **Given** the user wants to update their work history, **When** they click the "Edit" button for the "work" section, **Then** an editing interface opens that only allows modifications to the "work" section data.

### Edge Cases

- **IPC Failure/Timeout**: The system will display an error screen with a "Retry" button if the IPC check does not complete within 5 seconds. The user can retry up to 3 times before the application enters an unrecoverable "Fatal Error" state instructing them to restart.
- **Midway Exit during Onboarding**: If the user closes the app during the basics form, partial progress is discarded and they must start over upon next launch.
- **Corrupted Data**: If the local storage data is invalid or corrupted (defined as any failure to parse as valid JSON or missing any mandatory 'basics' fields like Name, Email, or Label), display an error screen. This screen MUST offer a modal that reuses the multi-step "basics" onboarding form to let the user overwrite the corrupted data. The modal cannot be dismissed; rewriting data is mandatory to proceed. If some sections are valid while others are corrupted, the system MUST preserve valid sections and only force rewriting of the mandatory 'basics' if they are corrupted. To protect against permanent data loss, all save operations during recovery MUST be atomic (write to a temporary file first, then rename).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST show a "Greetings" loading state on startup while communicating via IPC to the electron-backend to check for saved data.
- **FR-002**: If no data is found, the application MUST display a multi-step form to collect the "basics" section of the JSON Resume. The steps MUST be divided as follows: Step 1 (Mandatory fields: Name, Email, Label), Step 2 (Contact info), Step 3 (Profiles/Summary).
- **FR-003**: The system MUST save the collected "basics" data locally upon successful form completion.
- **FR-004**: The system MUST navigate the user to the Home dashboard after data is successfully saved or if data already existed.
- **FR-005**: The application MUST display a minimal header containing a hamburger menu on the left and the current view name on the right.
- **FR-006**: The hamburger menu MUST deploy a left sidebar containing a "Home" navigation link.
- **FR-007**: Navigation links MUST have distinct visual highlights to differentiate active and inactive states.
- **FR-008**: The Home dashboard MUST display saved JSON Resume information, grouped by parent property (e.g., basics, work, education) with section headers.
- **FR-009**: Each data section on the Home dashboard MUST have an independent "Edit" button.
- **FR-010**: Editing a section MUST only allow adding, modifying, or deleting information for that specific section.
- **FR-011**: If the IPC check for saved data times out (exceeds 5 seconds) or fails, the system MUST display an error screen with a "Retry" button instead of proceeding to onboarding.

### Key Entities

- **Resume Data**: The central entity conforming to the JSON Resume schema format.
- **Navigation State**: Represents the currently active view/route in the application to drive UI highlights and header titles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new users are routed to the multi-step onboarding form after the initial loading state.
- **SC-002**: 100% of returning users with valid saved data are routed directly to the Home dashboard after the initial loading state.
- **SC-003**: Users can successfully update an individual section of their resume data without any other sections being altered.
- **SC-004**: The active view is always accurately reflected in both the header title and the sidebar menu highlight.

## Assumptions

- Data persistence relies on Local Storage as mandated by the project constitution.
- The IPC communication is fast and reliable; standard Electron IPC mechanisms are used.
- The "Greetings" window refers to a full-screen view or splash screen component within the application's main window that masks the data-loading process.
- The multi-step form only collects data for the "basics" JSON Resume property; other properties will be added later or are optional.
