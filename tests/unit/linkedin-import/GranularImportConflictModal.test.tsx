import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GranularImportConflictModal } from '../../../src/renderer/src/features/linkedin-import/components/GranularImportConflictModal';
import { Resume } from '../../../src/shared/schema/resumeSchema';

describe('GranularImportConflictModal Component', () => {
  const mockExistingData: Partial<Resume> = {
    basics: { name: 'Original Name', email: 'orig@example.com' },
    work: [{ name: 'Company A', position: 'Dev' }],
    education: [{ institution: 'Uni A' }]
  };

  const mockImportedData: Partial<Resume> = {
    basics: { name: 'Imported Name', email: 'imp@example.com' },
    work: [{ name: 'Company B', position: 'Lead' }],
    certificates: [{ name: 'Cert A' }]
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <GranularImportConflictModal
        isOpen={false}
        existingData={mockExistingData}
        importedData={mockImportedData}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders section options with Replace, Keep Original, and Merge options and descriptions', () => {
    render(
      <GranularImportConflictModal
        isOpen={true}
        existingData={mockExistingData}
        importedData={mockImportedData}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Import Conflict Resolution')).toBeInTheDocument();
    expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();

    // Check descriptions exist
    expect(screen.getAllByText(/Overwrite existing section data completely with the imported LinkedIn data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Retain your current section data and ignore the imported LinkedIn data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Combine existing section items with imported LinkedIn items without deleting original records/i).length).toBeGreaterThan(0);
  });

  it('calls onConfirm with selected section resolution map when confirm button clicked', () => {
    const handleConfirm = jest.fn();
    render(
      <GranularImportConflictModal
        isOpen={true}
        existingData={mockExistingData}
        importedData={mockImportedData}
        onConfirm={handleConfirm}
        onCancel={jest.fn()}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /confirm import/i });
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    const map = handleConfirm.mock.calls[0][0];
    expect(map).toHaveProperty('basics');
    expect(map).toHaveProperty('work');
  });
});
