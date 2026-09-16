import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/renderer/src/shared/components/Header/Header';

describe('Header Component', () => {
  it('renders current view title and menu toggle button', () => {
    const handleToggle = jest.fn();
    render(<Header currentViewName="Home View" onToggleSidebar={handleToggle} />);

    expect(screen.getByText('Home View')).toBeInTheDocument();
    
    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('includes sticky top positioning Tailwind classes', () => {
    const { container } = render(<Header currentViewName="Home View" onToggleSidebar={jest.fn()} />);
    const headerElement = container.querySelector('header');
    
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('sticky');
    expect(headerElement).toHaveClass('top-0');
    expect(headerElement).toHaveClass('z-50');
  });
});
