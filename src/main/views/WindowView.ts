import { app, BrowserWindow } from 'electron';
import path from 'path';

export class WindowView {
  private window: BrowserWindow | null = null;

  public createMainWindow(): void {
    const appPath = typeof app?.getAppPath === 'function' ? app.getAppPath() : process.cwd();
    const preloadPath = path.join(appPath, 'dist', 'main', 'preload.cjs');

    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: preloadPath,
      },
    });

    this.window.maximize();

    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.window.loadFile(path.join(appPath, 'dist', 'renderer', 'index.html'));
    }
  }

  public getWindow(): BrowserWindow | null {
    return this.window;
  }
}
