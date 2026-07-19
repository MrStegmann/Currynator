import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {

  saveResumeData: (data: any, options?: any) => ipcRenderer.invoke('save-resume-data', data, options),
  listResumeData: () => ipcRenderer.invoke('list-resume-data'),
  readResumeData: (filename: string) => ipcRenderer.invoke('read-resume-data', filename),
  deleteResumeData: (filename: string) => ipcRenderer.invoke('delete-resume-data', filename),
  listGeneratedCVs: () => ipcRenderer.invoke('list-generated-cvs'),
  readGeneratedCV: (filename: string) => ipcRenderer.invoke('read-generated-cv', filename),
  deleteGeneratedCV: (filename: string) => ipcRenderer.invoke('delete-generated-cv', filename),
  readAIReasoning: (filename: string) => ipcRenderer.invoke('read-ai-reasoning', filename),
  generateCV: (args: { profileData: any, generationType: 'general' | 'specific', jobDetails: any, aiInstructions: string }) => ipcRenderer.invoke('generate-cv', args),
  exportPDF: (html: string) => ipcRenderer.invoke('export-pdf', html),
  generateStudyGuide: (args: { profileData: any, jobDetails: any, aiInstructions?: string }) => ipcRenderer.invoke('generate-study-guide', args),
  exportStudyGuidePDF: (args: { html: string, baseName: string }) => ipcRenderer.invoke('export-study-guide-pdf', args),
  listStudyGuides: () => ipcRenderer.invoke('list-study-guides'),
  deleteStudyGuide: (filename: string) => ipcRenderer.invoke('delete-study-guide', filename),
  openStudyGuide: (filename: string) => ipcRenderer.invoke('open-study-guide', filename),
  checkFileExists: (filename: string, type: 'cv' | 'guide') => ipcRenderer.invoke('check-file-exists', filename, type),
  renameFile: (oldName: string, newName: string, type: 'cv' | 'guide') => ipcRenderer.invoke('rename-file', oldName, newName, type),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  googleOAuthFlow: () => ipcRenderer.invoke('google-oauth-flow'),
  githubOAuthFlow: () => ipcRenderer.invoke('github-oauth-flow'),
  saveSecureToken: (tokenType: string, value: string) => ipcRenderer.invoke('save-secure-token', tokenType, value),

  analyzeGithub: () => ipcRenderer.invoke('analyze-github'),

  sendError: (errorInfo: Record<string, unknown>) => ipcRenderer.send('renderer-error', errorInfo),
});
