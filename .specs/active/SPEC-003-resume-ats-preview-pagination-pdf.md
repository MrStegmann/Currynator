# SPEC-003: ATS Resume Preview Refactoring, Multi-Page A4 Pagination, and Automated PDF Export

- **Status:** APPROVED
- **Author:** Gemini Code Agent
- **Created Date:** 2026-07-28
- **Target Feature Path:** `src/renderer/src/features/studio/`

---

## 1. Executive Summary & Problem Statement

### Problem Statement
1. **Text Truncation & Ellipsis in Resume View**: `ResumeATSPreview.tsx` currently uses CSS truncation (`truncate`, `overflow-hidden`, `text-ellipsis`) on contact fields and section items. This clips candidate data with ellipses (`...`), breaking ATS parsing readability and obscuring vital profile information.
2. **Lack of A4 Multi-Page Pagination**: When resume content is extensive (multiple work experiences, large skill sets, long project descriptions), the preview renders as a single overflowing box without true A4 page boundaries. This results in content overflowing page bounds unpredictably when printed or exported to PDF, cutting text mid-line across pages.
3. **Manual / Interactive PDF Save Flow & Incorrect Directory Paths**: Exporting a resume to PDF currently relies on browser popup print dialogs (`exportElementToPdf` window printing) or interactive file save dialogs (`dialog.showSaveDialog`). It does not automatically save the generated PDF into the default documents folder (`~/documents/Currynator/Resume/`). Furthermore, the Installer Wizard hardcoded `C:\Users\Default\...` as a default path, causing OS permission errors (`EPERM`).
4. **PDF Service Visual Lifecycle Bug**: Exporting a PDF spawns a persistent white untouchable window on screen that remains open after export completes, caused by unclosed popup window handles or Puppeteer headless browser window instances without off-screen isolation.
5. **PDF Export Unstyled Layout & Native Alert UX**: Generated PDFs currently lack CSS styling because raw inner HTML is sent without embedding active application Tailwind CSS stylesheets. Additionally, PDF export uses native browser `window.alert()` instead of `NotificationContext`, lacks visual loading indicators, allows duplicate clicks, and renders the PDF export button outside Resume View mode.

