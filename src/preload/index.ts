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
  analyzeGithubProjects: () => ipcRenderer.invoke('analyze-github-projects'),
  evaluateGithubProject: (projectId: string) => ipcRenderer.invoke('evaluate-github-project', projectId),

  refetchProfileReadme: () => ipcRenderer.invoke('refetch-profile-readme'),
  refetchGithubProjects: () => ipcRenderer.invoke('refetch-github-projects'),
  refetchSingleProject: (projectId: string) => ipcRenderer.invoke('refetch-single-project', projectId),

  onGithubAnalysisProgress: (callback: (data: { stageText: string; progressPercent: number }) => void) => {
    const subscription = (_event: any, value: { stageText: string; progressPercent: number }) => callback(value);
    ipcRenderer.on('github-analysis-progress', subscription);
    return () => {
      ipcRenderer.removeListener('github-analysis-progress', subscription);
    };
  }
});
