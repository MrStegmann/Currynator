import React, { useState, useEffect } from 'react';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { BasicsSchema, Basics } from '../../../../../shared/schema/resumeSchema';

export const BasicsArticle: React.FC = () => {
  const basics = useResumeStore(state => state.data?.basics);
  const updateBasics = useResumeStore(state => state.updateBasics);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Basics>({
    resolver: zodResolver(BasicsSchema),
    defaultValues: basics || {
      name: '',
      label: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
      profiles: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profiles"
  });

  // Reset form when basics change from store (or on load)
  useEffect(() => {
    if (basics) {
      reset(basics);
    }
  }, [basics, reset]);

  const toggleEdit = () => {
    if (isEditing) reset(basics); // Cancel changes
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: Basics) => {
    await updateBasics(data);
    setIsEditing(false);
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden relative">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-sm font-semibold text-on-surface m-0">Basics</h2>
        <button
          onClick={toggleEdit}
          className={`p-1.5 rounded-md transition-colors ${
            isEditing 
              ? 'bg-primary text-on-primary hover:bg-primary/90'
              : 'text-on-surface-variant hover:bg-primary-container hover:text-primary'
          }`}
          aria-label={isEditing ? 'Cancel Edit Basics' : 'Edit Basics'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="p-6 text-body-md text-on-surface-variant">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md mb-1 text-on-surface">Name <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  {...register("name")} 
                  className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`}
                />
                {errors.name && <p className="text-error text-body-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-label-md mb-1 text-on-surface">Label <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  {...register("label")} 
                  className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.label ? 'border-error' : 'border-outline-variant'}`}
                />
                {errors.label && <p className="text-error text-body-sm mt-1">{errors.label.message}</p>}
              </div>

              <div>
                <label className="block text-label-md mb-1 text-on-surface">Email <span className="text-error">*</span></label>
                <input 
                  type="email" 
                  {...register("email")} 
                  className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.email ? 'border-error' : 'border-outline-variant'}`}
                />
                {errors.email && <p className="text-error text-body-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-label-md mb-1 text-on-surface">Phone</label>
                <input 
                  type="text" 
                  {...register("phone")} 
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-label-md mb-1 text-on-surface">URL</label>
                <input 
                  type="url" 
                  {...register("url")} 
                  className={`w-full p-2 bg-surface-container-lowest border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.url ? 'border-error' : 'border-outline-variant'}`}
                />
                {errors.url && <p className="text-error text-body-sm mt-1">{errors.url.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-label-md mb-1 text-on-surface">Summary</label>
                <textarea 
                  {...register("summary")} 
                  rows={4}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y"
                />
              </div>
            </div>

            <div className="border-t border-outline-variant pt-6">
              <h3 className="text-headline-sm text-on-surface mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface">Address</label>
                  <input type="text" {...register("location.address")} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface">City</label>
                  <input type="text" {...register("location.city")} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface">Region</label>
                  <input type="text" {...register("location.region")} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface">Postal Code</label>
                  <input type="text" {...register("location.postalCode")} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface">Country Code</label>
                  <input type="text" {...register("location.countryCode")} className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-headline-sm text-on-surface m-0">Profiles</h3>
                <button 
                  type="button" 
                  onClick={() => append({ network: '', username: '', url: '' })}
                  className="flex items-center gap-1 text-primary hover:text-primary-container text-label-md bg-surface-container px-3 py-1.5 rounded-md"
                >
                  <Plus className="w-4 h-4" /> Add Profile
                </button>
              </div>
              
              <div className="space-y-4">
                {fields.length === 0 && (
                  <p className="text-body-sm text-on-surface-variant italic">No profiles added.</p>
                )}
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-outline-variant rounded-lg bg-surface flex gap-4 items-start relative">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-label-sm mb-1 text-on-surface">Network</label>
                        <input type="text" {...register(`profiles.${index}.network`)} className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. GitHub" />
                      </div>
                      <div>
                        <label className="block text-label-sm mb-1 text-on-surface">Username</label>
                        <input type="text" {...register(`profiles.${index}.username`)} className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-label-sm mb-1 text-on-surface">URL</label>
                        <input type="url" {...register(`profiles.${index}.url`)} className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="text-outline-variant hover:text-error mt-6 p-1 rounded transition-colors"
                      aria-label="Remove Profile"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-8">
              <button 
                type="button" 
                onClick={toggleEdit}
                className="px-4 py-2 border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-lowest transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-container transition-colors font-medium shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Basics'}
              </button>
            </div>
          </form>
        ) : !basics ? (
          <p>No basic information provided.</p>
        ) : (
          <div className="grid gap-4">
            <div>
              <strong className="text-on-surface block mb-1">Name</strong>
              {basics.name || '—'}
            </div>
            <div>
              <strong className="text-on-surface block mb-1">Label</strong>
              {basics.label || '—'}
            </div>
            <div>
              <strong className="text-on-surface block mb-1">Email</strong>
              {basics.email || '—'}
            </div>
            {basics.phone && (
              <div>
                <strong className="text-on-surface block mb-1">Phone</strong>
                {basics.phone}
              </div>
            )}
            {basics.url && (
              <div>
                <strong className="text-on-surface block mb-1">URL</strong>
                <a href={basics.url} className="text-primary hover:underline break-all" target="_blank" rel="noreferrer">
                  {basics.url}
                </a>
              </div>
            )}
            
            {basics.location && (Object.values(basics.location).some(val => !!val)) && (
              <div className="mt-2 border-l-2 border-outline-variant pl-4">
                <strong className="text-on-surface block mb-1 text-label-md">LOCATION</strong>
                <p>
                  {[basics.location.address, basics.location.city, basics.location.region, basics.location.postalCode, basics.location.countryCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}

            {basics.summary && (
              <div className="mt-2">
                <strong className="text-on-surface block mb-1 text-label-md">SUMMARY</strong>
                <p className="whitespace-pre-wrap">{basics.summary}</p>
              </div>
            )}

            {basics.profiles && basics.profiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {basics.profiles.map((profile, i) => (
                  <div key={i} className="flex flex-col bg-surface-container px-4 py-2 rounded-lg border border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant uppercase">{profile.network}</span>
                    {profile.url ? (
                      <a href={profile.url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                        {profile.username}
                      </a>
                    ) : (
                      <span className="font-medium text-on-surface">{profile.username}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
