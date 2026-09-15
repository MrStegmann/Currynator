import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping'),
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
      ipcRenderer.on(channel, listener);
    },
    removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, listener);
    }
  },
  groq: {
    analyzeCvJobDriven: (payload: { resume: any; jobApplication: any }) =>
      ipcRenderer.invoke('groq:cv-job-driven', payload),
  },
  jobApplication: {
    getAll: () => ipcRenderer.invoke('job-application:get-all'),
    save: (data: any) => ipcRenderer.invoke('job-application:save', data),
    delete: (id: string) => ipcRenderer.invoke('job-application:delete', id),
    updateStatus: (id: string, status: string) => ipcRenderer.invoke('job-application:update-status', { id, status }),
  }
});
