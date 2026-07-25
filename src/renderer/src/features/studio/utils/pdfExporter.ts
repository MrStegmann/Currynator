/**
 * Utility functions for client-side PDF export of Resumes and Study Guides.
 */

/**
 * Triggers a native print dialog for the target element container ID.
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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${documentTitle}</title>
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
          /* Enforce strict monochrome and overflow rules */
          .ats-monochrome-container {
            color: #000000 !important;
            width: 100% !important;
            word-break: break-word !important;
            overflow: hidden !important;
          }
          .ats-monochrome-container * {
            color: #000000 !important;
            border-color: #000000 !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
