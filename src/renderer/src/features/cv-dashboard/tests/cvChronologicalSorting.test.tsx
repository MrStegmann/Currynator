import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCvDashboardStore } from '../store/useCvDashboardStore';
import { PreviewCvModal } from '../components/PreviewCvModal';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

describe('CV Generation & Preview - Chronological Sorting', () => {
  beforeEach(() => {
    useCvDashboardStore.setState({
      jobApplications: [],
      cvItems: [],
      activeView: 'Home',
      deletingCvId: null,
      isFormModalOpen: false,
      editingJobApp: null,
      previewingCvApp: null,
      regeneratingAppId: null
    });
  });

  it('automatically sorts all tailored CV sections newest first when saving job application', async () => {
    const unsortedTailoredCv = {
      basics: { name: 'Alice Smith', label: 'Software Engineer', email: 'alice@example.com' },
      work: [
        { name: 'Old Company', startDate: '2016-01', endDate: '2019-01' },
        { name: 'Current Company', startDate: '2023-01', endDate: 'Currently' },
        { name: 'Mid Company', startDate: '2019-02', endDate: '2022-12' }
      ],
      education: [
        { institution: 'College A', startDate: '2012-09', endDate: '2016-06' },
        { institution: 'University B', startDate: '2016-09', endDate: '2018-06' }
      ],
      certificates: [
        { name: 'Cert 2020', date: '2020-03-01' },
        { name: 'Cert 2024', date: '2024-01-10' }
      ],
      projects: [
        { name: 'Repo Older', updated_at: '2021-01-01T00:00:00Z' },
        { name: 'Repo Newer', updated_at: '2024-05-01T00:00:00Z' }
      ]
    };

    const spyAnalyze = jest.spyOn(ipcClient, 'analyzeCvJobDriven').mockResolvedValue({
      success: true,
      match_score: 92,
      json_resume: unsortedTailoredCv
    });

    await useCvDashboardStore.getState().saveJobApplication({
      title: 'Full Stack Engineer',
      jobDescription: 'React and Node role',
      jobRequirement: 'TypeScript, React'
    });

    const state = useCvDashboardStore.getState();
    expect(state.jobApplications).toHaveLength(1);
    const tailored = state.jobApplications[0].tailored_json_resume;

    expect(tailored?.work?.map((w: any) => w.name)).toEqual([
      'Current Company',
      'Mid Company',
      'Old Company'
    ]);
    expect(tailored?.education?.map((e: any) => e.institution)).toEqual([
      'University B',
      'College A'
    ]);
    expect(tailored?.certificates?.map((c: any) => c.name)).toEqual([
      'Cert 2024',
      'Cert 2020'
    ]);
    expect(tailored?.projects?.map((p: any) => p.name)).toEqual([
      'Repo Newer',
      'Repo Older'
    ]);

    spyAnalyze.mockRestore();
  });

  it('renders preview modal with sections in descending chronological order', () => {
    const mockApp: JobApplication = {
      id: 'app-1',
      title: 'Backend Developer',
      jobDescription: 'Go backend systems',
      jobRequirement: 'Go, PostgreSQL',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tailored_json_resume: {
        basics: { name: 'Bob Developer' },
        work: [
          { position: 'Junior Dev', name: 'Past Corp', startDate: '2019-01', endDate: '2021-01' },
          { position: 'Staff Engineer', name: 'Current Corp', startDate: '2023-01', endDate: '' }
        ],
        education: [
          { institution: 'First School', endDate: '2018' },
          { institution: 'Recent School', endDate: '2022' }
        ]
      }
    };

    render(
      <PreviewCvModal
        isOpen={true}
        onClose={() => {}}
        jobApplication={mockApp}
      />
    );

    const positions = screen.getAllByRole('heading', { level: 5 }).map(h => h.textContent);
    expect(positions).toContain('Staff Engineer');
    expect(positions).toContain('Junior Dev');
    const staffIdx = positions.indexOf('Staff Engineer');
    const juniorIdx = positions.indexOf('Junior Dev');
    expect(staffIdx).toBeLessThan(juniorIdx);
  });
});
