import React, { useEffect, useState } from 'react';

export const Greeting: React.FC = () => {
  const [response, setResponse] = useState<string>('');

  useEffect(() => {
    // Invoke IPC ping on mount
    const ping = async () => {
      try {
        if ((window as any).electron && (window as any).electron.ping) {
          const res = await (window as any).electron.ping();
          setResponse(res);
        }
      } catch (e) {
        console.error('IPC ping failed', e);
      }
    };
    ping();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Hello, World, I'm Currynator</h1>
      {response && <p className="text-xl text-green-400">{response}</p>}
    </div>
  );
};
