import React from 'react';

interface CorruptedDataModalProps {
  onReset: () => void;
}

export const CorruptedDataModal: React.FC<CorruptedDataModalProps> = ({ onReset }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full space-y-6 shadow-2xl">
        <div className="flex items-center space-x-4 text-amber-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold">Data is Corrupted</h2>
        </div>
        
        <p className="text-gray-300">
          The saved resume data appears to be invalid or corrupted. To continue using the app, you need to reset the data and start over.
        </p>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
