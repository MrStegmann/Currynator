import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),

  getProfile: () => ipcRenderer.invoke('get-profile'),
  saveProfile: (profile: any) => ipcRenderer.invoke('save-profile', profile),

  selectFolder: () => ipcRenderer.invoke('select-folder'),

  googleOAuthFlow: () => ipcRenderer.invoke('google-oauth-flow'),
  githubOAuthFlow: () => ipcRenderer.invoke('github-oauth-flow'),
  linkedinOAuthFlow: () => ipcRenderer.invoke('linkedin-oauth-flow'),
  saveSecureToken: (tokenType: string, value: string) => ipcRenderer.invoke('save-secure-token', tokenType, value),

  analyzeGithub: () => ipcRenderer.invoke('analyze-github'),

});
