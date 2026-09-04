import React from 'react';
import { Greeting } from './features/greeting/Greeting';

export const App: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen">
      <Greeting />
    </div>
  );
};
