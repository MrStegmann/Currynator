import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useInitStore } from '../../../../src/features/initialization/store/initStore';
import { ipcClient } from '../../../../src/shared/ipc/ipcClient';

jest.mock('../../../../src/shared/ipc/ipcClient');

describe('initStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Zustand store state before each test if necessary
    // Zustand v5 usage allows setState
    useInitStore.setState({ status: 'loading', data: null, error: null });
  });

  it('should have initial status "loading"', () => {
    const state = useInitStore.getState();
    expect(state.status).toBe('loading');
  });

  describe('checkSavedData', () => {
    it('should set status to has-data when data exists', async () => {
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      (ipcClient.checkSavedData as jest.Mock).mockResolvedValue({
        success: true,
        data: mockData
      });

      await useInitStore.getState().checkSavedData();

      const state = useInitStore.getState();
      expect(state.status).toBe('has-data');
      expect(state.data).toEqual(mockData);
    });

    it('should set status to no-data when data does not exist', async () => {
      (ipcClient.checkSavedData as jest.Mock).mockResolvedValue({
        success: true,
        data: null
      });

      await useInitStore.getState().checkSavedData();

      const state = useInitStore.getState();
      expect(state.status).toBe('no-data');
      expect(state.data).toBeNull();
    });

    it('should set status to corrupted when ipc returns success=false and corrupted error', async () => {
      (ipcClient.checkSavedData as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Data is corrupted'
      });

      await useInitStore.getState().checkSavedData();

      const state = useInitStore.getState();
      expect(state.status).toBe('corrupted');
      expect(state.error).toBe('Data is corrupted');
    });

    it('should set status to error on general failure', async () => {
      (ipcClient.checkSavedData as jest.Mock).mockResolvedValue({
        success: false,
        error: 'IPC timeout'
      });

      await useInitStore.getState().checkSavedData();

      const state = useInitStore.getState();
      expect(state.status).toBe('error');
      expect(state.error).toBe('IPC timeout');
    });
  });

  describe('saveData', () => {
    it('should set status to has-data on successful save', async () => {
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      (ipcClient.saveResumeData as jest.Mock).mockResolvedValue({ success: true });

      const success = await useInitStore.getState().saveData(mockData);

      const state = useInitStore.getState();
      expect(success).toBe(true);
      expect(state.status).toBe('has-data');
      expect(state.data).toEqual(mockData);
    });

    it('should keep status and return false on save failure', async () => {
      const mockData = { basics: { name: 'Test', label: 'Tester', email: 'test@example.com' } };
      (ipcClient.saveResumeData as jest.Mock).mockResolvedValue({ success: false, error: 'Write error' });

      // Simulate being in no-data state before saving
      useInitStore.setState({ status: 'no-data' });

      const success = await useInitStore.getState().saveData(mockData);

      const state = useInitStore.getState();
      expect(success).toBe(false);
      expect(state.status).toBe('no-data'); // shouldn't advance to has-data
    });
  });
});
