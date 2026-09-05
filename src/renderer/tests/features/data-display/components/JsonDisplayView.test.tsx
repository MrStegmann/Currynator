import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JsonDisplayView } from '../../../../src/features/data-display/components/JsonDisplayView';
import { useInitStore } from '../../../../src/features/initialization/store/initStore';

jest.mock('../../../../src/features/initialization/store/initStore', () => ({
  useInitStore: {
    getState: jest.fn()
  }
}));

describe('JsonDisplayView', () => {
  it('renders a read-only textarea with the formatted json data', () => {
    const mockData = { basics: { name: 'Test' } };
    (useInitStore.getState as jest.Mock).mockReturnValue({ data: mockData });

    render(<JsonDisplayView />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveValue(JSON.stringify(mockData, null, 2));
  });

  it('renders a fallback message if no data is found', () => {
    (useInitStore.getState as jest.Mock).mockReturnValue({ data: null });

    render(<JsonDisplayView />);
    
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
});
