# Research & Design Decisions: LinkedIn CSV Import

## Feature: 004-linkedin-csv-import

### Decision 1: ZIP Archive Processing Location
- **Decision**: Perform ZIP extraction and CSV file reading in the Electron **Main Process** (`src/main/services/LinkedinImportService.ts` or controller).
- **Rationale**: 
  - Main process has native Node.js filesystem access (`fs`, `path`) and `adm-zip` compatibility without browser context restrictions.
  - Keeps the React renderer main thread unblocked while decompressing and parsing multi-file archives.
- **Alternatives Considered**:
  - Processing in renderer via Web APIs / JSZip: rejected to avoid bundling zip decompresion logic in renderer bundle and to leverage native Node file streams.

### Decision 2: CSV Parsing Strategy
- **Decision**: Implement a robust, lightweight CSV string parser supporting quoted strings and multiline fields.
- **Rationale**:
  - LinkedIn CSV exports use standard RFC 4180 CSV format (comma delimited, double-quoted fields for multiline summaries/descriptions).
  - Avoids adding unnecessary third-party heavy dependencies while granting precise control over missing column fallbacks and character encoding.
- **Alternatives Considered**:
  - Adding `papaparse` or `csv-parse`: rejected to keep dependency footprint minimal since `adm-zip` provides raw file buffers directly.

### Decision 3: IPC Progress Feedback Mechanism
- **Decision**: Use bidirectional Electron IPC event pattern (`ipcMain` emitting `linkedin:import-progress` events to `event.sender`, and `ipcRenderer.on` listener in renderer).
- **Rationale**:
  - Provides instant step-by-step progress feedback (e.g. "Extracting Profile.csv...", "Parsing Work Experience (50%)", "Complete").
  - Allows asynchronous prompt handling when pre-existing resume data is detected during the import routine.
- **Alternatives Considered**:
  - Synchronous blocking IPC call: rejected because it cannot stream step-by-step progress updates to the renderer progress bar.

### Decision 4: Pre-Existing Data Prompt Handling
- **Decision**: Detect pre-existing data state before applying store mutations. If existing resume data is present in `ResumeStorage`, trigger a UI prompt modal in renderer asking the user to choose between **"Replace"** (overwrite) or **"Keep/Merge"** (append unique items).
- **Rationale**:
  - Satisfies **FR-009** and edge case requirement to prevent accidental loss of manually entered resume data.
