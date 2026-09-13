import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CvItemCard } from '../components/CvItemCard';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

describe('CvItemCard - Status Badge and Fast-Status Progression', () => {
  const mockJobApp: JobApplication = {
    id: 'job-app-1',
    title: 'Senior React Developer',
    jobDescription: 'Building high quality web applications.',
    companyDescription: 'Tech Inc',
    jobRequirement: '5+ years React',
    companyWebsiteUrl: 'https://example.com',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-10T12:00:00Z',
    status: 'applied',
  };

  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders top-left status badge with correct text for "applied"', () => {
    render(<CvItemCard cvItem={mockJobApp} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByText('Solicitado')).toBeInTheDocument();
  });

  it('renders status badge for "interview"', () => {
    render(
      <CvItemCard
        cvItem={{ ...mockJobApp, status: 'interview' }}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Entrevista')).toBeInTheDocument();
  });

  it('advances status from "applied" to "called" when fast-status progression button is clicked', () => {
    render(<CvItemCard cvItem={mockJobApp} onStatusChange={mockOnStatusChange} />);

    const nextStatusBtn = screen.getByRole('button', { name: /avanzar estado/i });
    fireEvent.click(nextStatusBtn);

    expect(mockOnStatusChange).toHaveBeenCalledWith('job-app-1', 'called');
  });

  it('advances status from "techTest" to "rejected" or "gotTheJob"', () => {
    render(
      <CvItemCard
        cvItem={{ ...mockJobApp, status: 'techTest' }}
        onStatusChange={mockOnStatusChange}
      />
    );

    const nextStatusBtn = screen.getByRole('button', { name: /avanzar estado/i });
    fireEvent.click(nextStatusBtn);

    expect(mockOnStatusChange).toHaveBeenCalledWith('job-app-1', 'rejected');
  });
});
