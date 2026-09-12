import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NonElementalLabel } from '../../../src/renderer/src/features/home/SkillsArticle/NonElementalLabel';

describe('NonElementalLabel Component', () => {
  it('renders the floating label with correct text', () => {
    render(<NonElementalLabel />);
    expect(screen.getByText('Skills no necesarias/prescindibles')).toBeInTheDocument();
  });

  it('renders the Spanish tooltip definition', () => {
    render(<NonElementalLabel />);
    const label = screen.getByText('Skills no necesarias/prescindibles');
    expect(label).toBeInTheDocument();

    const tooltipText = screen.getByText(
      /Non-Elemental se refiere a habilidades que son redundantes, excesivamente genéricas/i
    );
    expect(tooltipText).toBeInTheDocument();
  });
});
