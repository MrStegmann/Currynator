import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GreetingsView } from '../../../../src/features/initialization/components/GreetingsView';
import { useInitStore } from '../../../../src/features/initialization/store/initStore';

// Mock the Zustand store
jest.mock('../../../../src/features/initialization/store/initStore', () => ({
  useInitStore: jest.fn()
}));

describe('GreetingsView', () => {
  const mockCheckSavedData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInitStore as unknown as jest.Mock).mockReturnValue(mockCheckSavedData);
  });

  it('renders a loading message', () => {
    render(<GreetingsView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('calls checkSavedData on mount', () => {
    render(<GreetingsView />);
    expect(mockCheckSavedData).toHaveBeenCalledTimes(1);
  });
});
