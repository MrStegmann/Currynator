import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingForm } from '../../../../../src/renderer/features/initialization/components/OnboardingForm';
import { useInitStore } from '../../../../../src/renderer/features/initialization/store/initStore';

jest.mock('../../../../../src/renderer/features/initialization/store/initStore', () => ({
  useInitStore: () => ({ saveData: jest.fn() })
}));

describe('OnboardingForm', () => {
  it('renders multi-step form steps', () => {
    render(<OnboardingForm />);
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
  });

  it('validates mandatory fields on step 1', async () => {
    render(<OnboardingForm />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Label is required/i)).toBeInTheDocument();
    });
  });
});
