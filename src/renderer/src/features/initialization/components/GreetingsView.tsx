import React, { useEffect } from 'react';
import { useInitStore } from '../store/initStore';

export const GreetingsView: React.FC = () => {
  const checkSavedData = useInitStore(state => state.checkSavedData);

  useEffect(() => {
    checkSavedData();
  }, [checkSavedData]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Greetings!</h1>
        <p className="text-gray-400">Loading your profile...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
};
