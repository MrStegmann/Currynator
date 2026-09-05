import React from 'react';
import { render, screen } from '@testing-library/react';
import { GreetingsView } from '../../../../../src/renderer/features/initialization/components/GreetingsView';

describe('GreetingsView', () => {
  it('renders the greetings message and loading indicator', () => {
    render(<GreetingsView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
