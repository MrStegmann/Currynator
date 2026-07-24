import { ipcMain } from 'electron';
import {
  analyzeGithubProfile,
  fetchNextProjectsBatch,
  evaluateSingleProjectById,
  refetchProfileReadmeOnly,
  refetchAllProjectsUnscored,
  refetchSingleProjectData
} from '../services/github.service.js';

export function registerGithubIpcHandlers() {
  ipcMain.handle('analyze-github', async (event) => {
    try {
      const data = await analyzeGithubProfile((stageText, progressPercent) => {
        event.sender.send('github-analysis-progress', { stageText, progressPercent });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('analyze-github IPC Error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('analyze-github-projects', async (event) => {
    try {
      const data = await fetchNextProjectsBatch(6, (stageText, progressPercent) => {
        event.sender.send('github-analysis-progress', { stageText, progressPercent });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('analyze-github-projects IPC Error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('evaluate-github-project', async (event, projectId: string) => {
    try {
      const data = await evaluateSingleProjectById(projectId, (statusMsg) => {
        event.sender.send('github-analysis-progress', { stageText: statusMsg, progressPercent: 50 });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('evaluate-github-project IPC Error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('refetch-profile-readme', async (event) => {
    try {
      const data = await refetchProfileReadmeOnly((statusMsg) => {
        event.sender.send('github-analysis-progress', { stageText: statusMsg, progressPercent: 50 });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('refetch-profile-readme IPC Error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('refetch-github-projects', async (event) => {
    try {
      const data = await refetchAllProjectsUnscored((stageText, progressPercent) => {
        event.sender.send('github-analysis-progress', { stageText, progressPercent });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('refetch-github-projects IPC Error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('refetch-single-project', async (event, projectId: string) => {
    try {
      const data = await refetchSingleProjectData(projectId, (statusMsg) => {
        event.sender.send('github-analysis-progress', { stageText: statusMsg, progressPercent: 50 });
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('refetch-single-project IPC Error:', error);
      return { success: false, error: error.message };
    }
  });
}
