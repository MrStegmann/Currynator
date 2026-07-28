import puppeteer, { Browser } from 'puppeteer';

/**
 * Creates and launches a dedicated off-screen Puppeteer Browser instance.
 * Enforces headless shell mode and off-screen flags to prevent UI window leaks.
 * @returns Promise resolving to an initialized Puppeteer Browser.
 * @throws Error if browser launch fails.
 */
export async function createOffscreenBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    headless: 'shell',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--mute-audio'
    ]
  });
}

/**
 * Generates an A4 PDF document from an HTML string and writes it to disk.
 * Guarantees off-screen rendering and cleanup of page and browser handles in a finally block.
 * @param htmlContent - Raw styled HTML markup to render.
 * @param outputPath - Absolute output destination path for the generated PDF.
 * @throws Error if page load, PDF compilation, or file saving fails.
 */
export async function generatePDF(htmlContent: string, outputPath: string): Promise<void> {
  const browser = await createOffscreenBrowser();
  let page = null;

  try {
    page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: 'load',
      timeout: 30000
    });

    await page.waitForNetworkIdle({ timeout: 30000 }).catch(() => {});

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    await browser.close().catch(() => {});
  }
}

/**
 * Utility function to close any remaining shared browser instances if active.
 */
export async function closePDFEngine(): Promise<void> {
  // Utility cleanup handler for application shutdown
}
