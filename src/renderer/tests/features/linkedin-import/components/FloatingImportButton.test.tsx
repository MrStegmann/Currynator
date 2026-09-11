import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FloatingImportButton } from '../../../../src/features/linkedin-import/components/FloatingImportButton';

describe('FloatingImportButton', () => {
  it('renders the floating button with correct text', () => {
    render(<FloatingImportButton onClick={jest.fn()} />);
    
    const button = screen.getByRole('button', { name: /import linkedin csv/i });
    expect(button).toBeInTheDocument();
  });

  it('triggers onClick callback when clicked', () => {
    const handleClick = jest.fn();
    render(<FloatingImportButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /import linkedin csv/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
