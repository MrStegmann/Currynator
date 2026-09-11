import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImportProgressBar } from '../../../../src/features/linkedin-import/components/ImportProgressBar';

describe('ImportProgressBar', () => {
  it('renders progress bar with message and percentage', () => {
    render(<ImportProgressBar message="Extracting Profile.csv..." percentage={45} />);

    expect(screen.getByText('Extracting Profile.csv...')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });
});
