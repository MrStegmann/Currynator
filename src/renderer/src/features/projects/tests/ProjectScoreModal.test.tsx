import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectScoreModal } from '../components/ProjectScoreModal';
import { AIScoreResult } from '../types/projects';

const mockScoreResult: AIScoreResult = {
  repoId: 202,
  repoName: 'awesome-curry-app',
  totalScore: 85,
  evaluatedAt: '2026-09-19T11:00:00Z',
  logs: [
    {
      category: 'readme_structure',
      title: 'README Structure',
      score: 90,
      log: 'Well formatted README with usage examples.',
      improvements: ['Add a troubleshooting section to README.']
    },
    {
      category: 'test_coverage',
      title: 'Test Coverage',
      score: 80,
      log: 'Unit tests cover primary services.',
      improvements: ['Add integration tests for API handlers.', 'Increase assertion coverage.']
    }
  ]
};

describe('ProjectScoreModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ProjectScoreModal
        isOpen={false}
        onClose={jest.fn()}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    expect(screen.queryByText('awesome-curry-app')).not.toBeInTheDocument();
  });

  it('renders modal content with section breakdowns and improvement recommendations when isOpen is true', () => {
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={jest.fn()}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    expect(screen.getByText('awesome-curry-app')).toBeInTheDocument();
    expect(screen.getByText('85/100')).toBeInTheDocument();

    // Check section breakdown logs
    expect(screen.getByText('README Structure')).toBeInTheDocument();
    expect(screen.getByText('Well formatted README with usage examples.')).toBeInTheDocument();
    expect(screen.getByText('Test Coverage')).toBeInTheDocument();
    expect(screen.getByText('Unit tests cover primary services.')).toBeInTheDocument();

    // Check improvement recommendations
    expect(screen.getAllByText('Add a troubleshooting section to README.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Add integration tests for API handlers.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Increase assertion coverage.')[0]).toBeInTheDocument();
  });

  it('fires onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={handleClose}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close score details/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose when backdrop overlay is clicked', () => {
    const handleClose = jest.fn();
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={handleClose}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    const backdrop = screen.getByTestId('score-modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders unscored placeholder when scoreResult is undefined', () => {
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={jest.fn()}
        repositoryName="unscored-repo"
      />
    );

    expect(screen.getByText('unscored-repo')).toBeInTheDocument();
    expect(screen.getByText('Not Scored')).toBeInTheDocument();
    expect(screen.getByText(/this repository has not been evaluated yet/i)).toBeInTheDocument();
  });

  it('has semantic ARIA attributes role="dialog", aria-modal="true", and aria-labelledby', () => {
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={jest.fn()}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'score-modal-title');

    const titleElement = screen.getByText('awesome-curry-app');
    expect(titleElement).toHaveAttribute('id', 'score-modal-title');
  });

  it('fires onClose when Escape key is pressed', () => {
    const handleClose = jest.fn();
    render(
      <ProjectScoreModal
        isOpen={true}
        onClose={handleClose}
        repositoryName="awesome-curry-app"
        scoreResult={mockScoreResult}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

