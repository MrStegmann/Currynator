import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  data: any;
  title?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  data,
  title = "Copy section JSON to clipboard",
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(data ?? {}, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy section JSON:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-colors ${
        copied
          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
      } ${className}`}
      title={copied ? 'Copied to clipboard!' : title}
      aria-label={copied ? 'Copied to clipboard' : title}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};
