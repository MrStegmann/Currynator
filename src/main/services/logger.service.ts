/**
 * @file logger.service.ts
 * @description Public facade for the application logger system.
 *
 * Re-exports the structured log classes from the internal utility module,
 * satisfying the spec dependency contract (`src/main/services/logger.service.ts`)
 * while keeping the actual I/O and IPC broadcasting logic in `utils/logger.ts`.
 *
 * Usage:
 *   import { Log, WarningLog, ErrorLog } from '../services/logger.service.js';
 *   new Log('Something happened here.');
 */

export { Log, WarningLog, ErrorLog } from '../utils/logger.js';
export type { BaseLog } from '../utils/logger.js';
