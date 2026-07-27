import React from 'react';
import type { CertificationItem } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

export interface CertificationFormProps {
  certifications: CertificationItem[];
  onChange: (updatedCertifications: CertificationItem[]) => void;
}

interface CertificationItemCardProps {
  item: CertificationItem;
  onUpdate: (updatedItem: CertificationItem) => void;
  onRemove: () => void;
}

/**
 * Individual certification entry editor card component.
 *
 * @param props - Certification item data, update callback, and remove callback.
 * @returns React element.
 */
export const CertificationItemCard: React.FC<CertificationItemCardProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const handleFieldChange = (field: keyof CertificationItem, value: unknown) => {
    onUpdate({ ...item, [field]: value });
  };

  return (
    <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300">
          {item.certificationName || 'New Certification'} {item.issuingOrganization ? `by ${item.issuingOrganization}` : ''}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded transition-colors"
          title="Remove Certification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Certification Name</label>
          <input
            type="text"
            value={item.certificationName}
            placeholder="e.g. AWS Solutions Architect"
            onChange={(e) => handleFieldChange('certificationName', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Issuing Organization</label>
          <input
            type="text"
            value={item.issuingOrganization}
            placeholder="e.g. Amazon Web Services"
            onChange={(e) => handleFieldChange('issuingOrganization', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Year Granted</label>
          <input
            type="text"
            disabled={item.currentStudy}
            value={item.currentStudy ? '' : item.grantedYear}
            placeholder={item.currentStudy ? 'In Progress' : 'e.g. 2023'}
            onChange={(e) => handleFieldChange('grantedYear', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id={`currentStudyCert-${item.id}`}
          checked={item.currentStudy || false}
          onChange={(e) => handleFieldChange('currentStudy', e.target.checked)}
          className="rounded border-slate-800 bg-slate-900 text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor={`currentStudyCert-${item.id}`} className="text-xs text-slate-300 cursor-pointer">
          Currently studying / certification in progress
        </label>
      </div>
    </div>
  );
};

/**
 * Form section component for managing candidate certifications and licenses.
 *
 * @param props - Component props containing certification items array and change handler.
 * @returns React component.
 */
export const CertificationForm: React.FC<CertificationFormProps> = ({
  certifications,
  onChange
}) => {
  const handleAddCertification = () => {
    const newItem: CertificationItem = {
      id: crypto.randomUUID(),
      certificationName: '',
      issuingOrganization: '',
      grantedYear: '',
      currentStudy: false
    };
    onChange([...certifications, newItem]);
  };

  const handleUpdateCertification = (index: number, updatedItem: CertificationItem) => {
    const updated = [...certifications];
    updated[index] = updatedItem;
    onChange(updated);
  };

  const handleRemoveCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Certifications & Licenses
        </h3>
        <button
          type="button"
          onClick={handleAddCertification}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No certifications added yet. Click &quot;Add Certification&quot; to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {certifications.map((item, index) => (
            <CertificationItemCard
              key={item.id || index}
              item={item}
              onUpdate={(updatedItem) => handleUpdateCertification(index, updatedItem)}
              onRemove={() => handleRemoveCertification(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
