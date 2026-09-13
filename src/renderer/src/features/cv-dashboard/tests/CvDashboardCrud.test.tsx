import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CvDashboardView } from '../components/CvDashboardView';
import { useCvDashboardStore } from '../store/useCvDashboardStore';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

describe('CvDashboardCrud - User Story 3', () => {
  const mockJobApp: JobApplication = {
    id: 'job-app-1',
    title: 'Senior Frontend Engineer',
    jobDescription: 'React and TypeScript',
    companyDescription: 'Tech Corp',
    jobRequirement: '5+ years experience',
    companyWebsiteUrl: 'https://example.com',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-10T12:00:00Z',
    status: 'applied',
  };

  beforeEach(() => {
    useCvDashboardStore.setState({
      cvItems: [],
      jobApplications: [mockJobApp],
      activeView: 'CV Dashboard',
      deletingCvId: null,
      isFormModalOpen: false,
      editingJobApp: null,
    });
  });

  it('renders real job application cards from jobApplications store state', () => {
    render(<CvDashboardView />);

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('React and TypeScript')).toBeInTheDocument();
  });

  it('opens modal pre-hydrated when Edit button is clicked on card', () => {
    render(<CvDashboardView />);

    const editBtn = screen.getByRole('button', { name: /edit cv/i });
    fireEvent.click(editBtn);

    expect(screen.getByText('Editar Solicitud de Empleo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del puesto/i)).toHaveValue('Senior Frontend Engineer');
  });

  it('opens delete confirmation modal and removes job application when confirmed', async () => {
    render(<CvDashboardView />);

    const deleteBtn = screen.getByRole('button', { name: /delete cv/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /^eliminar$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
    });
  });
});
