import React, { useState } from 'react';
import { useInitStore } from '../store/initStore';
import { ZipDropzone } from '../../linkedin-import/components/ZipDropzone';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { Upload, User, AlertCircle, Loader2 } from 'lucide-react';

export const OnboardingForm: React.FC = () => {
  const [mode, setMode] = useState<'manual' | 'linkedin'>('manual');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleZipSelect = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const filePath = ipcClient.getPathForFile(file);
      const result = await ipcClient.parseLinkedinZip(filePath);

      if (result.success && result.data) {
        await saveData(result.data);
      } else {
        setErrorMessage(result.error || 'Failed to parse LinkedIn ZIP archive.');
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error processing ZIP file');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Header & Mode Selector */}
        <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Welcome! Let's get started</h2>
          <p className="text-xs text-gray-400 mt-1">
            Choose how you would like to initialize your resume profile.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex bg-gray-900/60 p-1 rounded-lg border border-gray-700">
            <button
              type="button"
              onClick={() => {
                setMode('manual');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'manual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Manual Setup</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('linkedin');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'linkedin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Import LinkedIn ZIP</span>
            </button>
          </div>

          {mode === 'manual' && (
            <div className="mt-4 flex space-x-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-indigo-500' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="m-4 p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode A: Manual Form */}
        {mode === 'manual' && (
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
        )}

        {/* Mode B: LinkedIn ZIP Import */}
        {mode === 'linkedin' && (
          <div className="p-6 space-y-4">
            <h3 className="text-base font-medium text-gray-200">Upload LinkedIn Export ZIP</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Export your data from LinkedIn (Settings &amp; Privacy &gt; Data privacy &gt; Get a copy of your data) and upload the ZIP file here to populate your profile automatically.
            </p>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-750 border border-gray-700 rounded-xl space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm font-medium text-gray-300">Processing LinkedIn Archive...</p>
              </div>
            ) : (
              <ZipDropzone onFileSelect={handleZipSelect} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
