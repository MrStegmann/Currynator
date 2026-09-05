import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingForm } from '../../../../src/features/initialization/components/OnboardingForm';
import { useInitStore } from '../../../../src/features/initialization/store/initStore';

jest.mock('../../../../src/features/initialization/store/initStore', () => ({
  useInitStore: jest.fn()
}));

describe('OnboardingForm', () => {
  const mockSaveData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInitStore as unknown as jest.Mock).mockReturnValue(mockSaveData);
  });

  it('renders step 1 (Personal) initially', () => {
    render(<OnboardingForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/label/i)).toBeInTheDocument();
  });

  it('validates mandatory fields on step 1 before proceeding', async () => {
    render(<OnboardingForm />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    
    // Click without filling
    fireEvent.click(nextBtn);
    
    // Should show validation errors (browser validation or custom)
    // Wait for validation feedback
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInvalid();
    });
  });

  it('proceeds through all 3 steps and submits data', async () => {
    mockSaveData.mockResolvedValue(true);
    render(<OnboardingForm />);
    
    // Step 1: Personal
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/label/i), { target: { value: 'Tester' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Contact
    await waitFor(() => {
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 3: Details
    await waitFor(() => {
      expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/summary/i), { target: { value: 'A summary' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSaveData).toHaveBeenCalledWith(expect.objectContaining({
        basics: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          label: 'Tester',
          phone: '123',
          summary: 'A summary'
        })
      }));
    });
  });
});
