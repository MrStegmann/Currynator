import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RightNavBar } from '../../../src/shared/components/RightNavBar/RightNavBar';

describe('RightNavBar Component', () => {
  it('renders navigation links strictly in order: Home -> Projects -> CV Dashboard', () => {
    render(<RightNavBar isOpen={true} activeView="Home" onSelectView={jest.fn()} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[1]).toHaveTextContent('Projects');
    expect(links[2]).toHaveTextContent('CV Dashboard');
  });

  it('highlights the active link correctly', () => {
    const { rerender } = render(<RightNavBar isOpen={true} activeView="Projects" onSelectView={jest.fn()} />);

    const projectsLink = screen.getByText('Projects').closest('a');
    expect(projectsLink).toHaveClass('bg-primary-container');

    rerender(<RightNavBar isOpen={true} activeView="CV Dashboard" onSelectView={jest.fn()} />);
    const cvLink = screen.getByText('CV Dashboard').closest('a');
    expect(cvLink).toHaveClass('bg-primary-container');
  });

  it('calls onSelectView when clicking a navigation link', () => {
    const handleSelectView = jest.fn();
    render(<RightNavBar isOpen={true} activeView="Home" onSelectView={handleSelectView} />);

    const projectsLink = screen.getByText('Projects');
    fireEvent.click(projectsLink);

    expect(handleSelectView).toHaveBeenCalledWith('Projects');

    const cvLink = screen.getByText('CV Dashboard');
    fireEvent.click(cvLink);

    expect(handleSelectView).toHaveBeenCalledWith('CV Dashboard');
  });
});
