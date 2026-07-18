import { app, BrowserWindow, screen, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { validateCVData } from './utils/validation.js';
import { generateCVFromGemini, generateStudyGuideFromGemini } from './services/gemini.js';
import { generatePDF, closePDFEngine } from './services/pdf.js';
import { readSettings, saveSettings } from './utils/settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Calculamos el 40% del ancho y el 55% del alto
  const windowWidth = Math.floor(width * 0.80);
  const windowHeight = Math.floor(height * 0.80);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: false, // Sin barra de acciones del SO
    transparent: true, // Requerido para el efecto cristal en el borde
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs') // asumiendo compilación de TS a JS
    }
  });

  // Cargar la aplicación según el entorno
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Inicialización de la aplicación
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Manejo de eventos de la barra de título personalizados (IPC)
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle('get-settings', async () => {
  try {
    const settings = await readSettings();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    const newSettings = await saveSettings(settings);
    return { success: true, data: newSettings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return { success: false, error: 'No main window' };
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, canceled: true };
  }
  return { success: true, path: result.filePaths[0] };
});


ipcMain.handle('save-resume-data', async (event, data, options: any = {}) => {
  try {
    // 1. Validar los datos
    const validData = validateCVData(data);

    let defaultFileName = data.profileLabel ? `${data.profileLabel}.json` : 'cv.json';
    const settings = await readSettings();
    let defaultDirPath = path.join(settings.dataFolderPath, 'data');
    
    if (options.isGenerated) {
      defaultDirPath = path.join(settings.dataFolderPath, 'CV');
      if (options.customFileName) {
        defaultFileName = options.customFileName;
      }
      await fs.mkdir(defaultDirPath, { recursive: true });
    }

    let filePath: string;
    
    if (options.skipDialog && defaultDirPath && defaultFileName) {
      filePath = path.join(defaultDirPath, defaultFileName);
    } else {
      // 2. Preguntar al usuario dónde guardar
      if (!mainWindow) throw new Error("No main window");
      const { canceled, filePath: dialogFilePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Guardar Currículum (JSON)',
        defaultPath: path.join(defaultDirPath, defaultFileName),
        filters: [{ name: 'Archivos JSON', extensions: ['json'] }]
      });

      if (canceled || !dialogFilePath) return { success: false, canceled: true };
      filePath = dialogFilePath;
    }

    // 3. Escribir el archivo en disco
    await fs.writeFile(filePath, JSON.stringify(validData, null, 2), 'utf-8');

    if (options.isGenerated && validData.razonamiento_ia) {
      try {
        const aiDir = path.join(settings.dataFolderPath, 'aiReasoning');
        await fs.mkdir(aiDir, { recursive: true });
        
        let baseName = path.basename(filePath, '.json');
        if (baseName.endsWith('_CV_Optimizated')) {
           baseName = baseName.replace('_CV_Optimizated', '');
        }
        
        const mdPath = path.join(aiDir, `${baseName}-ai_reasoning.md`);
        await fs.writeFile(mdPath, validData.razonamiento_ia, 'utf-8');
      } catch (err) {
        console.error("Error saving AI reasoning MD:", err);
      }
    }

    return { success: true, filePath };
  } catch (error: any) {
    console.error("Error validando/guardando CV:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-ai-reasoning', async (event, filename) => {
  try {
    const settings = await readSettings();
    const aiDir = path.join(settings.dataFolderPath, 'aiReasoning');
    let baseName = filename.replace('.json', '');
    if (baseName.endsWith('_CV_Optimizated')) {
       baseName = baseName.replace('_CV_Optimizated', '');
    }
    const mdPath = path.join(aiDir, `${baseName}-ai_reasoning.md`);
    const content = await fs.readFile(mdPath, 'utf-8');
    return { success: true, data: content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle('list-resume-data', async () => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'data');
    await fs.mkdir(dataDir, { recursive: true }); // Asegura que el dir existe
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    return { success: true, files: jsonFiles };
  } catch (error: any) {
    console.error("Error listando CVs:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-resume-data', async (event, filename) => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'data');
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch (error: any) {
    console.error(`Error leyendo ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-resume-data', async (event, filename) => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'data');
    const filePath = path.join(dataDir, filename);
    await fs.unlink(filePath);
    return { success: true };
  } catch (error: any) {
    console.error(`Error borrando ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-generated-cvs', async () => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'CV');
    await fs.mkdir(dataDir, { recursive: true });
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const filesWithMeta = [];
    for (const f of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(dataDir, f), 'utf-8');
        const parsed = JSON.parse(content);
        const hasJobDetails = !!(parsed.jobDetails && (parsed.jobDetails.companyName || parsed.jobDetails.jobTitle));
        filesWithMeta.push({ filename: f, hasJobDetails });
      } catch (e) {
        filesWithMeta.push({ filename: f, hasJobDetails: false });
      }
    }
    
    return { success: true, files: filesWithMeta };
  } catch (error: any) {
    console.error("Error listando CVs generados:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-generated-cv', async (event, filename) => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'CV');
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch (error: any) {
    console.error(`Error leyendo CV generado ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-generated-cv', async (event, filename) => {
  try {
    const settings = await readSettings();
    const dataDir = path.join(settings.dataFolderPath, 'CV');
    const filePath = path.join(dataDir, filename);
    await fs.unlink(filePath);
    return { success: true };
  } catch (error: any) {
    console.error(`Error borrando CV generado ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('generate-cv', async (event, { profileData, generationType, jobDetails, aiInstructions }) => {
  try {
    const result = await generateCVFromGemini(profileData, generationType, jobDetails, aiInstructions);
    // Forzamos la serialización manual para evitar que el algoritmo structuredClone
    // de Electron (IPC) falle silenciosamente con objetos complejos o proxies.
    const safeResult = JSON.parse(JSON.stringify(result));

    return { success: true, data: safeResult };
  } catch (error: any) {
    console.error("Error generating CV:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('generate-study-guide', async (event, { profileData, jobDetails, aiInstructions }) => {
  try {
    const result = await generateStudyGuideFromGemini(profileData, jobDetails, aiInstructions);
    const safeResult = JSON.parse(JSON.stringify(result));
    return { success: true, data: safeResult };
  } catch (error: any) {
    console.error("Error generating study guide:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-study-guide-pdf', async (event, { html, baseName }) => {
  try {
    const settings = await readSettings();
    const studyDir = path.join(settings.dataFolderPath, 'study');
    await fs.mkdir(studyDir, { recursive: true });
    
    let filePath: string;
    if (baseName.endsWith('.pdf')) {
      filePath = path.join(studyDir, baseName);
    } else {
      let cleanName = baseName.replace('.json', '');
      if (cleanName.endsWith('_CV_Optimizated')) {
        cleanName = cleanName.replace('_CV_Optimizated', '');
      }
      filePath = path.join(studyDir, `${cleanName}_study_guide.pdf`);
    }
    
    await generatePDF(html, filePath);
    return { success: true, filePath };
  } catch (error: any) {
    console.error("Error exportando a PDF el guion:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-pdf', async (event, html) => {
  try {
    if (!mainWindow) throw new Error("No main window");

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar Currículum (PDF)',
      defaultPath: path.join((await readSettings()).dataFolderPath, 'cv.pdf'),
      filters: [{ name: 'Archivos PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    await generatePDF(html, filePath);
    return { success: true, filePath };
  } catch (error: any) {
    console.error("Error exportando a PDF:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-study-guides', async () => {
  try {
    const settings = await readSettings();
    const studyDir = path.join(settings.dataFolderPath, 'study');
    await fs.mkdir(studyDir, { recursive: true });
    const files = await fs.readdir(studyDir);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
    return { success: true, files: pdfFiles };
  } catch (error: any) {
    console.error("Error listando guiones de estudio:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-study-guide', async (event, filename) => {
  try {
    const settings = await readSettings();
    const studyDir = path.join(settings.dataFolderPath, 'study');
    const filePath = path.join(studyDir, filename);
    await fs.unlink(filePath);
    return { success: true };
  } catch (error: any) {
    console.error(`Error borrando guion de estudio ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-study-guide', async (event, filename) => {
  try {
    const settings = await readSettings();
    const studyDir = path.join(settings.dataFolderPath, 'study');
    const filePath = path.join(studyDir, filename);
    const errorMessage = await shell.openPath(filePath);
    if (errorMessage) {
      return { success: false, error: errorMessage };
    }
    return { success: true };
  } catch (error: any) {
    console.error(`Error abriendo guion de estudio ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-file-exists', async (event, filename, type: 'cv' | 'guide') => {
  try {
    let dir = '';
    const settings = await readSettings();
    if (type === 'cv') {
      dir = path.join(settings.dataFolderPath, 'CV');
    } else if (type === 'guide') {
      dir = path.join(settings.dataFolderPath, 'study');
    } else {
      return { success: false, error: 'Invalid type' };
    }

    const filePath = path.join(dir, filename);
    try {
      await fs.access(filePath);
      return { success: true, exists: true };
    } catch {
      return { success: true, exists: false };
    }
  } catch (error: any) {
    console.error(`Error checking file existence ${filename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('rename-file', async (event, oldFilename, newFilename, type: 'cv' | 'guide') => {
  try {
    let dir = '';
    const settings = await readSettings();
    if (type === 'cv') {
      dir = path.join(settings.dataFolderPath, 'CV');
    } else if (type === 'guide') {
      dir = path.join(settings.dataFolderPath, 'study');
    } else {
      return { success: false, error: 'Invalid type' };
    }

    const oldPath = path.join(dir, oldFilename);
    const newPath = path.join(dir, newFilename);

    // Check if new file already exists
    try {
      await fs.access(newPath);
      return { success: false, error: 'El archivo ya existe con ese nombre.' };
    } catch {
      // Good, file does not exist
    }

    await fs.rename(oldPath, newPath);
    return { success: true };
  } catch (error: any) {
    console.error(`Error renaming file ${oldFilename} to ${newFilename}:`, error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validate-github-token', async (event, token) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Currynator'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, user: { login: data.login, name: data.name } };
    } else {
      return { success: false, error: 'Token inválido' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('google-oauth', async () => {
  return new Promise((resolve) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'http://127.0.0.1:4200/auth/callback';

    if (!clientId || !clientSecret) {
      resolve({ success: false, error: 'Missing Google OAuth credentials in .env' });
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline`;

    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: { nodeIntegration: false, contextIsolation: true }
    });

    authWindow.loadURL(authUrl);

    authWindow.webContents.on('will-redirect', async (event, newUrl) => {
      if (newUrl.startsWith(redirectUri)) {
        event.preventDefault();
        const urlObj = new URL(newUrl);
        const code = urlObj.searchParams.get('code');
        const error = urlObj.searchParams.get('error');

        if (error) {
          authWindow.close();
          resolve({ success: false, error });
          return;
        }

        if (code) {
          try {
            // Exchange code for token
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
              })
            });

            const tokenData = await tokenResponse.json();
            if (tokenData.error) {
              authWindow.close();
              resolve({ success: false, error: tokenData.error });
              return;
            }

            // Get user info
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` }
            });
            const userData = await userResponse.json();

            authWindow.close();
            resolve({ success: true, data: {
              firstName: userData.given_name || '',
              lastName: userData.family_name || '',
              email: userData.email || ''
            }});
          } catch (err: any) {
            authWindow.close();
            resolve({ success: false, error: err.message });
          }
        }
      }
    });

    let isResolved = false;
    const safeResolve = (val: any) => {
      if (!isResolved) {
        isResolved = true;
        resolve(val);
      }
    };

    authWindow.on('closed', () => {
      safeResolve({ success: false, error: 'Authentication window was closed' });
    });
    
    // Override the original resolve to track state
    const originalResolve = resolve;
    resolve = (val: any) => {
      if (!isResolved) {
        isResolved = true;
        originalResolve(val);
      }
    }
  });
});

app.on('will-quit', async () => {
  await closePDFEngine();
});
