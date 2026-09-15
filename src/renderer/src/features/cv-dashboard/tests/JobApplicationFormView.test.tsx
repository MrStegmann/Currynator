import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { JobApplicationFormView } from '../components/JobApplicationFormView';

describe('JobApplicationFormView', () => {
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
});
