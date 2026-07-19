
# Feature Specification: CLI for Logs, Debugging, and File Logging

## Status

* **Status:** PROPOSED / UNDER REVIEW
* **Target Module:** `src/renderer/src/features/terminal`
* **Dependencies:** `src/main/services/terminal.service.ts`, `src/main/services/logger.service.ts`, `src/preload/index.ts`

---

## 1. Architectural & Feature Overview

The goal of this feature is to implement a dual-purpose system:

1. A persistent **File Logger** running in the Main process that intercepts all system logs, warnings, and errors, writing them safely to a local `.log` file.
2. An interactive, developer-focused **CLI Terminal** inside the React UI that accepts commands *and* listens to these application logs in real-time, displaying them with color-coded severity levels.

### Core Logger Structure

Logs are represented by distinct, structured classes instantiated primarily in the Main process (or forwarded securely from the Renderer):

* `Log` (General application tracing)
* `WarningLog` (Non-fatal anomalies)
* `ErrorLog` (Caught exceptions and crashes)

---

## 2. Step-by-Step Specifications

### Step 1: Main Process Logger Service & File I/O

Because the Renderer process lacks direct filesystem access, a core `LoggerService` must reside in the Main process.

* **File Storage:**
* Logs must be written to the user's local app data directory using `app.getPath('userData')/logs/app.log`.
* The service must automatically append logs to this file asynchronously upon instantiation of any log class.


* **Global Error Catching:**
* The Main process will hook into `process.on('uncaughtException')` and `process.on('unhandledRejection')` to auto-generate `ErrorLog` instances.


* **IPC Broadcasting:**
* Every time a log is written to the file, the Main process must broadcast the log object to all active Renderer windows via `webContents.send('app:log-broadcast', logInstance)`.



### Step 2: Custom Log Classes (Data Structure)

To ensure trace-ability, all three log types inherit from a base descriptor class to capture where the log originated.

* **Base Configuration:**
* `timestamp`: `Date` (ISO format string when sent across IPC)
* `fileName`: `string` (The source file that generated the log)
* `lineNumber`: `number` (Line number of execution)
* `message`: `string` (The text body or error string stack)


* **Class Signatures:**

```typescript
export class Log {
  type = 'log' as const;
  constructor(public message: string, public fileName: string, public lineNumber: number, public timestamp = new Date()) {}
}

export class WarningLog {
  type = 'warning' as const;
  constructor(public message: string, public fileName: string, public lineNumber: number, public timestamp = new Date()) {}
}

export class ErrorLog {
  type = 'error' as const;
  constructor(public message: string, public fileName: string, public lineNumber: number, public timestamp = new Date()) {}
}

```

### Step 3: React Terminal UI Component

* **Layout Elements:**
* **Output Console:** A scrollable container displaying past command outputs and live application logs.
* **Input Line:** A text field prefixed by a shell prompt symbol (e.g., `> ` or `$ `).


* **Behavioral Rules:**
* **Real-time Streaming:** The component must subscribe to the IPC broadcast channel via the preload script on mount.
* **Color Coding / Styling:**
* `[LOG][fileName:line] : message` -> Styled in **Green** or **White**
* `[WARNING][fileName:line] : message` -> Styled in **Yellow**
* `[ERROR][fileName:line] : message` -> Styled in **Red**


* **Auto-Scroll:** The console area must automatically snap scroll to the bottom when new logs arrive, unless the user has manually scrolled upwards.



### Step 4: CLI Commands Registry

The terminal parser must recognize and handle the following explicit operations:

| Command | Arguments | Behavior |
| --- | --- | --- |
| `clear` | None | Flushes the current terminal output state arrays completely. |
| `help` | None | Prints a list of all available commands and their descriptions. |
| `exit` | None | Closes or hides the terminal drawer interface. |
| `echo` | `[string]` | Prints the provided text directly back onto the console output. |
| `test api` | None | Invokes diagnostic background API pings (`pingGithubMetrics`, `pingHomeMetrics`) and prints structured Request/Response objects in the output window. |
| `debug api` | `[endpoint]` | Same as `test api`, but allows targeting a specific microservice. |

---

## 3. Data Schema & IPC Contract

### IPC Preload Bridge (`src/preload/index.ts`)

```typescript
import { ipcRenderer } from 'electron';

export const terminalBridge = {
  // Listen to live system logs written by main process
  onLogReceived: (callback: (log: any) => void) => {
    ipcRenderer.on('app:log-broadcast', (_, log) => callback(log));
  },
  // Send execution commands down to terminal service
  executeCommand: (command: string) => ipcRenderer.invoke('terminal:execute', command)
};

```

### React State Model

```typescript
export interface LogEntry {
  type: 'log' | 'error' | 'warning';
  timestamp: string;
  fileName: string;
  lineNumber: number;
  message: string;
}

export interface TerminalLine {
  id: string;
  type: 'command_input' | 'command_output' | 'system_log';
  content: string | LogEntry;
  timestamp: Date;
}

export interface TerminalState {
  history: TerminalLine[];
  currentInput: string;
}

```

---