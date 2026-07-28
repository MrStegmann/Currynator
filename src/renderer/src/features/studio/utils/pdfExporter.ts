/**
 * Utility functions for client-side PDF export of Resumes and Study Guides.
 */

/**
 * Extracts and collects all inline style tag contents and external stylesheet elements from active DOM.
 * @returns Concatenated HTML string containing active CSS rules.
 */
export function getActiveDomStylesHtml(): string {
  if (typeof document === 'undefined') return '';
  const styles: string[] = [];

  const styleNodes = document.querySelectorAll('style');
  styleNodes.forEach((node) => {
    if (node.innerHTML) {
      styles.push(`<style>${node.innerHTML}</style>`);
    }
  });

  const linkNodes = document.querySelectorAll('link[rel="stylesheet"]');
  linkNodes.forEach((link) => {
    styles.push(link.outerHTML);
  });

  return styles.join('\n');
}

/**
 * Builds standard styled HTML document string for ATS PDF export with full CSS rule embedding.
 * @param innerHtml - Raw DOM inner HTML string of resume element.
 * @param documentTitle - Export document title.
 * @returns Styled complete HTML document string.
 */
export function buildExportableHtmlString(innerHtml: string, documentTitle: string): string {
  const domStyles = getActiveDomStylesHtml();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        ${domStyles}
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #000000;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          * {
            box-sizing: border-box;
          }
          .ats-monochrome-container {
            color: #000000 !important;
            width: 100% !important;
            word-break: break-word !important;
          }
          .ats-monochrome-container * {
            color: #000000 !important;
            border-color: #000000 !important;
          }
        </style>
      </head>
      <body>
        ${innerHtml}
      </body>
    </html>
  `;
}

/**
 * Automatically exports target element as PDF via Main process Puppeteer engine,
 * saving directly into the user's default CV directory.
 * @param containerId - DOM element container ID containing printable markup.
 * @param resumeTitle - Resume title for document filename.
 * @returns Promise resolving to IPC result object with success status and filePath.
 */
export async function exportResumePdfAutomated(
  containerId: string,
  resumeTitle: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  const element = document.getElementById(containerId);
  if (!element) {
    console.error(`Export failed: element #${containerId} not found.`);
    return { success: false, error: `Element #${containerId} not found in DOM.` };
  }

  const htmlContent = buildExportableHtmlString(element.outerHTML, resumeTitle);

  if (window.electronAPI && typeof window.electronAPI.exportResumePdfAuto === 'function') {
    return await window.electronAPI.exportResumePdfAuto({
      html: htmlContent,
      resumeTitle
    });
  }

  // Fallback if electronAPI is not connected (e.g. standard browser preview)
  exportElementToPdf(containerId, resumeTitle);
  return { success: true };
}

/**
 * Triggers a native browser print dialog for target container ID.
 * @param containerId - HTML DOM element ID containing printable markup.
 * @param documentTitle - Export file title.
 */
export function exportElementToPdf(containerId: string, documentTitle: string): void {
  const element = document.getElementById(containerId);
  if (!element) {
    console.error(`Export failed: element #${containerId} not found.`);
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert('Please allow popups to export PDF documents.');
    return;
  }

  const html = buildExportableHtmlString(element.outerHTML, documentTitle);

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}
