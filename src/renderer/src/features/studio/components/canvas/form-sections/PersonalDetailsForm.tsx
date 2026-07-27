import React from 'react';
import type { PersonalDetails } from '../../../types/resume.types';

export interface PersonalDetailsFormProps {
  details: PersonalDetails;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

/**
 * Labeled text input component for personal details fields.
 *
 * @param props - Input field properties.
 * @returns React element.
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  placeholder,
  onChange
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

/**
 * Form section component for editing candidate personal details and social links.
 *
 * @param props - Component props containing details object and field change handler.
 * @returns React component.
 */
export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ details, onChange }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
        Personal Information & Social Links
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={details.fullName || ''}
          placeholder="e.g. Jane Doe"
          onChange={(val) => onChange('fullName', val)}
        />
        <InputField
          label="Professional Title"
          value={details.professionalTitle || ''}
          placeholder="e.g. Senior Fullstack Developer"
          onChange={(val) => onChange('professionalTitle', val)}
        />
        <InputField
          label="Email Address"
          type="email"
          value={details.email || ''}
          placeholder="e.g. jane.doe@example.com"
          onChange={(val) => onChange('email', val)}
        />
        <InputField
          label="Phone Number"
          type="tel"
          value={details.phoneNumber || ''}
          placeholder="e.g. +1 555-0199"
          onChange={(val) => onChange('phoneNumber', val)}
        />
        <InputField
          label="Location"
          value={details.location || ''}
          placeholder="e.g. San Francisco, CA"
          onChange={(val) => onChange('location', val)}
        />
        <InputField
          label="LinkedIn URL"
          type="url"
          value={details.linkedinUrl || ''}
          placeholder="https://linkedin.com/in/username"
          onChange={(val) => onChange('linkedinUrl', val)}
        />
        <InputField
          label="GitHub URL"
          type="url"
          value={details.githubUrl || ''}
          placeholder="https://github.com/username"
          onChange={(val) => onChange('githubUrl', val)}
        />
        <InputField
          label="Portfolio / Website URL"
          type="url"
          value={details.websiteUrl || ''}
          placeholder="https://janedoe.dev"
          onChange={(val) => onChange('websiteUrl', val)}
        />
        <InputField
          label="Avatar Image URL"
          type="url"
          value={details.avatarUrl || ''}
          placeholder="https://example.com/avatar.jpg"
          onChange={(val) => onChange('avatarUrl', val)}
        />
      </div>
    </div>
  );
};
