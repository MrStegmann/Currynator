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

    render(<App />);

    // Initially loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // After IPC resolves, it should show JsonDisplayView
    await waitFor(() => {
      expect(screen.getByText(/Raw JSON Data/i)).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(JSON.stringify(mockData, null, 2));
  });
});
