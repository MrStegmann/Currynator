import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { ScoreConfirmModal } from '../components/ScoreConfirmModal';

describe('ScoreConfirmModal', () => {
  it('should render warning message with project count and rate limit warning', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(
      <ScoreConfirmModal
        isOpen={true}
        projectCount={5}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(
      screen.getByText(/5 projects will be Scored\. Are you sure\? Some Projects could be not scored due to limit rates of AI Agent\./i)
    ).toBeInTheDocument();
  });

  it('should trigger onConfirm when confirm button clicked', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(
      <ScoreConfirmModal
        isOpen={true}
        projectCount={3}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText(/confirm & score all/i));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should trigger onCancel when cancel button clicked', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(
      <ScoreConfirmModal
        isOpen={true}
        projectCount={3}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText(/cancel/i));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
