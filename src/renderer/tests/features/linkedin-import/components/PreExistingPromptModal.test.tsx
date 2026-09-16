import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PreExistingPromptModal } from '../../../../src/features/linkedin-import/components/PreExistingPromptModal';

describe('PreExistingPromptModal', () => {
  const mockExistingData = { basics: { name: 'Existing User' } };
  const mockImportedData = { basics: { name: 'Imported User' } };

  const defaultProps = {
    isOpen: true,
    existingData: mockExistingData,
    importedData: mockImportedData,
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<PreExistingPromptModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal title and options when isOpen is true', () => {
    render(<PreExistingPromptModal {...defaultProps} />);
    expect(screen.getByText(/Import Conflict Resolution/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Import/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel Import/i })).toBeInTheDocument();
  });

  it('calls onConfirm when Confirm Import button is clicked', () => {
    render(<PreExistingPromptModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Confirm Import/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
});
