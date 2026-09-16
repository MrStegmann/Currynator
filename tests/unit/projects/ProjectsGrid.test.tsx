import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard } from '../../../src/renderer/src/features/projects/components/ProjectCard';
import { ProjectsGrid } from '../../../src/renderer/src/features/projects/components/ProjectsGrid';
import { PaginationControls } from '../../../src/renderer/src/features/projects/components/PaginationControls';
import { GitHubRepository } from '../../../src/renderer/src/features/projects/types/projects';

describe('ProjectCard Component', () => {
  const sampleRepo: GitHubRepository = {
    id: 101,
    name: 'AwesomeApp',
    full_name: 'user/AwesomeApp',
    description: 'An awesome test repository',
    html_url: 'https://github.com/user/AwesomeApp',
    stargazers_count: 42,
    forks_count: 5,
    language: 'TypeScript',
    updated_at: '2026-09-01T10:00:00Z',
    private: false
  };

  it('renders repository title, description, language, and star count', () => {
    render(<ProjectCard repository={sampleRepo} />);

    expect(screen.getByText('AwesomeApp')).toBeInTheDocument();
    expect(screen.getByText('An awesome test repository')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

describe('ProjectsGrid Component', () => {
  const sampleRepos: GitHubRepository[] = [
    {
      id: 1,
      name: 'Repo1',
      full_name: 'user/Repo1',
      description: 'Desc 1',
      html_url: 'https://github.com/user/Repo1',
      stargazers_count: 10,
      forks_count: 1,
      language: 'JavaScript',
      updated_at: '2026-09-01T10:00:00Z',
      private: false
    },
    {
      id: 2,
      name: 'Repo2',
      full_name: 'user/Repo2',
      description: 'Desc 2',
      html_url: 'https://github.com/user/Repo2',
      stargazers_count: 20,
      forks_count: 2,
      language: 'Python',
      updated_at: '2026-09-01T10:00:00Z',
      private: true
    }
  ];

  it('renders grid with 5-column responsive Tailwind class and repository cards', () => {
    const { container } = render(<ProjectsGrid repositories={sampleRepos} />);

    const gridDiv = container.querySelector('.grid');
    expect(gridDiv).toBeInTheDocument();
    expect(gridDiv).toHaveClass('xl:grid-cols-5');

    expect(screen.getByText('Repo1')).toBeInTheDocument();
    expect(screen.getByText('Repo2')).toBeInTheDocument();
  });
});

describe('PaginationControls Component', () => {
  it('renders page indicator and handles previous/next button clicks', () => {
    const handlePageChange = jest.fn();
    render(
      <PaginationControls
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/Page 2 of 5/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });

    fireEvent.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
