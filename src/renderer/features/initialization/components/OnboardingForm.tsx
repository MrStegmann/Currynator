import React, { useState } from 'react';
import { z } from 'zod';
import { useInitStore } from '../store/initStore';

const Step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  label: z.string().min(1, 'Label is required'),
});

export const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    name: '', email: '', label: '', phone: '', url: '', summary: '',
    location: { address: '', city: '', region: '', postalCode: '', countryCode: '' },
    profiles: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const saveData = useInitStore(state => state.saveData);

  const handleNext = () => {
    if (step === 1) {
      const result = Step1Schema.safeParse(formData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        if (result.error && result.error.errors) {
          result.error.errors.forEach(err => {
            if (err.path[0]) newErrors[err.path[0] as string] = err.message;
          });
        }
        setErrors(newErrors);
        return;
      }
    }
    setErrors({});
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // The spec says partial data is discarded if closed midway.
    // If we reach here, we save to ipc
    await saveData({ basics: formData });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Welcome! Let's get started</h2>
        <p className="text-slate-400 mb-6">Step {step} of 3</p>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">Mandatory Info</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Professional Label</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.label}
                onChange={e => setFormData({...formData, label: e.target.value})}
              />
              {errors.label && <p className="text-red-400 text-sm mt-1">{errors.label}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">Contact Info (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
              <input 
                type="url" 
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">Summary (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Professional Summary</label>
              <textarea 
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
              ></textarea>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button 
            className={`px-4 py-2 rounded font-medium transition ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={handlePrev}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition"
              onClick={handleSubmit}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
