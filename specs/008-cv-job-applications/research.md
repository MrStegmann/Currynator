# Research: CV Job Application Management

## Technical Decisions

### Decision 1: Dedicated Storage Layer (`JobApplicationStorage.ts`)

- **Decision**: Create `src/main/models/JobApplicationStorage.ts` to manage persistence for job applications in `job_applications.json` within Electron `app.getPath('userData')`.
- **Rationale**: Follows the established isolated storage pattern in `ResumeStorage.ts` and satisfies the project constitution (local storage, isolated domain models).
- **Alternatives Considered**:
  - Embedding job applications directly inside `resume.json`: Rejected to maintain strict domain model isolation as required by the technical spec.
  - SQLite database: Rejected to maintain consistency with existing file-based JSON storage standard (`ResumeStorage.ts`).

### Decision 2: Backend Controller & IPC Routing

- **Decision**: Create `src/main/controllers/JobApplicationController.ts` and register IPC handlers within `IpcController.ts` exposing IPC invocation methods (`jobApplication:getAll`, `jobApplication:save`, `jobApplication:delete`). Expose API methods in `preload.cts`.
- **Rationale**: Follows Currynator's MVC architecture and IPC pattern where `IpcController` delegates channel handling to specialized controllers.
- **Alternatives Considered**:
  - Direct handler definitions inside `main.ts`: Rejected to keep `main.ts` strictly under 100 lines per project constitution.

### Decision 3: Data Validation via Zod

- **Decision**: Define `JobApplicationSchema` and status enum in `src/main/shared/schema/jobApplicationSchema.ts` using Zod.
- **Rationale**: Complies with Project Constitution Rule III ("MUST use Zod for all data validation").
- **Alternatives Considered**:
  - Manual interface validation: Rejected due to risk of silent schema corruption and non-compliance with project constitution.

### Decision 4: Renderer State Management & UI Integration

- **Decision**: Refactor `useCvDashboardStore.ts` (Zustand) to manage `JobApplication` state, replacing `initialMockCvItems` with asynchronous IPC fetch (`jobApplication:getAll`).
- **Rationale**: Satisfies requirement to remove mock data while leveraging existing Zustand global state pattern.
- **Alternatives Considered**:
  - Component-level React `useState`: Rejected because job applications are shared across views (dashboard cards, modal forms, floating action button triggers).

### Decision 5: Fast-Status Progression Pipeline Logic

- **Decision**: Implement deterministic status order array `['applied', 'called', 'interview', 'techTest', 'rejected', 'gotTheJob']`. The fast-progression button increments the index until reaching terminal state `gotTheJob` or `rejected`, capping at terminal state (or cycling from beginning upon user interaction).
- **Rationale**: Fulfills single-click status advancement requirement with clear visual feedback via top-left card status badges.
- **Alternatives Considered**:
  - Dropdown select menu: Retained as fallback option in full edit mode, but fast-progression button provides superior UX for rapid tracking.
