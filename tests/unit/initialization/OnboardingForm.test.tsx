import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingForm } from '../../../src/renderer/src/features/initialization/components/OnboardingForm';
import { useInitStore } from '../../../src/renderer/src/features/initialization/store/initStore';
import { ipcClient } from '../../../src/renderer/src/shared/ipc/ipcClient';

jest.mock('../../../src/renderer/src/features/initialization/store/initStore');
jest.mock('../../../src/renderer/src/shared/ipc/ipcClient');

describe('OnboardingForm Component', () => {
  const mockSaveData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInitStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ saveData: mockSaveData })
    );
  });

  it('renders onboarding mode selection tabs (Manual Setup vs Import LinkedIn ZIP)', () => {
    render(<OnboardingForm />);

    expect(screen.getByText(/Manual Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Import LinkedIn ZIP/i)).toBeInTheDocument();
  });

  it('switches to LinkedIn ZIP import mode when tab is clicked', () => {
    render(<OnboardingForm />);

    const importTab = screen.getByText(/Import LinkedIn ZIP/i);
    fireEvent.click(importTab);

    expect(screen.getByText(/Upload LinkedIn Export ZIP/i)).toBeInTheDocument();
  });

  it('handles LinkedIn ZIP import during onboarding and calls saveData', async () => {
    const mockParsedData = {
      basics: { name: 'Onboarded User', email: 'user@example.com' },
      work: []
    };

    (ipcClient.getPathForFile as jest.Mock).mockReturnValue('/mock/path/linkedin.zip');
    (ipcClient.parseLinkedinZip as jest.Mock).mockResolvedValue({
      success: true,
      data: mockParsedData,
      hasExistingData: false
    });

    render(<OnboardingForm />);

    const importTab = screen.getByText(/Import LinkedIn ZIP/i);
    fireEvent.click(importTab);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const file = new File(['dummy content'], 'linkedin.zip', { type: 'application/zip' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(ipcClient.parseLinkedinZip).toHaveBeenCalledWith('/mock/path/linkedin.zip');
      expect(mockSaveData).toHaveBeenCalledWith(mockParsedData);
    });
  });
});
