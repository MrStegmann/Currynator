import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CvDashboardView } from '../components/CvDashboardView';
import { useCvDashboardStore } from '../store/useCvDashboardStore';

describe('CvDashboardView - User Story 1 (Empty State)', () => {
  beforeEach(() => {
    useCvDashboardStore.setState({
      cvItems: [],
      activeView: 'CV Dashboard',
      deletingCvId: null,
    });
  });

  it('renders empty state warning message when no CVs exist', () => {
    render(<CvDashboardView />);
    
    const message = screen.getByText(
      /No has creado todavía ningún curriculum personalizado para ninguna vacante\. Empieza ahora pulsando en el botón de abajo\./i
    );
    expect(message).toBeInTheDocument();
  });

  it('renders "Crear nuevo CV" action button in empty state', () => {
    render(<CvDashboardView />);

    const createBtn = screen.getByRole('button', { name: /crear nuevo cv/i });
    expect(createBtn).toBeInTheDocument();
  });

  it('allows clicking "Crear nuevo CV" button without error', () => {
    render(<CvDashboardView />);

    const createBtn = screen.getByRole('button', { name: /crear nuevo cv/i });
    expect(() => fireEvent.click(createBtn)).not.toThrow();
  });
});

describe('CvDashboardView - User Story 2 (Populated Grid)', () => {
  beforeEach(() => {
    useCvDashboardStore.setState({
      cvItems: [
        {
          id: 'cv-1',
          targetVacancyTitle: 'Senior Frontend Developer',
          jobDescriptionSnippet: 'React, TypeScript and Tailwind ecosystem.',
          createdAt: '2026-09-01T10:00:00Z',
          updatedAt: '2026-09-10T12:00:00Z',
        },
        {
          id: 'cv-2',
          targetVacancyTitle: 'Backend Engineer',
          jobDescriptionSnippet: 'Node.js, PostgreSQL and Microservices.',
          createdAt: '2026-09-02T11:00:00Z',
          updatedAt: '2026-09-11T14:30:00Z',
        },
      ],
      activeView: 'CV Dashboard',
      deletingCvId: null,
    });
  });

  it('renders grid of CV item cards when CVs exist', () => {
    render(<CvDashboardView />);

    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('React, TypeScript and Tailwind ecosystem.')).toBeInTheDocument();
  });

  it('displays creation and updated timestamps on each card', () => {
    render(<CvDashboardView />);

    const createdElements = screen.getAllByText(/Creado:/i);
    const updatedElements = screen.getAllByText(/Actualizado:/i);

    expect(createdElements.length).toBeGreaterThan(0);
    expect(updatedElements.length).toBeGreaterThan(0);
  });
});

describe('CvDashboardView - User Story 3 (Card Actions & Delete Modal)', () => {
  beforeEach(() => {
    useCvDashboardStore.setState({
      cvItems: [
        {
          id: 'cv-1',
          targetVacancyTitle: 'Senior Frontend Developer',
          jobDescriptionSnippet: 'React, TypeScript and Tailwind ecosystem.',
          createdAt: '2026-09-01T10:00:00Z',
          updatedAt: '2026-09-10T12:00:00Z',
        },
      ],
      activeView: 'CV Dashboard',
      deletingCvId: null,
    });
  });

  it('opens custom confirmation modal when Delete icon is clicked', () => {
    render(<CvDashboardView />);

    const deleteBtn = screen.getByRole('button', { name: /delete cv/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/¿Eliminar currículum personalizado\?/i)).toBeInTheDocument();
  });

  it('cancels deletion when Cancel button in modal is clicked', () => {
    render(<CvDashboardView />);

    const deleteBtn = screen.getByRole('button', { name: /delete cv/i });
    fireEvent.click(deleteBtn);

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
  });

  it('removes CV card and shows empty state when deletion is confirmed on last item', () => {
    render(<CvDashboardView />);

    const deleteBtn = screen.getByRole('button', { name: /delete cv/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole('button', { name: /^eliminar$/i });
    fireEvent.click(confirmBtn);

    expect(screen.queryByText('Senior Frontend Developer')).not.toBeInTheDocument();
    expect(screen.getByText(/No has creado todavía ningún curriculum personalizado/i)).toBeInTheDocument();
  });
});
