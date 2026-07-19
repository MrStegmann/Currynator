export interface TerminalLog {
  type: 'log' | 'error' | 'warning';
  timestamp: Date;
  fileName: string;
  lineNumber: number;
  message: string;
}

export interface TerminalState {
  input: string;
  output: string;
  logs: TerminalLog[];
}
