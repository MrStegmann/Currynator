import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImportView } from '../../../../src/features/linkedin-import/components/ImportView';

describe('ImportView', () => {
  it('renders the back button and calls onBack when clicked', () => {
    const handleBack = jest.fn();
    render(<ImportView onBack={handleBack} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders the 2-column layout containing instructions and dropzone', () => {
    render(<ImportView onBack={jest.fn()} />);

    // Left column instruction heading/text
    expect(screen.getByText(/how to get your linkedin data/i)).toBeInTheDocument();

    // Right column dropzone area
    expect(screen.getByText(/drag and drop your linkedin export zip/i)).toBeInTheDocument();
  });
});
