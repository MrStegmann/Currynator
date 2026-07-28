import { ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { generatePDF } from '../services/pdf.service.js';
import { readSettings, getSafeDataFolderPath } from '../utils/settings.js';

/**
 * Sanitizes a document title to create a safe OS file basename.
 * @param title - The raw document or resume title string.
 * @returns Safe filename string ending with .pdf extension.
 */
export function sanitizePdfFilename(title: string): string {
  const cleanTitle = (title || 'resume')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim();
  const baseName = cleanTitle.endsWith('.pdf') ? cleanTitle : `${cleanTitle}.pdf`;
  return baseName;
}

/**
 * Helper to execute PDF generation and directory resolution for auto PDF export.
 * Uses safe path fallback if writing to target data folder encounters OS permission locks.
 * @param html - HTML string representation of the resume layout.
 * @param resumeTitle - Resume title for target filename construction.
 * @returns Absolute output file path of saved PDF.
 * @throws Error if file writing or PDF compilation fails.
 */
async function processAutoPdfExport(html: string, resumeTitle: string): Promise<string> {
  const settings = await readSettings();
  let dataFolder = settings.dataFolderPath;

  try {
    await fs.mkdir(path.join(dataFolder, 'Resume'), { recursive: true });
  } catch (_err: unknown) {
    dataFolder = await getSafeDataFolderPath();
  }

  const resumeDir = path.join(dataFolder, 'Resume');
  await fs.mkdir(resumeDir, { recursive: true });

  const fileName = sanitizePdfFilename(resumeTitle);
  const outputPath = path.join(resumeDir, fileName);

  await generatePDF(html, outputPath);
  return outputPath;
}

/**
 * Registers IPC handlers for automated PDF exports saved directly into the user's CV directory.
 */
export function registerPdfIpcHandlers(): void {
  ipcMain.handle('export-resume-pdf-auto', async (_event, payload: { html: string; resumeTitle: string }) => {
    try {
      if (!payload || !payload.html) {
        return { success: false, error: 'Invalid payload: HTML content missing.' };
      }
      const filePath = await processAutoPdfExport(payload.html, payload.resumeTitle);
      return { success: true, filePath };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to export resume PDF automatically.';
      console.error('export-resume-pdf-auto IPC Error:', error);
      return { success: false, error: errMsg };
    }
  });
}
