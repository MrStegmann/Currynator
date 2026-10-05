import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicToolbar } from '../../../src/shared/components/DynamicToolbar/DynamicToolbar';

describe('DynamicToolbar Component', () => {
  it('renders "Import LinkedIn CSV" button when activeView is Home', () => {
    const handleImportCsv = jest.fn();
    render(
      <DynamicToolbar
        activeView="Home"
        onImportCsv={handleImportCsv}
      />
    );

    const importButton = screen.getByRole('button', { name: /import linkedin csv/i });
    expect(importButton).toBeInTheDocument();
    
    fireEvent.click(importButton);
    expect(handleImportCsv).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('button', { name: /new apply/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sync/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /score/i })).not.toBeInTheDocument();
  });

  it('renders "New Apply" button when activeView is CV Dashboard', () => {
    const handleNewApply = jest.fn();
    render(
      <DynamicToolbar
        activeView="CV Dashboard"
        onNewApply={handleNewApply}
      />
    );

    const newApplyButton = screen.getByRole('button', { name: /new apply/i });
    expect(newApplyButton).toBeInTheDocument();

    fireEvent.click(newApplyButton);
    expect(handleNewApply).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('button', { name: /import linkedin csv/i })).not.toBeInTheDocument();
  });

  it('renders "Sync Projects" and "Score Projects" buttons when activeView is Projects', () => {
    const handleSync = jest.fn();
    const handleScore = jest.fn();
    render(
      <DynamicToolbar
        activeView="Projects"
        onSyncProjects={handleSync}
        onScoreProjects={handleScore}
      />
    );

    const syncButton = screen.getByRole('button', { name: /sync/i });
    const scoreButton = screen.getByRole('button', { name: /score/i });

    expect(syncButton).toBeInTheDocument();
    expect(scoreButton).toBeInTheDocument();

    fireEvent.click(syncButton);
    expect(handleSync).toHaveBeenCalledTimes(1);

    fireEvent.click(scoreButton);
    expect(handleScore).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('button', { name: /new apply/i })).not.toBeInTheDocument();
  });

  it('disables buttons when loading states are active', () => {
    render(
      <DynamicToolbar
        activeView="Projects"
        isSyncingProjects={true}
        isScoringProjects={true}
      />
    );

    const syncButton = screen.getByRole('button', { name: /sync/i });
    const scoreButton = screen.getByRole('button', { name: /score/i });

    expect(syncButton).toBeDisabled();
    expect(scoreButton).toBeDisabled();
  });
});
