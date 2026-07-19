# Feature Specification: CLI for logs and debug.

## Status

* **Status:** IN PROGRESS
* **Target Module:** `src/renderer/src/features/terminal`
* **Dependencies:** `main/services/terminal.service.ts`

---

## 1. Command Interface Overview

The terminal is an input area that accepts explicit commands for development, testing, and application management. It is a fully functional command-line interface. Must handle custom logs by class Log, custom errors by class ErrorLog, and custom warnings by class WarningLog. All class will be provided by the main process. Commands wil be:
- clear: clear the terminal
- help: show help message
- exit: exit the terminal
- echo: echo the input
- test api: test api command to debug if it is working properly. Should show in terminal a request and response (e.g: pingGithubMetrics, pingHomeMetrics, etc)

---

## 2. Step-by-Step Specifications

### Step 1: Command Line Interface

* **UI Components:**
* Input text field: `Type a command`.
* Output text area: `Command output`.
* Action button: `Enter`.

* **Behavioral Rules:**
* **Manual Entry:** The user types a command and presses Enter.
* **Output Display:** The system displays the output of the command in the output text area. All custom logs, errors and warnings should be displayed in the output text area. Each log should be color coded by type (e.g: `[LOG - fileName:lineNumber] : Message`, `[ERROR - fileName:lineNumber] : Message`, `[WARNING - fileName:lineNumber] : Message`). Logs should be displayed in the output text area in real-time. When the log is displayed, it should be color coded by type.

### Step 2: Custom Class

* **Class Log:** Should contain the following properties: `timestamp: Date`, `fileName: string`, `lineNumber: number`, `message: string`.
* **Class ErrorLog:** Should contain the following properties: `timestamp: Date`, `fileName: string`, `lineNumber: number`, `message: string`.
* **Class WarningLog:** Should contain the following properties: `timestamp: Date`, `fileName: string`, `lineNumber: number`, `message: string`.


* **Behavioral Rules:**
* **Logger Initialization:** All logger instances should be initialized in the Main process `app.ts` and passed to the renderer process via IPC.
* **Logger Usage:** All logger instances should be used in the renderer process to log messages and should be color coded by type.

### Step 3: Commands

* **Commands:**
* `clear`: clear the terminal
* `help`: show help message
* `exit`: exit the terminal
* `echo`: echo the input
* `test api`: test api command to debug if it is working properly. Should show in terminal a request and response (e.g: pingGithubMetrics, pingHomeMetrics, etc)
* `debug api`: test api command to debug if it is working properly. Should show in terminal a request and response (e.g: pingGithubMetrics, pingHomeMetrics, etc)

---

## 3. Data Schema Model (Contract)

```typescript
export interface TerminalState {
  input: string;
  output: string;
  logs: Array<{
    type: 'log' | 'error' | 'warning';
    timestamp: Date;
    fileName: string;
    lineNumber: number;
    message: string;
  }>;
}

```