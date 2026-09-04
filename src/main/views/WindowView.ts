import { BrowserWindow } from 'electron';
import * as path from 'path';

export class WindowView {
  private window: BrowserWindow | null = null;

  public createMainWindow(): void {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(import.meta.dirname, '..', 'preload.cjs'),
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.window.loadFile(path.join(import.meta.dirname, '..', '..', 'renderer', 'index.html'));
    }
  }

  public getWindow(): BrowserWindow | null {
    return this.window;
  }
}
