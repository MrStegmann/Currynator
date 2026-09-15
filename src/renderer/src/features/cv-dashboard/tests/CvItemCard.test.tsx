import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { CvItemCard } from '../components/CvItemCard';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

describe('CvItemCard', () => {
  const mockApp: JobApplication = {
    id: 'app-123',
    title: 'Senior Frontend Developer',
    jobDescription: 'React and TypeScript expert needed',
    companyDescription: 'Awesome Corp',
    jobRequirement: '5+ years React',
    companyWebsiteUrl: 'https://example.com',
    status: 'pending',
    match_score: 90,
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-15T10:00:00Z',
  };

  it('renders pending status badge and match score', () => {
    render(<CvItemCard cvItem={mockApp} />);

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('90% Match')).toBeInTheDocument();
  });

  it('triggers onPreviewCv when Preview CV button is clicked', () => {
    const handlePreview = jest.fn();
    render(<CvItemCard cvItem={mockApp} onPreviewCv={handlePreview} />);

    const previewBtn = screen.getByTitle('Preview Curriculum Vitae');
    fireEvent.click(previewBtn);

    expect(handlePreview).toHaveBeenCalledWith('app-123');
  });

  it('triggers onRegenerateCv when Regenerate button is clicked', () => {
    const handleRegenerate = jest.fn();
    render(<CvItemCard cvItem={mockApp} onRegenerateCv={handleRegenerate} />);

    const regenBtn = screen.getByTitle('Regenerate CV via Groq AI');
    fireEvent.click(regenBtn);

    expect(handleRegenerate).toHaveBeenCalledWith('app-123');
  });
});
