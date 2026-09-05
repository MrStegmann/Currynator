import React, { useState } from 'react';
import { useInitStore } from '../store/initStore';

export const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const saveData = useInitStore(state => state.saveData);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    label: '',
    phone: '',
    summary: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveData({
      basics: {
        name: formData.name,
        email: formData.email,
        label: formData.label,
        phone: formData.phone || undefined,
        summary: formData.summary || undefined
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Welcome! Let's get started</h2>
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-indigo-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-medium text-gray-200">1. Personal Details</h3>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-400">Label (e.g. Developer) *</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  required
                  value={formData.label}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-medium text-gray-200">2. Contact Information</h3>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400">Phone (Optional)</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-medium text-gray-200">3. Details</h3>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-400">Summary (Optional)</label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={4}
                  value={formData.summary}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Back
              </button>
            ) : <div></div>}
            
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              {step === 3 ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
