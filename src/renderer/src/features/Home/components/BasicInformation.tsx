import React, { useState, useEffect } from 'react';
import { updateProfileData } from '../services/BasicInformation.service';

interface BasicInformationProps {
  initialProfile: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onProfileUpdated: (profile: any) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({ initialProfile, onProfileUpdated }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if current profile differs from initial
    const dirty = 
      profile.firstName !== initialProfile.firstName ||
      profile.lastName !== initialProfile.lastName ||
      profile.email !== initialProfile.email;
    setIsDirty(dirty);
  }, [profile, initialProfile]);

  const handleCancel = () => {
    setProfile(initialProfile);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfileData(profile);
    if (success) {
      onProfileUpdated(profile);
    } else {
      // In a real app, handle error via NotificationContext
      alert('Error saving profile data.');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <h2 className="text-headline-sm font-bold text-on-surface">Basic Information</h2>
      <p className="text-body-sm text-on-surface-variant">Update your core identity details.</p>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">First Name</label>
          <input 
            type="text" 
            className="bg-transparent border-0 border-b border-border-subtle focus:border-primary focus:ring-0 px-0 py-2 text-on-surface transition-colors"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Last Name</label>
          <input 
            type="text" 
            className="bg-transparent border-0 border-b border-border-subtle focus:border-primary focus:ring-0 px-0 py-2 text-on-surface transition-colors"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Email</label>
          <input 
            type="email" 
            className="bg-transparent border-0 border-b border-border-subtle focus:border-primary focus:ring-0 px-0 py-2 text-on-surface transition-colors"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
      </div>

      {isDirty && (
        <div className="flex justify-end gap-3 mt-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};
