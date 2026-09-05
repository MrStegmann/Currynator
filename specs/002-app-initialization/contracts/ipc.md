# IPC Contracts

## `check-saved-data`
- **Direction**: Renderer -> Main
- **Payload**: None
- **Response**:
  - Success: `{ status: 'success', hasData: boolean, data?: ResumeData }`
  - Error: `{ status: 'error', message: string }`

## `save-resume-data`
- **Direction**: Renderer -> Main
- **Payload**: `{ data: ResumeData }`
- **Response**:
  - Success: `{ status: 'success' }`
  - Error: `{ status: 'error', message: string }`
