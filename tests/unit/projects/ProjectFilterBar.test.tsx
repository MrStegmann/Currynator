import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectFilterBar } from '../../../src/renderer/src/features/projects/components/ProjectFilterBar';

describe('ProjectFilterBar Component', () => {
  const defaultProps = {
    searchQuery: '',
    minStars: 0,
    selectedLanguage: 'all',
    availableLanguages: ['TypeScript', 'Python', 'Go'],
    onSearchChange: jest.fn(),
    onStarsChange: jest.fn(),
    onLanguageChange: jest.fn(),
    onResetFilters: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input, star filter select, dynamic language options, and handles input changes', () => {
    render(<ProjectFilterBar {...defaultProps} />);

    // Search input check
    const searchInput = screen.getByPlaceholderText(/search by project name/i);
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'my-project' } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('my-project');

    // Star filter check
    const starsSelect = screen.getByLabelText(/filter by stars/i);
    expect(starsSelect).toBeInTheDocument();
    fireEvent.change(starsSelect, { target: { value: '10' } });
    expect(defaultProps.onStarsChange).toHaveBeenCalledWith(10);

    // Language filter check with dynamically populated options
    const languageSelect = screen.getByLabelText(/filter by language/i);
    expect(languageSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Languages' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'TypeScript' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Python' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Go' })).toBeInTheDocument();

    fireEvent.change(languageSelect, { target: { value: 'TypeScript' } });
    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith('TypeScript');
  });

  it('renders reset filters button when active filters exist and triggers callback', () => {
    render(
      <ProjectFilterBar
        {...defaultProps}
        searchQuery="test"
        selectedLanguage="Python"
      />
    );

    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(defaultProps.onResetFilters).toHaveBeenCalled();
  });
});
