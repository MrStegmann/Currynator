import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/shared/components/Header/Header';

describe('Header Component', () => {
  it('renders currentViewName correctly', () => {
    render(<Header currentViewName="Projects" onToggleSidebar={jest.fn()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });

  it('does not render burger menu button by default or when showBurger is false', () => {
    render(<Header currentViewName="Home" onToggleSidebar={jest.fn()} showBurger={false} />);
    expect(screen.queryByRole('button', { name: /toggle sidebar/i })).not.toBeInTheDocument();
  });

  it('renders burger menu button and handles click when showBurger is true', () => {
    const handleToggle = jest.fn();
    render(<Header currentViewName="Home" onToggleSidebar={handleToggle} showBurger={true} />);
    
    const burgerButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(burgerButton).toBeInTheDocument();
    
    fireEvent.click(burgerButton);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('renders rightSlot content when provided', () => {
    render(
      <Header
        currentViewName="Home"
        onToggleSidebar={jest.fn()}
        rightSlot={<button>Dynamic Action</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Dynamic Action' })).toBeInTheDocument();
  });
});
