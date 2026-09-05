# Data Model: App Initialization & Onboarding

## Entities

### `ResumeData`
The primary entity represents the JSON Resume format. For this specific feature, we are only concerned with the `basics` section, though the full schema will be defined for future extensibility.

**Validation Rules (Zod):**
- Must match the canonical JSON Resume schema structure.
- In the `basics` section, the fields `name`, `email`, and `label` are strictly **mandatory** strings.
- Other fields in `basics` (like `phone`, `url`, `summary`, `location`, `profiles`) are optional strings or objects.

### `InitState`
The client-side state machine governing the initialization flow.

**States:**
- `loading`: App is starting, IPC call to check data is pending. UI shows Greetings View.
- `no-data`: IPC call succeeded, no valid data found. UI shows Onboarding Form.
- `has-data`: IPC call succeeded, valid data found (or form just completed). UI shows JSON display screen.
- `error`: IPC call failed or timed out. UI shows Error screen with Retry.
- `corrupted`: IPC call succeeded but data failed Zod validation. UI shows Modal to rewrite data.
