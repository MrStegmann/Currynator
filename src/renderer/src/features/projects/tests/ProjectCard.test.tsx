import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard } from '../components/ProjectCard';
import { GitHubRepository, AIScoreResult } from '../types/projects';

const mockRepo: GitHubRepository = {
  id: 101,
  name: 'currynator-core',
  full_name: 'user/currynator-core',
  description: 'AI resume building workspace',
  html_url: 'https://github.com/user/currynator-core',
  stargazers_count: 42,
  forks_count: 5,
  language: 'TypeScript',
  updated_at: '2026-09-19T10:00:00Z',
  private: false,
  size: 1024
};

const mockScore: AIScoreResult = {
  repoId: 101,
  repoName: 'currynator-core',
  totalScore: 88,
  evaluatedAt: '2026-09-19T10:05:00Z',
  logs: [
    {
      category: 'readme_structure',
      title: 'README Structure',
      score: 90,
      log: 'Excellent README documentation.',
      improvements: ['Add detailed installation instructions.']
    }
  ]
};

describe('ProjectCard Component', () => {
  it('renders repository name and basic details', () => {
    render(<ProjectCard repository={mockRepo} />);
    expect(screen.getByText('currynator-core')).toBeInTheDocument();
    expect(screen.getByText('AI resume building workspace')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders total score badge in top-right corner when score is present', () => {
    render(<ProjectCard repository={mockRepo} scoreResult={mockScore} />);
    const scoreBadge = screen.getByRole('button', { name: /view score breakdown for currynator-core/i });
    expect(scoreBadge).toBeInTheDocument();
    expect(scoreBadge).toHaveTextContent('88/100');
  });

  it('triggers onOpenScoreModal when score badge is clicked', () => {
    const handleOpenScoreModal = jest.fn();
    render(
      <ProjectCard
        repository={mockRepo}
        scoreResult={mockScore}
        onOpenScoreModal={handleOpenScoreModal}
      />
    );

    const scoreBadge = screen.getByRole('button', { name: /view score breakdown for currynator-core/i });
    fireEvent.click(scoreBadge);

    expect(handleOpenScoreModal).toHaveBeenCalledTimes(1);
    expect(handleOpenScoreModal).toHaveBeenCalledWith(mockRepo);
  });

  it('supports keyboard Enter/Space activation on score badge', () => {
    const handleOpenScoreModal = jest.fn();
    render(
      <ProjectCard
        repository={mockRepo}
        scoreResult={mockScore}
        onOpenScoreModal={handleOpenScoreModal}
      />
    );

    const scoreBadge = screen.getByRole('button', { name: /view score breakdown for currynator-core/i });
    fireEvent.keyDown(scoreBadge, { key: 'Enter', code: 'Enter' });

    expect(handleOpenScoreModal).toHaveBeenCalledWith(mockRepo);
  });
});
