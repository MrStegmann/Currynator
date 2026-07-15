import puppeteer, { Browser } from 'puppeteer';

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browserInstance;
}

export async function generatePDF(htmlContent: string, outputPath: string): Promise<void> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    // Establecer el contenido HTML y esperar a que no haya peticiones de red pendientes
    await page.setContent(htmlContent, {
      waitUntil: 'load',
      timeout: 30000
    });
    // Esperar a network idle por si hay recursos externos que se cargan después del evento load
    await page.waitForNetworkIdle({ timeout: 30000 }).catch(() => {});
    
    // Generar el PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true, // Mantiene colores de fondo de elementos explícitos
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });
  } finally {
    // Asegurar que la pestaña se cierra para evitar memory leaks
    await page.close();
  }
}

export async function closePDFEngine(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
