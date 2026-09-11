import React from 'react';
import { Upload } from 'lucide-react';

interface FloatingImportButtonProps {
  onClick: () => void;
}

export const FloatingImportButton: React.FC<FloatingImportButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Import Linkedin CSV"
      className="fixed top-20 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-medium text-body-md rounded-lg shadow-md hover:bg-primary-container transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
    >
      <Upload className="w-4 h-4" />
      <span>Import Linkedin CSV</span>
    </button>
  );
};
