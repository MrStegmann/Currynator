import React from 'react';
import { Key, CheckCircle2, ExternalLink } from 'lucide-react';

export const TokenGuide: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Open GitHub Developer Settings',
      description: 'Log in to your GitHub account and navigate to Settings > Developer Settings > Personal Access Tokens.'
    },
    {
      num: 2,
      title: 'Generate New Token (Classic)',
      description: 'Click "Generate new token" and select "Generate new token (classic)".'
    },
    {
      num: 3,
      title: 'Configure Token Scope',
      description: 'Add a note (e.g., "Currynator") and check the "repo" scope to grant access to view your repositories.'
    },
    {
      num: 4,
      title: 'Copy & Paste Token',
      description: 'Click "Generate token" at the bottom of the page and copy the generated token string into the form.'
    }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
        <div className="p-2.5 bg-primary-container text-on-primary-container rounded-xl">
          <Key className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-title-lg font-semibold text-on-surface m-0">
            How to Create a GitHub Token
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Follow these simple steps to generate a Personal Access Token.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map(s => (
          <div key={s.num} className="flex items-start gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-body-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              {s.num}
            </div>
            <div className="space-y-1">
              <h4 className="text-body-md font-semibold text-on-surface m-0">
                {s.title}
              </h4>
              <p className="text-body-sm text-on-surface-variant leading-relaxed m-0">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-body-md font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span>Open GitHub Token Settings</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
