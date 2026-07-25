import React, { useState } from 'react';
import type { TargetCompanyInfo } from '../../types/studio.types';

interface JobOptimizationModalProps {
  isOpen: boolean;
  onSubmit: (info: TargetCompanyInfo) => void;
  onCancel: () => void;
}

/**
 * Modal form collecting target company details for AI Specific Optimization.
 */
export const JobOptimizationModal: React.FC<JobOptimizationModalProps> = ({
  isOpen,
  onSubmit,
  onCancel
}) => {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [requisites, setRequisites] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim() || !requisites.trim()) {
      setError('Company Name, Position, and Requisites are required fields.');
      return;
    }

    setError('');
    onSubmit({
      companyName: companyName.trim(),
      position: position.trim(),
      requisites: requisites.trim(),
      responsibilities: responsibilities.trim() || undefined,
      location: location.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-slate-100 mb-1">AI Specific Optimization</h3>
        <p className="text-slate-400 text-xs mb-4">
          Provide target company details to align your resume experience without inventing unsupported tech.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Role / Position <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Requisites / Qualifications <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={requisites}
              onChange={(e) => setRequisites(e.target.value)}
              placeholder="Paste required skills and qualifications..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Responsibilities (Optional)
            </label>
            <textarea
              rows={2}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Key responsibilities..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote / New York, NY"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-900/30 transition-all active:scale-95"
            >
              Start Optimization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
