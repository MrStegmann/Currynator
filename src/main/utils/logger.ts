import { BrowserWindow } from 'electron';

export interface BaseLog {
  type: 'log' | 'error' | 'warning';
  timestamp: Date;
  fileName: string;
  lineNumber: number;
  message: string;
}

function sendLogToRenderers(log: BaseLog) {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(win => {
    win.webContents.send('terminal-log', log);
  });
}

function getCallerInfo(): { fileName: string; lineNumber: number } {
  const err = new Error();
  const stack = err.stack?.split('\n') || [];
  // Stack format: 
  // Error
  //   at getCallerInfo ...
  //   at new Log ...
  //   at CallerFunction ...
  let callerLine = stack[3] || '';
  let fileName = 'unknown';
  let lineNumber = 0;

  const match = callerLine.match(/(?:at\s+.*?\s+\()?(.*?):(\d+):\d+\)?/);
  if (match) {
    fileName = match[1].split(/[\\/]/).pop() || 'unknown';
    lineNumber = parseInt(match[2], 10) || 0;
  }
  return { fileName, lineNumber };
}

export class Log {
  constructor(message: string) {
    const caller = getCallerInfo();
    const logObj: BaseLog = {
      type: 'log',
      timestamp: new Date(),
      fileName: caller.fileName,
      lineNumber: caller.lineNumber,
      message
    };
    sendLogToRenderers(logObj);
  }
}

export class ErrorLog {
  constructor(message: string) {
    const caller = getCallerInfo();
    const logObj: BaseLog = {
      type: 'error',
      timestamp: new Date(),
      fileName: caller.fileName,
      lineNumber: caller.lineNumber,
      message
    };
    sendLogToRenderers(logObj);
  }
}

export class WarningLog {
  constructor(message: string) {
    const caller = getCallerInfo();
    const logObj: BaseLog = {
      type: 'warning',
      timestamp: new Date(),
      fileName: caller.fileName,
      lineNumber: caller.lineNumber,
      message
    };
    sendLogToRenderers(logObj);
  }
}
