import React from 'react';
import { useInitStore } from '../store/initStore';

export const ErrorScreen: React.FC = () => {
  const { status, errorType, retryCount, retry } = useInitStore();

  if (status === 'fatal_error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
        <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Fatal Error</h2>
          <p className="text-slate-300 mb-6">
            The application was unable to establish a connection with the backend services after multiple attempts. 
            Please restart the application or seek support if the problem persists.
          </p>
          <div className="text-sm text-slate-500">Error: IPC Connection Failed</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md w-full">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Connection Issue</h2>
        <p className="text-slate-300 mb-6">
          {errorType === 'timeout' 
            ? 'The data check took too long to respond (Timeout).' 
            : 'There was an error communicating with the backend.'}
        </p>
        
        <p className="text-sm text-slate-400 mb-6">
          Attempt {retryCount} of 3
        </p>

        <button 
          onClick={retry}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition w-full"
        >
          Retry
        </button>
      </div>
    </div>
  );
};
