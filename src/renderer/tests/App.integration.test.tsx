import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';
import { ipcClient } from '../src/shared/ipc/ipcClient';
import { useInitStore } from '../src/features/initialization/store/initStore';

jest.mock('../src/shared/ipc/ipcClient');

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useInitStore.setState({ status: 'loading', data: null, error: null });
  });

  it('bypasses onboarding and shows JsonDisplayView when existing data is found', async () => {
    const mockData = { basics: { name: 'Test', email: 'test@example.com', label: 'Tester' } };
    
    // Setup IPC mock to return existing data
    (ipcClient.checkSavedData as jest.Mock).mockResolvedValue({
      success: true,
      data: mockData
    });
    (window.electron.ipcRenderer.invoke as jest.Mock).mockImplementation((channel: string) => {
      if (channel === 'resume:load') {
        return Promise.resolve(mockData);
      }
      return Promise.resolve(null);
    });

    render(<App />);

    // Initially loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // After IPC resolves, it should show Home view
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument();
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