### Proposed Solution
1. **Refactor `ResumeATSPreview.tsx`**: Eliminate all `truncate` and line-clipping CSS classes. Enforce natural text wrapping (`break-words`, `overflow-wrap: break-word`, `whitespace-normal`) while preserving strict monochrome typography (#000000) and two-column ATS structural standards.
2. **Google Docs-Style Multi-Page A4 View**: Implement dynamic page partitioning utilities (`paginationUtils.ts`) and a paginated document renderer (`ResumePaginatedView.tsx`). The canvas evaluates content height against printable A4 paper boundaries (210mm x 297mm / ~1123px height). If content exceeds one page height, it cleanly splits across multiple visually separated A4 pages with page margins, shadow gaps, and page count indicators ("Page 1 of N").
3. **Automated PDF Export to `~/documents/Currynator/Resume/`**: Add a dedicated Main Process IPC service handler (`export-resume-pdf-auto` in `src/main/ipc/pdf.ipc.ts`) that accepts rendered HTML/resume layout, compiles an A4 PDF using Puppeteer (`pdf.service.ts`), and automatically saves it to `<dataFolderPath>/Resume/<Resume_Title>.pdf` without opening prompt dialogs. Update default paths in `settings.ts` and `InstallerWizard` to dynamically resolve `app.getPath('documents')/Currynator`.
4. **Off-Screen Window Configuration & Guaranteed Cleanup**: Update `pdf.service.ts` to launch Puppeteer with explicit off-screen flags (`headless: 'shell'` / `--headless=new`, `--disable-gpu`, `--hide-scrollbars`, `--mute-audio`, `--no-sandbox`) and enforce guaranteed page and browser destruction (`await page.close()`, `await browser.close()`) inside a `finally` block to prevent persistent white windows.
5. **Identical PDF Styling, `NotificationContext` & Mode Scoping**:
   - Embed all active document `<style>` elements and `<link rel="stylesheet">` tags in `pdfExporter.ts` so Puppeteer renders PDFs 100% identical to the screen preview.
   - Replace native `window.alert()` with `useNotification()` from `NotificationContext`.
   - Render the Export PDF button ONLY when `viewMode === 'preview'` (Resume View Mode).
   - Display a spinning loading icon (`Loader2` spinner), update button text to "Exporting PDF...", and disable the button while export is active, re-enabling it when the notification triggers.

---

## 2. Functional Requirements

- [ ] **FR-1 (Ellipsis Removal & ATS Natural Wrapping)**: `ResumeATSPreview` must remove all `truncate` and `overflow-hidden` styles from contact details, headers, experience descriptions, and project lists. All text must wrap naturally without clipping or ellipses.
- [ ] **FR-2 (A4 Paper Geometry & Constraints)**: Each document page in preview mode must strictly adhere to A4 dimensions (210mm width x 297mm height) with standard padding (12mm).
- [ ] **FR-3 (Dynamic Multi-Page Pagination)**: If content height fits within 297mm, render a single A4 page. If content exceeds 297mm, measure section node heights dynamically and split content cleanly into Page 1, Page 2, etc., avoiding awkward mid-line element breaks.
- [ ] **FR-4 (Google Docs Preview Aesthetics)**: Paginated pages in the Studio canvas must be rendered sequentially with vertical gaps (gap-6), drop shadows (shadow-2xl), page number badges ("Page X of Y"), and clean visual dividers.
- [ ] **FR-5 (Automated PDF Export to `Resume/` Subfolder & Mode Scoping)**: The Export PDF button must be rendered/visible ONLY when `viewMode === 'preview'` (Resume View Mode). Clicking "Export PDF" invokes `window.electronAPI.exportResumePdfAuto` and saves to `<dataFolderPath>/Resume/<Clean_Resume_Title>.pdf`.
- [ ] **FR-6 (User Toast Notification via `NotificationContext`)**: Replace browser native `window.alert()` with `addNotification` from `NotificationContext` to notify users of successful file export or error states.
- [ ] **FR-7 (Safe Path Resolution & EPERM Permission Fallback)**: Main process directory resolution (`settings.ts` and `pdf.ipc.ts`) and Installer Wizard (`InstallerWizard/index.tsx`) must resolve `dataFolderPath` to user-scoped `~/documents/Currynator/` dynamically via `app.getPath('documents')`. If writing to `dataFolderPath` fails or encounters `EPERM`/`EACCES` locks (e.g. `C:\Users\Default\`), automatically fall back to `path.join(app.getPath('userData'), 'documents')` and ensure target subdirectories (`Resume/`, `data/`, `study/`) exist cleanly.
- [ ] **FR-8 (Off-Screen PDF Engine & Window Lifecycle Cleanup)**: PDF export must execute 100% off-screen without displaying blank/white popup windows. Browser and page instances must be explicitly destroyed (`page.close()`, `browser.close()`) in `finally` blocks.
- [ ] **FR-9 (Visual Loading Feedback & Button Disable State)**: While PDF export is in progress, the Export PDF button must display a spinning loader icon (`Loader2`), change label to "Exporting PDF...", and be disabled. Once the export completes and notification triggers, visual loading stops and button re-enables.
- [ ] **FR-10 (Full CSS Style Embedding for PDF Export)**: `pdfExporter.ts` must extract and embed all active application `<style>` and `<link rel="stylesheet">` elements into the exported HTML `<head>`, ensuring the generated PDF retains 100% accurate Tailwind CSS styling identical to the Resume ATS preview canvas.

---

## 3. Technical Architecture & File Plan

### New Files
- `src/renderer/src/features/studio/components/canvas/ResumePaginatedView.tsx` (Multi-page A4 canvas container with pagination logic)
- `src/renderer/src/features/studio/utils/paginationUtils.ts` (Pure utility functions for section height measurement & page distribution)
- `src/renderer/src/features/studio/types/pagination.types.ts` (Zod schemas and TypeScript interfaces for pagination)
- `src/main/ipc/pdf.ipc.ts` (IPC channel handlers for automated PDF export with safe path fallback)

### Modified Files
- `src/main/services/pdf.service.ts` (Enforce off-screen Puppeteer launch arguments and guaranteed `finally` block browser/page destruction)
- `src/main/utils/settings.ts` (Set default `dataFolderPath` to `~/documents/Currynator/`, create `Resume/` subfolder, and implement `getSafeDataFolderPath()`)
- `src/renderer/src/features/installer/InstallerWizard/index.tsx` (Remove hardcoded `C:\Users\Default\...` path, dynamic resolution via `getSettings()`)
- `src/renderer/src/features/studio/components/canvas/CanvasHeaderBar.tsx` (Render Export PDF button ONLY when `viewMode === 'preview'`, add `isExporting` loading spinner & disabled state)
- `src/renderer/src/features/studio/components/canvas/StudioCanvas.tsx` (Pass `isExporting` prop to `CanvasHeaderBar`)
- `src/renderer/src/features/studio/components/canvas/ResumeATSPreview.tsx` (Refactored to remove truncation & support paginated block rendering)
- `src/renderer/src/features/studio/components/canvas/ResumeContentContainer.tsx` (Integrated with `ResumePaginatedView`)
- `src/renderer/src/features/studio/components/canvas/index.ts` (Barrel exports)
- `src/renderer/src/features/studio/utils/pdfExporter.ts` (Collect active document styles into `<head>` & call `exportResumePdfAuto`)
- `src/renderer/src/features/studio/index.tsx` (Manage `isExporting` state, replace `alert()` with `useNotification()`)
- `src/preload/index.ts` (Exposed `exportResumePdfAuto` in `electronAPI`)
- `src/main/index.ts` (Registered `registerPdfIpcHandlers` and updated `CV/` references to `Resume/`)

---

## 4. API & Data Flow Contracts

### IPC Channels

#### `export-resume-pdf-auto`
- **Direction**: Renderer -> Main -> Renderer
- **Description**: Generates an A4 PDF from raw HTML and saves it automatically to `<dataFolderPath>/Resume/<resumeTitle>.pdf`.
- **Payload**:
  ```typescript
  {
    html: string;
    resumeTitle: string;
  }
  ```
- **Return Value**:
  ```typescript
  {
    success: boolean;
    filePath?: string;
    error?: string;
  }
  ```

### Preload API Exposure
```typescript
// Add to electronAPI bridge in src/preload/index.ts:
exportResumePdfAuto: (payload: { html: string; resumeTitle: string }) =>
  ipcRenderer.invoke('export-resume-pdf-auto', payload);
```

### Data Schemas & Zod Contracts
```typescript
import { z } from 'zod';

export const ExportResumePdfAutoSchema = z.object({
  html: z.string().min(1, 'HTML string cannot be empty'),
  resumeTitle: z.string().min(1, 'Resume title is required')
});

export const ExportResumePdfResponseSchema = z.object({
  success: z.boolean(),
  filePath: z.string().optional(),
  error: z.string().optional()
});

export type ExportResumePdfAutoInput = z.infer<typeof ExportResumePdfAutoSchema>;
export type ExportResumePdfResponse = z.infer<typeof ExportResumePdfResponseSchema>;
```

---

## 5. Non-Functional & Security Constraints

- **Mandatory JSDoc**: Every new or modified function, hook, utility, or component must include complete JSDoc annotations detailing `@param`, `@returns`, and `@throws`.
- **Function Size & SRP**: All functions must be small and focused (under 40-50 lines). Utility routines like `partitionSectionsToPages` must be modularized into discrete helper functions.
- **Strict TypeScript & Zod Validation**: Zero usage of `any`. All IPC input parameters must be validated with Zod schemas.
- **Path Sanitization**: Resume titles used as output PDF filenames must be sanitized (removing unsafe OS characters like `/ \ : * ? " < > |`).
- **A4 Rendering Accuracy**: Puppeteer PDF generation must specify `@page { size: A4; margin: 0; }` with `printBackground: true` to align 1:1 with the preview canvas.
- **CSS Style Embedding**: `pdfExporter.ts` must bundle all DOM `<style>` and `<link rel="stylesheet">` contents into the generated HTML string sent to Puppeteer, guaranteeing full Tailwind CSS visual rendering matching screen view.
- **Off-Screen Rendering & Window Lifecycle Cleanup**:
  - PDF generation in `pdf.service.ts` must execute 100% off-screen using explicit Puppeteer arguments (`headless: 'shell'` or `--headless=new`, `--disable-gpu`, `--hide-scrollbars`, `--mute-audio`, `--no-sandbox`).
  - Page handles (`page.close()`) and browser handles (`browser.close()`) must be destroyed inside `finally` blocks to guarantee no persistent white windows or background process memory leaks remain.
- **Off-Screen Instantiation:** Ensure any temporary rendering window is created with `show: false`, `focusable: false`, and `skipTaskbar: true`.
- **Guaranteed Destruction:** Wrap the PDF generation pipeline in a `try / catch / finally` block. The hidden rendering window or browser instance MUST be explicitly destroyed in the `finally` block to prevent lingering UI processes:
```TypeScript
let workerWindow: BrowserWindow | null = null;
try {
  workerWindow = new BrowserWindow({ show: false, skipTaskbar: true });
  // Render and export logic...
} finally {
  if (workerWindow && !workerWindow.isDestroyed()) {
    workerWindow.destroy(); // Force release window resources
  }
}
```

---

## 6. Implementation Checklist

- [ ] **Step 1: Specifications & Types**
  - Create `src/renderer/src/features/studio/types/pagination.types.ts` with Zod schemas for IPC and pagination contracts.

- [ ] **Step 2: PDF Service Off-Screen Configuration & Cleanup**
  - Update `src/main/services/pdf.service.ts` to launch Puppeteer with explicit off-screen flags (`headless: 'shell'`, `--headless=new`, `--disable-gpu`, `--hide-scrollbars`, `--mute-audio`).
  - Enforce browser instance destruction (`await browser.close()`) inside `finally` block per PDF generation call.

- [ ] **Step 3: Default Directory Resolution & `Resume/` Subfolder**
  - Update `src/main/utils/settings.ts` default path to `path.join(app.getPath('documents'), 'Currynator')` and create subdirectories: `Resume/`, `data/`, `study/`, `aiReasoning/`.
  - Update `src/renderer/src/features/installer/InstallerWizard/index.tsx` to remove hardcoded `C:\Users\Default\...` path and fetch `dataFolderPath` dynamically via `getSettings()`.
  - Update `src/main/ipc/pdf.ipc.ts` and `src/main/index.ts` to save generated resumes and PDFs inside `dataFolderPath/Resume/`.

- [ ] **Step 4: Preload Exposure**
  - Update `src/preload/index.ts` to expose `exportResumePdfAuto` in `electronAPI`.

- [ ] **Step 5: Refactor `ResumeATSPreview.tsx`**
  - Remove all instances of `truncate`, `overflow-hidden`, and text clipping classes.
  - Update text containers to use `break-words` and `whitespace-normal`.

- [ ] **Step 6: Pagination Utility & Multi-Page View**
  - Implement `src/renderer/src/features/studio/utils/paginationUtils.ts` to measure sections and compute page splits.
  - Implement `src/renderer/src/features/studio/components/canvas/ResumePaginatedView.tsx` to render multi-page A4 sheets with shadows, gaps, and page badges.

- [ ] **Step 7: UI Orchestration, Notifications, Styling & Export Trigger**
  - Update `src/renderer/src/features/studio/utils/pdfExporter.ts` to bundle active document `<style>` elements so PDF output retains 100% Tailwind CSS styling.
  - Update `CanvasHeaderBar.tsx` to render Export PDF button ONLY when `viewMode === 'preview'`, add `isExporting` spinner icon and disabled state.
  - Update `src/renderer/src/features/studio/index.tsx` to replace `window.alert()` with `useNotification()` toast notifications.

- [ ] **Step 8: Verification**
  - Run `npm run lint` and verify clean build with Oxlint.
