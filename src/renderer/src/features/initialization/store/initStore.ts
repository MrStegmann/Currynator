import { create } from 'zustand';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { Resume } from '../../../../../main/shared/schema/resumeSchema';

export type InitStatus = 'loading' | 'no-data' | 'has-data' | 'error' | 'corrupted';

interface InitState {
  status: InitStatus;
  data: Resume | null;
  error: string | null;
  checkSavedData: () => Promise<void>;
  saveData: (data: Resume) => Promise<boolean>;
  resetToOnboarding: () => void;
}

export const useInitStore = create<InitState>((set) => ({
  status: 'loading',
  data: null,
  error: null,

  checkSavedData: async () => {
    set({ status: 'loading', error: null });
    try {
      const response = await ipcClient.checkSavedData();
      if (response.success) {
        if (response.data) {
          set({ status: 'has-data', data: response.data });
        } else {
          set({ status: 'no-data', data: null });
        }
      } else {
        if (response.error?.includes('corrupted')) {
          set({ status: 'corrupted', error: response.error });
        } else {
          set({ status: 'error', error: response.error || 'Failed to check data' });
        }
      }
    } catch (err) {
      set({ status: 'error', error: err instanceof Error ? err.message : 'IPC error' });
    }
  },

  saveData: async (data: Resume) => {
    try {
      const response = await ipcClient.saveResumeData(data);
      if (response.success) {
        set({ status: 'has-data', data });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  resetToOnboarding: () => {
    set({ status: 'no-data', error: null, data: null });
  }
}));
