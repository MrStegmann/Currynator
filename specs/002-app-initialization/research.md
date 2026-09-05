# Research & Decisions: App Initialization & Onboarding

## Technical Unknowns & Decisions

### 1. IPC Communication for Data Fetching
- **Decision**: Use standard Electron `ipcMain.handle` and `ipcRenderer.invoke`.
- **Rationale**: The requirement dictates checking for saved data from the backend. Async invoke/handle is the standard Electron pattern for request/response style IPC.
- **Alternatives considered**: Sync IPC (blocks main thread, bad practice) or message passing without promises (more boilerplate).

### 2. State Management for the Initialization Flow
- **Decision**: Use Zustand for an `initStore` containing the app's current lifecycle state (`loading`, `no-data`, `has-data`, `error`, `corrupted`).
- **Rationale**: Constitution mandates Zustand for global state. A finite state machine pattern in a Zustand store easily manages the transition from the Greetings view to either the Onboarding Form or the JSON Display.

### 3. Data Validation
- **Decision**: Use Zod to validate the JSON Resume data both when reading from storage and before writing to storage.
- **Rationale**: Constitution mandates Zod. We will establish a canonical schema in the `main` process and share types with the `renderer`.

### 4. Groq SDK Integration
- **Decision**: Acknowledge the constraint but defer implementation.
- **Rationale**: The constitution mandates Groq SDK integration, but the current feature (Initialization and basic onboarding form) does not require AI generation or processing. We will add the dependency if required by future specs, but it's not active in this flow.
