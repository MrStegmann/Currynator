# Feature Specification: Project Initialization (Electron + React)

**Feature Branch**: `001-init-electron-react`

**Created**: 2026-09-04

**Status**: Draft

**Input**: User description: "Inicializa el proyecto con electron + react como renderer, instala las librerías necesarias, realiza las comprobaciones necesarias para que electron se abra exitosamente y muestre un mensaje por pantalla "Hello, World, I'm Currynator" para comprobar que todo funciona correctamente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Application Launch and Verification (Priority: P1)

As a developer or user, I want the application to launch a window that displays a specific greeting so that I can verify the Electron and React integration is working correctly.

**Why this priority**: This is the foundational setup for the entire project. Without a working Electron + React environment, no other features can be built.

**Independent Test**: Can be tested by running the application start command and observing the resulting window.

**Acceptance Scenarios**:

1. **Given** the project has been installed and built, **When** the application is launched, **Then** an application window opens successfully.
2. **Given** the application window is open, **When** the React renderer loads, **Then** the screen displays the text "Hello, World, I'm Currynator".

---

### User Story 2 - IPC Connection Test (Priority: P1)

As a developer, I want the renderer process to successfully communicate with the main process via IPC on startup, so that I can verify the secure communication bridge is properly established.

**Why this priority**: IPC is critical for Electron applications. Validating it early prevents architectural blockers later.

**Independent Test**: The renderer will send a ping message to the main process and display the pong response on the screen.

**Acceptance Scenarios**:

1. **Given** the React application has loaded, **When** it invokes the IPC test method, **Then** the main process receives the message and replies successfully.
2. **Given** the main process replies, **When** the renderer receives the reply, **Then** it is rendered on the screen below the greeting.

---

### Edge Cases

- What happens when the application is launched but the React development server is not running (in dev mode)?
- How does the system handle missing or incompatible node modules during launch?

## Clarifications

### Session 2026-09-04
- Q: Should the initial library installation include the complete Constitution stack (TailwindCSS, Zustand, Zod, Groq, Playwright), or just the core Electron/React dependencies for now? → A: Install the complete Constitution stack (Tailwind, Zustand, Zod, Groq, Playwright)
- Q: How should the successful IPC test response be presented in the renderer? → A: Display on the React screen below the greeting

## Requirements *(mandatory)*
### Functional Requirements

- **FR-001**: System MUST provide an Electron main process setup configured to load a React application.
- **FR-002**: System MUST include a React application acting as the renderer interface.
- **FR-003**: System MUST display the exact text "Hello, World, I'm Currynator" in the center of the application window.
- **FR-004**: System MUST align with project constitution requirements (TypeScript for both main and renderer, MVC pattern for backend, Feature-based pattern for frontend, TailwindCSS for styling).
- **FR-005**: System MUST include all necessary libraries and build tools to run the Electron + React setup successfully, including the complete Constitution stack (TailwindCSS, Zustand, Zod, Groq, Playwright).
- **FR-006**: System MUST establish a secure IPC bridge (via preload script) to allow communication between renderer and main processes.
- **FR-007**: System MUST execute a test IPC call (ping/pong) on startup to validate the connection.
- **FR-008**: System MUST display the successful IPC response text on the screen below the main greeting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application window appears on screen in under 3 seconds from launch.
- **SC-002**: The required text ("Hello, World, I'm Currynator") is visible to the user immediately upon the window rendering.
- **SC-003**: The developer console shows 0 errors or warnings during application startup.
- **SC-004**: The `main.ts` file remains strictly under 100 lines of code as per the project constitution.
- **SC-005**: The IPC test successfully completes (message sent and reply received) without throwing errors in either process.

## Assumptions

- The setup will use standard modern build tooling (e.g., Vite) to bundle React for Electron.
- The initial window size and styling are minimal, only serving to clearly display the required text.
- Development will happen on a desktop OS compatible with Electron (Windows, macOS, or Linux).
