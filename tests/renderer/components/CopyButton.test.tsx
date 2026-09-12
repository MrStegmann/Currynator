import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CopyButton } from '../../../src/renderer/src/shared/components/CopyButton/CopyButton';

describe('CopyButton Component', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn<any>().mockResolvedValue(undefined)
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true
    });
  });

  it('renders copy button with title', () => {
    render(<CopyButton data={{ test: 'value' }} title="Copy Basics JSON" />);
    const btn = screen.getByRole('button', { name: /copy basics json/i });
    expect(btn).toBeInTheDocument();
  });

  it('copies formatted JSON data to clipboard when clicked', async () => {
    const mockData = { name: 'John Doe', email: 'john@example.com' };
    render(<CopyButton data={mockData} title="Copy Basics JSON" />);
    
    const btn = screen.getByRole('button', { name: /copy basics json/i });
    fireEvent.click(btn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(mockData, null, 2)
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied to clipboard/i })).toBeInTheDocument();
    });
  });
});
