import React from 'react';
import { render, screen } from '@testing-library/react';
import { Greeting } from '../Greeting';

// Mock the electron IPC since we don't have it in JSDOM
beforeAll(() => {
  (global as any).window.electron = {
    ping: jest.fn().mockResolvedValue('pong from main')
  };
});

describe('Greeting Component', () => {
  it('renders the hello world text', () => {
    render(<Greeting />);
    expect(screen.getByText("Hello, World, I'm Currynator")).toBeInTheDocument();
  });
});
