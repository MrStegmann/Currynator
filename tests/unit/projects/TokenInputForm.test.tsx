import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TokenInputForm } from '../../../src/renderer/src/features/projects/components/TokenInputForm';
import { useProjectsStore } from '../../../src/renderer/src/features/projects/store/useProjectsStore';

jest.mock('../../../src/renderer/src/features/projects/store/useProjectsStore');

describe('TokenInputForm Component', () => {
  const mockSaveToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useProjectsStore as unknown as jest.Mock).mockReturnValue({
      saveToken: mockSaveToken,
      isLoading: false,
      error: null
    });
  });

  it('renders token input field with password masking by default', () => {
    render(<TokenInputForm />);

    const input = screen.getByPlaceholderText(/ghp_/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
  });

  it('toggles password field visibility between password and text when eye button is clicked', () => {
    render(<TokenInputForm />);

    const input = screen.getByPlaceholderText(/ghp_/i) as HTMLInputElement;
    const toggleBtn = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(input.type).toBe('password');

    fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');

    fireEvent.click(toggleBtn);
    expect(input.type).toBe('password');
  });

  it('submits token form and calls saveToken when Save Token is clicked', async () => {
    mockSaveToken.mockResolvedValue(true);
    render(<TokenInputForm />);

    const input = screen.getByPlaceholderText(/ghp_/i);
    const saveBtn = screen.getByRole('button', { name: /save token/i });

    fireEvent.change(input, { target: { value: 'ghp_mock123456789' } });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockSaveToken).toHaveBeenCalledWith('ghp_mock123456789');
    });
  });
});
