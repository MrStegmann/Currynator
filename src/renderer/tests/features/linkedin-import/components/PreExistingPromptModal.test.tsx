import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PreExistingPromptModal } from '../../../../src/features/linkedin-import/components/PreExistingPromptModal';

describe('PreExistingPromptModal', () => {
  const defaultProps = {
    isOpen: true,
    onReplace: jest.fn(),
    onKeep: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<PreExistingPromptModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/Existing Resume Data Found/i)).not.toBeInTheDocument();
  });

  it('renders modal title and options when isOpen is true', () => {
    render(<PreExistingPromptModal {...defaultProps} />);
    expect(screen.getByText(/Existing Resume Data Found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Replace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Keep.*Merge/i })).toBeInTheDocument();
  });

  it('calls onReplace when Replace button is clicked', () => {
    render(<PreExistingPromptModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Replace/i }));
    expect(defaultProps.onReplace).toHaveBeenCalledTimes(1);
  });

  it('calls onKeep when Keep/Merge button is clicked', () => {
    render(<PreExistingPromptModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Keep.*Merge/i }));
    expect(defaultProps.onKeep).toHaveBeenCalledTimes(1);
  });
});
