import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export interface BaseLog {
  type: 'log' | 'error' | 'warning';
  timestamp: Date;
  fileName: string;
  lineNumber: number;
  message: string;
}

const logHistory: BaseLog[] = [];
let logFilePath = '';
const fileWriteQueue: BaseLog[] = [];

function getErrorLogFilePath() {
  return path.join(process.cwd(), 'error.log');
}

function writeToErrorLogFile(fileName: string, lineNumber: number, message: string) {
  const filePath = getErrorLogFilePath();
  try {
    const logLine = `[${fileName}:${lineNumber}] ${message}\n`;
    fs.appendFileSync(filePath, logLine);
  } catch (err) {
    console.error('[LOGGER] Failed to write to error log file:', err);
  }
}

function parseStackForCaller(stack: string = ''): { fileName: string; lineNumber: number } {
  try {
    const lines = stack.split('\n');
    let callerLine = lines[1] || lines[0] || '';
    
    for (const line of lines) {
      if (line.includes('at ') && !line.includes('logger.ts') && !line.includes('logger.js')) {
        callerLine = line;
        break;
      }
    }

    const match = callerLine.match(/(?:at\s+.*?\s+\()?(.*?):(\d+):\d+\)?/);
    if (match && match[1] && match[2]) {
      let fullPath = match[1];
      if (fullPath.startsWith('file:///')) fullPath = fullPath.replace('file:///', '');
      else if (fullPath.startsWith('file://')) fullPath = fullPath.replace('file://', '');
      
      const fileName = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
      const lineNumber = parseInt(match[2], 10) || 0;
      return { fileName, lineNumber };
    }
    return { fileName: 'unknown', lineNumber: 0 };
  } catch (e) {
    return { fileName: 'unknown', lineNumber: 0 };
  }
}

process.on('uncaughtException', (error) => {
  const caller = parseStackForCaller(error.stack);
  // Route through the unified pipeline so errors appear in app.log
  sendLogToRenderers({
    type: 'error',
    timestamp: new Date(),
    fileName: caller.fileName,
    lineNumber: caller.lineNumber,
    message: error.message || String(error)
  });
});

process.on('unhandledRejection', (reason: unknown) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  const caller = parseStackForCaller(err.stack);
  sendLogToRenderers({
    type: 'error',
    timestamp: new Date(),
    fileName: caller.fileName,
    lineNumber: caller.lineNumber,
    message: err.message
  });
});

function getLogFilePath() {
  if (logFilePath) return logFilePath;
  if (!app || !app.isReady()) {
    console.log('[LOGGER] App not ready, returning empty path.');
    return '';
  }
  try {
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) {
      console.log('[LOGGER] Creating log directory:', logDir);
      fs.mkdirSync(logDir, { recursive: true });
    }
    logFilePath = path.join(logDir, 'app.log');
    console.log('[LOGGER] Log file path resolved to:', logFilePath);
  } catch (e) {
    console.error('[LOGGER] Error creating log directory:', e);
  }
  return logFilePath;
}

function writeToLogFile(log: BaseLog) {
  const filePath = getLogFilePath();
  if (!filePath) {
    console.log('[LOGGER] File path empty, queuing log.');
    fileWriteQueue.push(log);
    return;
  }
  
  try {
    if (fileWriteQueue.length > 0) {
      console.log(`[LOGGER] Flushing ${fileWriteQueue.length} queued logs.`);
      const lines = fileWriteQueue.map(l => `[${new Date(l.timestamp).toISOString()}] [${l.type.toUpperCase()}] [${l.fileName}:${l.lineNumber}] ${l.message}\n`).join('');
      fs.appendFileSync(filePath, lines);
      fileWriteQueue.length = 0;
    }
    const logLine = `[${new Date(log.timestamp).toISOString()}] [${log.type.toUpperCase()}] [${log.fileName}:${log.lineNumber}] ${log.message}\n`;
    fs.appendFileSync(filePath, logLine);
  } catch (err) {
    console.error('[LOGGER] Failed to write to log file:', err);
  }
}

if (app) {
  app.whenReady().then(() => {
    // Eagerly resolve path and ensure directory exists
    getLogFilePath();
    
    if (fileWriteQueue.length > 0) {
      const log = fileWriteQueue.shift();
      if (log) writeToLogFile(log);
    }
  });
}

if (ipcMain) {
  ipcMain.on('renderer-error', (event, errorInfo) => {
    let fn = errorInfo.fileName || 'unknown';
    if (fn.startsWith('file:///')) fn = fn.replace('file:///', '');
    else if (fn.startsWith('file://')) fn = fn.replace('file://', '');
    const relativeName = path.relative(process.cwd(), fn).replace(/\\/g, '/');
    writeToErrorLogFile(relativeName, errorInfo.lineNumber, errorInfo.message);
  });
}

function sendLogToRenderers(log: BaseLog) {
  logHistory.push(log);
  writeToLogFile(log);

  if (log.type === 'error') console.error(`[ERROR] ${log.fileName}:${log.lineNumber} - ${log.message}`);
  else if (log.type === 'warning') console.warn(`[WARN] ${log.fileName}:${log.lineNumber} - ${log.message}`);
  else console.log(`[INFO] ${log.fileName}:${log.lineNumber} - ${log.message}`);

  const windows = BrowserWindow.getAllWindows();
  windows.forEach(win => {
    if (win.webContents && !win.webContents.isDestroyed()) {
      // Serialize as a plain JSON-compatible object before crossing the IPC bridge.
      // Sending the raw BaseLog (with timestamp: Date) causes Electron's structuredClone
      // to preserve a Date object, which the renderer-side isLogEntry guard rejects
      // because it expects typeof timestamp === 'string'. Converting here ensures
      // the payload always arrives as a clean, type-guard-compatible plain object.
      win.webContents.send('app:log-broadcast', {
        type: log.type,
        timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : String(log.timestamp),
        fileName: log.fileName,
        lineNumber: log.lineNumber,
        message: log.message
      });
    }
  });
}

function getCallerInfo(): { fileName: string; lineNumber: number } {
  try {
    const err = new Error();
    const stack = err.stack?.split('\n') || [];
    let callerLine = stack[3] || '';
    let fileName = 'unknown';
    let lineNumber = 0;

    const match = callerLine.match(/(?:at\s+.*?\s+\()?(.*?):(\d+):\d+\)?/);
    if (match && match[1] && match[2]) {
      fileName = match[1].split(/[\\/]/).pop() || 'unknown';
      lineNumber = parseInt(match[2], 10) || 0;
    }
    return { fileName, lineNumber };
  } catch (e) {
    return { fileName: 'unknown', lineNumber: 0 };
  }
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
    
    // Also log to the root error.log using the parseStackForCaller for accurate route
    const preciseCaller = parseStackForCaller(new Error().stack);
    writeToErrorLogFile(preciseCaller.fileName, preciseCaller.lineNumber, message);
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
