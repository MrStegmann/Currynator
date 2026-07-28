import { ipcMain } from 'electron';
import { optimizeResumeStepWithGroq, type StepOptimizationPayload } from '../services/groq.service.js';

/**
 * Registers IPC event listeners for AI Resume Optimization Wizard steps.
 */
export function registerAiOptimizationIpcHandlers(): void {
  ipcMain.handle('studio:optimize-step', async (_event, payload: StepOptimizationPayload) => {
    try {
      const result = await optimizeResumeStepWithGroq(payload);
      return { success: true, proposal: result.proposal, reasoning: result.reasoning };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error during AI step optimization';
      console.error('studio:optimize-step IPC error:', error);
      return { success: false, error: errMsg };
    }
  });
}
