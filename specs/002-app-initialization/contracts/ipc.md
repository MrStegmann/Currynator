# IPC Interface Contracts

This document defines the IPC channels used for communication between the Renderer process and the Main process during the initialization and onboarding flow.

## `check-saved-data`

**Direction**: Renderer → Main (Invoke)

**Purpose**: Fetches the saved JSON Resume data from Local Storage.

**Request Payload**: None

**Response Payload**:
```typescript
{
  success: boolean;
  exists: boolean;
  data?: ResumeData;  // Only populated if success=true and exists=true
  error?: string;     // Populated if success=false
  isCorrupted?: boolean; // True if data exists but failed Zod validation
}
```

## `save-resume-data`

**Direction**: Renderer → Main (Invoke)

**Purpose**: Saves the user-provided JSON Resume data to Local Storage.

**Request Payload**:
```typescript
{
  resumeData: ResumeData;
}
```

**Response Payload**:
```typescript
{
  success: boolean;
  error?: string; // Populated if success=false (e.g. Zod validation failed in Main)
}
```
