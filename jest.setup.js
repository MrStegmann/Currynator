require('@testing-library/jest-dom');

global.window.electron = {
  ipcRenderer: {
    invoke: jest.fn().mockImplementation(() => Promise.resolve(null)),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
};

