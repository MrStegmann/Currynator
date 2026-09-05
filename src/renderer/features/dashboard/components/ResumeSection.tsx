import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export const ResumeSection: React.FC = () => {
  const activeSection = useDashboardStore(state => state.activeSection);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-indigo-400 capitalize">{activeSection}</h2>
      <div className="text-slate-300">
        <p>This is the placeholder for the {activeSection} section of your JSON Resume.</p>
        <p className="mt-4 text-sm text-slate-500">Edit form functionality will be implemented here in future iterations.</p>
      </div>
    </div>
  );
};
