import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JobApplicationFormModal } from '../components/JobApplicationFormModal';
import { JobApplication } from '../../../../../main/shared/schema/jobApplicationSchema';

describe('JobApplicationFormModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal in creation mode with blank fields', () => {
    render(<JobApplicationFormModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

    expect(screen.getByText('Nueva Solicitud de Empleo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del puesto/i)).toHaveValue('');
    expect(screen.getByLabelText(/Descripción del puesto/i)).toHaveValue('');
    expect(screen.getByLabelText(/Requisitos del puesto/i)).toHaveValue('');
  });

  it('renders modal in edit mode pre-hydrated with existing job application data', () => {
    const existingApp: JobApplication = {
      id: 'job-1',
      title: 'Senior React Developer',
      jobDescription: 'Develop web apps using React and TypeScript.',
      companyDescription: 'Tech Corp',
      jobRequirement: '5+ years experience',
      companyWebsiteUrl: 'https://example.com',
      created_at: '2026-09-13T20:00:00.000Z',
      updated_at: '2026-09-13T20:00:00.000Z',
      status: 'applied',
    };

    render(
      <JobApplicationFormModal
        isOpen={true}
        initialData={existingApp}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Editar Solicitud de Empleo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del puesto/i)).toHaveValue('Senior React Developer');
    expect(screen.getByLabelText(/Descripción del puesto/i)).toHaveValue(
      'Develop web apps using React and TypeScript.'
    );
  });

  it('validates required fields before submitting', async () => {
    render(<JobApplicationFormModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

    const saveBtn = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('calls onSave with form values when required fields are provided', async () => {
    render(<JobApplicationFormModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/Título del puesto/i), {
      target: { value: 'Frontend Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción del puesto/i), {
      target: { value: 'Building UI components' },
    });
    fireEvent.change(screen.getByLabelText(/Requisitos del puesto/i), {
      target: { value: 'React, Tailwind' },
    });

    const saveBtn = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Frontend Engineer',
          jobDescription: 'Building UI components',
          jobRequirement: 'React, Tailwind',
        })
      );
    });
  });
});
