import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ResumeSection } from './ResumeSection';

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
              <ResumeSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
