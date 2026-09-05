import React from 'react';
import { useInitStore } from '../../initialization/store/initStore';

export const JsonDisplayView: React.FC = () => {
  const data = useInitStore(state => state.data);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-gray-400">No data to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-200">Raw JSON Data</h2>
        <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded-full text-xs font-medium">
          Saved Successfully
        </span>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-gray-700 bg-gray-950 shadow-inner">
        <textarea
          readOnly
          value={JSON.stringify(data, null, 2)}
          className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
