# Data Model: App Initialization & Dashboard

## Entities

### `ResumeData`
Conforms to the JSON Resume schema format.

**Properties** (focusing on "basics" for this feature):
- `basics` (Object):
  - `name` (String, Mandatory)
  - `email` (String, Mandatory)
  - `label` (String, Mandatory)
  - `image` (String, Optional)
  - `phone` (String, Optional)
  - `url` (String, Optional)
  - `summary` (String, Optional)
  - `location` (Object, Optional)
  - `profiles` (Array, Optional)

**Validation**:
- Validated via a Zod schema (`resumeSchema`).
- `name`, `email`, and `label` are strictly required strings per the specification.

### `AppState`
Global application state managed via Zustand.

**Properties**:
- `isLoading` (Boolean): True while checking for data via IPC.
- `hasData` (Boolean): True if valid data exists.
- `isError` (Boolean): True if IPC check fails.
- `activeView` (String): Current route/view (e.g., 'onboarding', 'home').
- `resumeData` (Object | null): The loaded JSON Resume data.
