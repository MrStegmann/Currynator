import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping'),
  checkSavedData: () => ipcRenderer.invoke('check-saved-data'),
  saveResumeData: (data: any) => ipcRenderer.invoke('save-resume-data', data)
});
