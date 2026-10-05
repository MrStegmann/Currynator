import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { WindowView } from '../../views/WindowView.js';
import { BrowserWindow } from 'electron';

const mockLoadURL = jest.fn();
const mockLoadFile = jest.fn();
const mockMaximize = jest.fn();

jest.mock('electron', () => {
  return {
    app: {
      getAppPath: jest.fn().mockReturnValue('/mock/app/path'),
    },
    BrowserWindow: jest.fn().mockImplementation(() => ({
      loadURL: mockLoadURL,
      loadFile: mockLoadFile,
      maximize: mockMaximize,
    })),
  };
});

describe('WindowView', () => {
  let windowView: WindowView;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    windowView = new WindowView();
  });

  it('should create a window and maximize it on startup', () => {
    delete process.env.VITE_DEV_SERVER_URL;

    windowView.createMainWindow();

    expect(BrowserWindow).toHaveBeenCalledTimes(1);
    expect(mockMaximize).toHaveBeenCalledTimes(1);
    expect(mockLoadFile).toHaveBeenCalledTimes(1);
    expect(windowView.getWindow()).not.toBeNull();
  });

  it('should load dev server URL when VITE_DEV_SERVER_URL is present and maximize window', () => {
    process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173';

    windowView.createMainWindow();

    expect(mockMaximize).toHaveBeenCalledTimes(1);
    expect(mockLoadURL).toHaveBeenCalledWith('http://localhost:5173');
  });
});
