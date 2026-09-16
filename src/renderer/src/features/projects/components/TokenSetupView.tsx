import React from 'react';
import { TokenGuide } from './TokenGuide';
import { TokenInputForm } from './TokenInputForm';

export const TokenSetupView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-headline-lg font-semibold text-on-surface m-0">
          Connect Your GitHub Account
        </h2>
        <p className="text-body-md text-on-surface-variant max-w-xl mx-auto mt-2">
          Set up a Personal Access Token to list, view, and sync your GitHub repositories directly inside Currynator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Step-by-Step Guide */}
        <TokenGuide />

        {/* Right Column: Password Masked Input Form */}
        <TokenInputForm />
      </div>
    </div>
  );
};
