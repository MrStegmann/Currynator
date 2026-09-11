import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const InstructionStepList: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Open LinkedIn Settings & Privacy',
      desc: 'Log in to your LinkedIn account, click your profile icon at the top right, and choose "Settings & Privacy".'
    },
    {
      num: 2,
      title: 'Navigate to Data Privacy',
      desc: 'Select "Data Privacy" from the left menu, then click on "Get a copy of your data".'
    },
    {
      num: 3,
      title: 'Select Data Archive',
      desc: 'Choose "Download larger data archive" (or select individual data files including Profile, Positions, Education, Skills, and Languages).'
    },
    {
      num: 4,
      title: 'Request Archive & Download ZIP',
      desc: 'Click "Request archive". LinkedIn will process your request and email you a link to download your .zip archive.'
    },
    {
      num: 5,
      title: 'Upload ZIP Archive',
      desc: 'Once downloaded, drag and drop the .zip file into the box on the right or click to select the file.'
    }
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-headline-md font-semibold text-on-surface">How to get your LinkedIn data</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Follow these simple steps to download your official data export from LinkedIn.
          </p>
        </div>
        <a
          href="https://www.linkedin.com/mypreferences/d/download-my-data"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline"
        >
          <span>Open LinkedIn</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <ol className="space-y-4">
        {steps.map(step => (
          <li key={step.num} className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-semibold text-body-sm flex items-center justify-center">
              {step.num}
            </span>
            <div>
              <h3 className="text-body-md font-semibold text-on-surface">{step.title}</h3>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
