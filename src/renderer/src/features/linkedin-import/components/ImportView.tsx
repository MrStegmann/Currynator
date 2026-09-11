import React, { useEffect, useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { InstructionStepList } from './InstructionStepList';
import { ZipDropzone } from './ZipDropzone';
import { ImportProgressBar } from './ImportProgressBar';
import { PreExistingPromptModal } from './PreExistingPromptModal';
import { useImportStore } from '../store/useImportStore';
import { useResumeStore } from '../../../store/useResumeStore';
import { ipcClient } from '../../../shared/ipc/ipcClient';
import { Resume } from '../../../../../shared/schema/resumeSchema';

interface ImportViewProps {
  onBack: () => void;
  onFileSelect?: (file: File) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onBack, onFileSelect }) => {
  const { stage, percentage, message, error, parsedResume, hasExistingData, skippedOptionalFiles, setProgress, setParsedData, reset } = useImportStore();
  const { loadResume, setResumeData } = useResumeStore();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ipcClient.onImportProgress((progress) => {
      setProgress(progress);
    });
    return () => {
      unsubscribe();
    };
  }, [setProgress]);

  const saveParsedData = async (data: Resume, strategy: 'replace' | 'keep') => {
    setIsPromptOpen(false);
    setProgress({ stage: 'saving', percentage: 90, message: 'Saving imported resume data...' });

    try {
      const res = await ipcClient.saveImportedData(data, strategy);
      if (res.success) {
        await loadResume();
        setProgress({
          stage: 'complete',
          percentage: 100,
          message: 'LinkedIn CSV data imported successfully!'
        });
      } else {
        setProgress({
          stage: 'error',
          percentage: 0,
          message: res.error || 'Failed to save imported resume data.'
        });
      }
    } catch (err) {
      setProgress({
        stage: 'error',
        percentage: 0,
        message: err instanceof Error ? err.message : 'Failed to save data'
      });
    }
  };

  const handleFileSelect = async (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }

    reset();
    setProgress({ stage: 'extracting', percentage: 10, message: `Reading file ${file.name}...` });

    try {
      const filePath = ipcClient.getPathForFile(file);
      const result = await ipcClient.parseLinkedinZip(filePath);

      if (result.success && result.data) {
        setParsedData(result.data, result.hasExistingData, result.skippedOptionalFiles || []);

        if (result.hasExistingData) {
          setIsPromptOpen(true);
        } else {
          await saveParsedData(result.data, 'replace');
        }
      } else {
        setProgress({
          stage: 'error',
          percentage: 0,
          message: result.error || 'Failed to parse LinkedIn ZIP archive.',
          skippedOptionalFiles: result.skippedOptionalFiles || []
        });
      }
    } catch (err) {
      setProgress({
        stage: 'error',
        percentage: 0,
        message: err instanceof Error ? err.message : 'Error processing ZIP file'
      });
    }
  };

  const handlePromptReplace = async () => {
    if (parsedResume) {
      await saveParsedData(parsedResume, 'replace');
    }
  };

  const handlePromptKeep = async () => {
    if (parsedResume) {
      await saveParsedData(parsedResume, 'keep');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Pre-Existing Data Prompt Modal */}
      <PreExistingPromptModal
        isOpen={isPromptOpen}
        onReplace={handlePromptReplace}
        onKeep={handlePromptKeep}
        onCancel={() => {
          setIsPromptOpen(false);
          reset();
        }}
      />

      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <button
          onClick={() => {
            reset();
            onBack();
          }}
          aria-label="Back"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-body-md font-medium text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-headline-lg font-semibold text-on-surface">Import LinkedIn Data</h1>
        <div className="w-24" />
      </div>

      {/* Progress Bar Container */}
      {stage !== 'idle' && stage !== 'complete' && stage !== 'error' && (
        <ImportProgressBar message={message} percentage={percentage} />
      )}

      {/* Completion View */}
      {stage === 'complete' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-headline-md font-semibold text-on-surface m-0">Import Completed!</h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Your LinkedIn profile data has been processed and saved to your resume.
            </p>
          </div>

          {skippedOptionalFiles.length > 0 && (
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-body-sm font-semibold text-on-surface mb-2">
                <FileText className="w-4 h-4 text-on-surface-variant" />
                <span>Skipped Optional CSV Files ({skippedOptionalFiles.length})</span>
              </div>
              <ul className="text-body-sm text-on-surface-variant list-disc list-inside space-y-1">
                {skippedOptionalFiles.map((fileName, idx) => (
                  <li key={idx}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              reset();
              onBack();
            }}
            className="w-full py-3 bg-primary text-on-primary font-semibold text-body-lg rounded-xl hover:bg-primary-container transition-all cursor-pointer shadow-md"
          >
            Return to Home
          </button>
        </div>
      )}

      {/* Error View */}
      {stage === 'error' && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-body-md">Import Error</p>
            <p className="text-body-sm mt-1">{message || error}</p>
          </div>
        </div>
      )}

      {/* 2-Column Layout */}
      {stage !== 'complete' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Instructions */}
          <InstructionStepList />

          {/* Right Column: ZIP Dropzone */}
          <ZipDropzone onFileSelect={handleFileSelect} />
        </div>
      )}
    </div>
  );
};
