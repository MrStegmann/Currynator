import { Log, ErrorLog, WarningLog } from '../utils/logger.js';

export async function executeTerminalCommand(commandStr: string): Promise<string> {
  const cmd = commandStr.trim().toLowerCase();
  
  if (!cmd) return '';

  if (cmd === 'help') {
    new Log('Available commands: help, clear, exit, echo <text>');
    return '';
  }

  if (cmd.startsWith('echo ')) {
    const text = commandStr.substring(5);
    new Log(text);
    return '';
  }

  if (cmd === 'echo') {
    new ErrorLog('echo requires an argument');
    return '';
  }

  if (cmd === 'clear' || cmd === 'exit') {
     // These are typically intercepted by the frontend, but handled gracefully here
     return ''; 
  }

  new WarningLog(`Command not recognized: ${commandStr}`);
  return '';
}
