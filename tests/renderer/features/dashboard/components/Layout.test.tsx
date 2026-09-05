import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../../../../src/renderer/features/dashboard/components/Header';
import { Sidebar } from '../../../../../src/renderer/features/dashboard/components/Sidebar';

describe('Dashboard Layout Components', () => {
  it('renders Header', () => {
    render(<Header />);
    expect(screen.getByText(/Currynator Dashboard/i)).toBeInTheDocument();
  });

  it('renders Sidebar', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Basics/i)).toBeInTheDocument();
  });
});
