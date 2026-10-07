import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { JobApplicationFormView } from '../components/JobApplicationFormView';
import { useProjectsStore } from '../../projects/store/useProjectsStore';

describe('JobApplicationFormView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProjectsStore.setState({
      repositories: [
        {
          id: 101,
          name: 'react-dashboard',
          description: 'A frontend dashboard in TypeScript and React',
          language: 'TypeScript',
          topics: ['react', 'dashboard'],
          stargazers_count: 12,
          html_url: 'https://github.com/user/react-dashboard',
          updated_at: '2026-03-01T00:00:00Z',
          owner: { login: 'user', avatar_url: '' },
          fork: false,
          created_at: '2026-01-01T00:00:00Z',
          pushed_at: '2026-03-01T00:00:00Z',
          default_branch: 'main',
          archived: false,
          disabled: false,
          visibility: 'public',
        } as any,
        {
          id: 102,
          name: 'python-data-pipeline',
          description: 'ETL tool in Python',
          language: 'Python',
          topics: ['etl'],
          stargazers_count: 5,
          html_url: 'https://github.com/user/python-data-pipeline',
          updated_at: '2025-10-01T00:00:00Z',
          owner: { login: 'user', avatar_url: '' },
          fork: false,
          created_at: '2025-01-01T00:00:00Z',
          pushed_at: '2025-10-01T00:00:00Z',
          default_branch: 'main',
          archived: false,
          disabled: false,
          visibility: 'public',
        } as any,
      ],
    });
  });

  it('renders full-page form with back arrow button and input fields', () => {
    const handleBack = jest.fn();
    const handleSave = jest.fn();

    render(
      <JobApplicationFormView
        onBack={handleBack}
        onSave={handleSave}
      />
    );

    expect(screen.getByText('Nueva Solicitud de Empleo')).toBeInTheDocument();
    expect(screen.getByTitle('Volver a las solicitudes')).toBeInTheDocument();

    const backBtn = screen.getByTitle('Volver a las solicitudes');
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('validates required fields before submitting', () => {
    const handleSave = jest.fn();
    const handleBack = jest.fn();

    render(
      <JobApplicationFormView
        onBack={handleBack}
        onSave={handleSave}
      />
    );

    const submitBtn = screen.getByText('Guardar Solicitud');
    fireEvent.click(submitBtn);

    expect(screen.getByText('El título del puesto es obligatorio.')).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it('extracts language keywords and auto-preselects matching GitHub projects', async () => {
    const handleSave = jest.fn();
    const handleBack = jest.fn();

    render(
      <JobApplicationFormView
        onBack={handleBack}
        onSave={handleSave}
      />
    );

    const reqInput = screen.getByLabelText(/Requisitos del puesto/i);
    fireEvent.change(reqInput, {
      target: { value: 'Looking for a Senior TypeScript and React engineer' },
    });

    // Verify detected keyword tag
    const tsTags = await screen.findAllByText('TypeScript');
    expect(tsTags.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Coincide con/i)).toBeInTheDocument();
    expect(screen.getByText('react-dashboard')).toBeInTheDocument();

    // Fill remaining required fields and submit
    fireEvent.change(screen.getByLabelText(/Título del puesto/i), {
      target: { value: 'Senior Frontend Dev' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción del puesto/i), {
      target: { value: 'Develop React components' },
    });

    const submitBtn = screen.getByText('Guardar Solicitud');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Senior Frontend Dev',
          tailored_json_resume: expect.objectContaining({
            projects: expect.arrayContaining([
              expect.objectContaining({
                name: 'react-dashboard',
              }),
            ]),
          }),
        })
      );
    });
  });

  it('allows user to manually toggle project selections', async () => {
    const handleSave = jest.fn();
    const handleBack = jest.fn();

    render(
      <JobApplicationFormView
        onBack={handleBack}
        onSave={handleSave}
      />
    );

    // Click python-data-pipeline card to select it
    const pythonCard = screen.getByText('python-data-pipeline');
    fireEvent.click(pythonCard);

    fireEvent.change(screen.getByLabelText(/Título del puesto/i), {
      target: { value: 'Data Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción del puesto/i), {
      target: { value: 'Manage data pipelines' },
    });
    fireEvent.change(screen.getByLabelText(/Requisitos del puesto/i), {
      target: { value: 'Python ETL pipelines' },
    });

    const submitBtn = screen.getByText('Guardar Solicitud');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          tailored_json_resume: expect.objectContaining({
            projects: expect.arrayContaining([
              expect.objectContaining({
                name: 'python-data-pipeline',
              }),
            ]),
          }),
        })
      );
    });
  });
});

