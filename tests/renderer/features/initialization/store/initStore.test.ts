import { useInitStore } from '../../../../../src/renderer/features/initialization/store/initStore';
import { ipcClient } from '../../../../../src/renderer/shared/ipc/ipcClient';
import { act } from '@testing-library/react';

jest.mock('../../../../../src/renderer/shared/ipc/ipcClient', () => ({
  ipcClient: {
    checkSavedData: jest.fn(),
    saveResumeData: jest.fn()
  }
}));

describe('initStore', () => {
  beforeEach(() => {
    useInitStore.setState({ status: 'loading', retryCount: 0 });
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start with loading status', () => {
    expect(useInitStore.getState().status).toBe('loading');
  });

  it('should transition to onboarding if no data found', async () => {
    (ipcClient.checkSavedData as jest.Mock).mockResolvedValueOnce(null);
    
    await act(async () => {
      await useInitStore.getState().checkData();
    });
    
    expect(useInitStore.getState().status).toBe('onboarding');
  });

  it('should transition to home if data found', async () => {
    (ipcClient.checkSavedData as jest.Mock).mockResolvedValueOnce({ basics: { name: 'Test' } });
    
    await act(async () => {
      await useInitStore.getState().checkData();
    });
    
    expect(useInitStore.getState().status).toBe('home');
  });

  it('should handle timeout error after 5s', async () => {
    (ipcClient.checkSavedData as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 6000))
    );
    
    const checkPromise = act(async () => {
      await useInitStore.getState().checkData();
    });
    
    jest.advanceTimersByTime(5000);
    await checkPromise;
    
    expect(useInitStore.getState().status).toBe('error');
    expect(useInitStore.getState().errorType).toBe('timeout');
  });

  it('should transition to fatal error after 3 retries', async () => {
    (ipcClient.checkSavedData as jest.Mock).mockRejectedValue(new Error('fail'));
    
    useInitStore.setState({ retryCount: 3 });
    await act(async () => {
      await useInitStore.getState().checkData();
    });
    
    expect(useInitStore.getState().status).toBe('fatal_error');
  });
});
