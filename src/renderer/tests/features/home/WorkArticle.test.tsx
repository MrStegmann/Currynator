import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorkArticle } from '../../../src/features/home/WorkArticle/WorkArticle';
import { useResumeStore } from '../../../src/store/useResumeStore';

jest.mock('../../../src/store/useResumeStore');

describe('WorkArticle Component - AI Analysis Button', () => {
  const mockAnalyzeWork = jest.fn<any>();
  const mockToggleEdit = jest.fn<any>();

  beforeEach(() => {
    jest.clearAllMocks();
    (useResumeStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const state = {
        data: {
          work: [
            {
              name: 'Tech Inc',
              position: 'Developer',
              startDate: '2020-01',
              endDate: '2022-01',
              summary: 'Worked on web apps',
              highlights: ['Built feature X']
            }
          ]
        },
        analyzeWork: mockAnalyzeWork,
        addArrayItem: jest.fn(),
        updateArrayItem: jest.fn(),
        deleteArrayItem: jest.fn()
      };
      return selector(state);
    });
  });

  it('renders "Analyze with AI" button positioned in header', () => {
    render(<WorkArticle />);
    const aiBtn = screen.getByRole('button', { name: /analyze with ai/i });
    expect(aiBtn).toBeInTheDocument();
  });

  it('triggers analyzeWork when "Analyze with AI" button is clicked', async () => {
    mockAnalyzeWork.mockResolvedValue({ success: true });
    render(<WorkArticle />);

    const aiBtn = screen.getByRole('button', { name: /analyze with ai/i });
    await act(async () => {
      fireEvent.click(aiBtn);
    });

    expect(mockAnalyzeWork).toHaveBeenCalled();
  });

  it('displays error banner and retry button when analyzeWork fails', async () => {
    mockAnalyzeWork.mockResolvedValue({ success: false, error: 'GROQ API key missing' });
    render(<WorkArticle />);

    const aiBtn = screen.getByRole('button', { name: /analyze with ai/i });
    await act(async () => {
      fireEvent.click(aiBtn);
    });

    expect(screen.getByText('GROQ API key missing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

    // Trigger retry
    mockAnalyzeWork.mockResolvedValue({ success: true });
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(mockAnalyzeWork).toHaveBeenCalledTimes(2);
  });
});
