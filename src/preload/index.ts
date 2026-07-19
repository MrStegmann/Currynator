import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),

  selectFolder: () => ipcRenderer.invoke('select-folder'),

  googleOAuthFlow: () => ipcRenderer.invoke('google-oauth-flow'),
  githubOAuthFlow: () => ipcRenderer.invoke('github-oauth-flow'),
  saveSecureToken: (tokenType: string, value: string) => ipcRenderer.invoke('save-secure-token', tokenType, value),

  analyzeGithub: () => ipcRenderer.invoke('analyze-github'),

});
