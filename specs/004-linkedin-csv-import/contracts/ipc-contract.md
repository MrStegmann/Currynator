# IPC Contract Specification: LinkedIn CSV Import

## Feature: 004-linkedin-csv-import

### Electron IPC Channels

#### 1. `linkedin:parse-zip` (Renderer $\rightarrow$ Main)
Invoked by the frontend when the user selects or drops a `.zip` file.

- **Request Payload**:
  ```typescript
  {
    filePath: string; // Absolute file path of uploaded zip file
  }
  ```

- **Response Payload**:
  ```typescript
  {
    success: boolean;
    data?: Resume; // Validated JSON Resume object extracted from ZIP
    skippedOptionalFiles: string[]; // List of skipped optional CSV files (e.g. ['Certifications.csv'])
    hasExistingData: boolean; // True if ResumeStorage already contains saved resume data
    error?: string;
  }
  ```

#### 2. `linkedin:import-progress` (Main $\rightarrow$ Renderer Event Stream)
Emitted by the main process during ZIP unpacking and CSV parsing to provide real-time status updates.

- **Event Payload**:
  ```typescript
  {
    stage: 'extracting' | 'parsing' | 'saving' | 'complete' | 'error';
    percentage: number; // 0 to 100
    message: string; // e.g. "Extracting Profile.csv..."
    skippedOptionalFiles: string[];
  }
  ```

#### 3. `linkedin:confirm-import` (Renderer $\rightarrow$ Main)
Invoked after user chooses whether to replace or merge pre-existing resume data.

- **Request Payload**:
  ```typescript
  {
    mode: 'replace' | 'merge';
    importedData: Resume;
  }
  ```

- **Response Payload**:
  ```typescript
  {
    success: boolean;
    data: Resume;
    error?: string;
  }
  ```
