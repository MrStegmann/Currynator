import React, { useRef, useState } from 'react';
import { Archive, UploadCloud } from 'lucide-react';

interface ZipDropzoneProps {
  onFileSelect?: (file: File) => void;
}

export const ZipDropzone: React.FC<ZipDropzoneProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip') && onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`bg-surface-container-lowest border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[360px] ${
        isDragOver
          ? 'border-primary bg-primary-container/10 scale-[1.01]'
          : 'border-outline hover:border-primary hover:bg-surface-container-low'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 text-primary">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface mb-2">
        Drag and drop your LinkedIn export ZIP
      </h3>
      <p className="text-body-sm text-on-surface-variant max-w-sm mb-6">
        Supports official LinkedIn data export archives containing Profile, Positions, Education, Skills, and Languages CSV files.
      </p>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-medium text-body-md rounded-lg shadow-sm hover:bg-primary-container transition-colors"
      >
        <Archive className="w-4 h-4" />
        <span>Select ZIP File</span>
      </button>
    </div>
  );
};
