import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorScreen } from '../../../../src/features/initialization/components/ErrorScreen';
import { CorruptedDataModal } from '../../../../src/features/initialization/components/CorruptedDataModal';

describe('ErrorScreen', () => {
  it('renders the error message and retry button', () => {
    const mockRetry = jest.fn();
    render(<ErrorScreen message="Connection failed" onRetry={mockRetry} />);
    
    expect(screen.getByText('Connection failed')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /retry/i });
    expect(btn).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

describe('CorruptedDataModal', () => {
  it('renders the modal and handles reset', () => {
    const mockReset = jest.fn();
    render(<CorruptedDataModal onReset={mockReset} />);
    
    expect(screen.getByText(/data is corrupted/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /reset/i });
    expect(btn).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
