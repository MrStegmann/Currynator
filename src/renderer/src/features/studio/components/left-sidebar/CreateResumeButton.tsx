import React from 'react';

interface CreateResumeButtonProps {
  onCreate: () => void;
  disabled?: boolean;
}

/**
 * Button triggering new resume instantiation with profile and GitHub project defaults.
 */
export const CreateResumeButton: React.FC<CreateResumeButtonProps> = ({ onCreate, disabled }) => {
  return (
    <button
      onClick={onCreate}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-blue-900/30 transition-all active:scale-[0.98]"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Create New Resume
    </button>
  );
};
