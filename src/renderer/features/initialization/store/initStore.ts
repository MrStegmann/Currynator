import { create } from 'zustand';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { Resume } from '../../../shared/schema/resumeSchema';

export type InitStatus = 'loading' | 'onboarding' | 'error' | 'fatal_error' | 'corrupted_data' | 'home';

interface InitState {
  status: InitStatus;
  retryCount: number;
  errorType: 'timeout' | 'ipc_error' | null;
  corruptedDataRaw: any | null;
  checkData: () => Promise<void>;
  saveData: (data: Partial<Resume>) => Promise<boolean>;
  retry: () => Promise<void>;
}

export const useInitStore = create<InitState>((set, get) => ({
  status: 'loading',
  retryCount: 0,
  errorType: null,
  corruptedDataRaw: null,

  checkData: async () => {
    set({ status: 'loading', errorType: null });
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 5000)
      );
      
      const ipcPromise = ipcClient.checkSavedData();
      
      // Race the IPC call against a 5-second timeout
      const result: any = await Promise.race([ipcPromise, timeoutPromise]);
      
      if (!result) {
        set({ status: 'onboarding' });
        return;
      }
      
      if (result.error === 'CORRUPTED_DATA') {
        set({ 
          status: 'corrupted_data', 
          corruptedDataRaw: result.originalData 
        });
        return;
      }
      
      // If we got here, we have valid data
      set({ status: 'home' });
      
    } catch (error: any) {
      const isTimeout = error.message === 'TIMEOUT';
      const currentRetryCount = get().retryCount;
      
      if (currentRetryCount >= 3) {
        set({ status: 'fatal_error' });
      } else {
        set({ 
          status: 'error', 
          errorType: isTimeout ? 'timeout' : 'ipc_error',
          retryCount: currentRetryCount + 1
        });
      }
    }
  },

  saveData: async (data: Partial<Resume>) => {
    const success = await ipcClient.saveResumeData(data);
    if (success) {
      set({ status: 'home', corruptedDataRaw: null, retryCount: 0 });
      return true;
    }
    return false;
  },

  retry: async () => {
    await get().checkData();
  }
}));
