import React from 'react';
import { OnboardingForm } from './OnboardingForm';

export const CorruptedDataModal: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 overflow-y-auto">
      <div className="bg-red-900/40 text-red-100 p-4 text-center border-b border-red-800">
        <h2 className="font-bold text-lg mb-1">Corrupted Data Detected</h2>
        <p className="text-sm">Your previously saved data is invalid or missing mandatory fields. You must fill out this form to repair your profile. Valid sections have been preserved where possible.</p>
      </div>
      
      {/* Reusing OnboardingForm - the form handles its own layout and styling */}
      <div className="flex-1">
        <OnboardingForm />
      </div>
    </div>
  );
};
