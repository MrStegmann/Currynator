# IPC Contract: Job Application Channels

## Channel Definitions

All job application IPC channels follow standard Electron `ipcMain.handle` and `ipcRenderer.invoke` patterns.

---

### Channel 1: `job-application:get-all`

Retrieves all saved job application records from persistent storage.

- **Direction**: Renderer ➔ Main Process
- **Payload**: None
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: JobApplication[];
    error?: string;
  }
  ```

---

### Channel 2: `job-application:save`

Creates a new job application or updates an existing application record.

- **Direction**: Renderer ➔ Main Process
- **Payload**: `JobApplication` object
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: JobApplication;
    error?: string;
  }
  ```

---

### Channel 3: `job-application:delete`

Deletes a job application record by ID.

- **Direction**: Renderer ➔ Main Process
- **Payload**: `id: string`
- **Response**:
  ```typescript
  {
    success: boolean;
    error?: string;
  }
  ```

---

### Channel 4: `job-application:update-status`

Updates only the status field of a job application record.

- **Direction**: Renderer ➔ Main Process
- **Payload**: `{ id: string; status: JobApplicationStatus }`
- **Response**:
  ```typescript
  {
    success: boolean;
    data?: JobApplication;
    error?: string;
  }
  ```

---

## Preload API (`window.electron.jobApplication`)

Exposed via `contextBridge` in `src/main/preload.cts`:

```typescript
jobApplication: {
  getAll: () => ipcRenderer.invoke('job-application:get-all'),
  save: (data: JobApplication) => ipcRenderer.invoke('job-application:save', data),
  delete: (id: string) => ipcRenderer.invoke('job-application:delete', id),
  updateStatus: (id: string, status: JobApplicationStatus) => ipcRenderer.invoke('job-application:update-status', { id, status }),
}
```
