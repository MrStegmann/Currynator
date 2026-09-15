import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';

interface JobApplicationFormViewProps {
  initialData?: JobApplication | null;
  onSave: (data: Partial<JobApplication>) => void;
  onBack: () => void;
}

export const JobApplicationFormView: React.FC<JobApplicationFormViewProps> = ({
  initialData,
  onSave,
  onBack,
}) => {
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [jobRequirement, setJobRequirement] = useState('');
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState('');
  const [status, setStatus] = useState<JobApplicationStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setJobDescription(initialData.jobDescription || '');
      setCompanyDescription(initialData.companyDescription || '');
      setJobRequirement(initialData.jobRequirement || '');
      setCompanyWebsiteUrl(initialData.companyWebsiteUrl || '');
      setStatus(initialData.status || 'pending');
    } else {
      setTitle('');
      setJobDescription('');
      setCompanyDescription('');
      setJobRequirement('');
      setCompanyWebsiteUrl('');
      setStatus('pending');
    }
    setErrors({});
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'El título del puesto es obligatorio.';
    if (!jobDescription.trim()) newErrors.jobDescription = 'La descripción del puesto es obligatoria.';
    if (!jobRequirement.trim()) newErrors.jobRequirement = 'Los requisitos del puesto son obligatorios.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialData?.id ? { id: initialData.id } : {}),
        title: title.trim(),
        jobDescription: jobDescription.trim(),
        companyDescription: companyDescription.trim(),
        jobRequirement: jobRequirement.trim(),
        companyWebsiteUrl: companyWebsiteUrl.trim(),
        status,
      });
      onBack();
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = Boolean(initialData?.id);
  const pageTitle = isEditMode ? 'Editar Solicitud de Empleo' : 'Nueva Solicitud de Empleo';

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Top Header with Back Arrow Button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a las solicitudes"
            title="Volver a las solicitudes"
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-headline-small text-on-surface font-semibold m-0 tracking-tight flex items-center gap-2">
              <span>{pageTitle}</span>
              {!isEditMode && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  <Sparkles className="w-3 h-3" />
                  Auto AI CV
                </span>
              )}
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5 mb-0">
              Completa los detalles de la oferta para generar automáticamente tu CV específico.
            </p>
          </div>
        </div>
      </div>

      {/* Full Page Form Workspace */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
        <div>
          <label htmlFor="job-title" className="block text-body-medium font-medium text-on-surface mb-1.5">
            Título del puesto *
          </label>
          <input
            id="job-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Senior Frontend Developer"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium"
          />
          {errors.title && <p className="text-body-sm text-error mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="job-description" className="block text-body-medium font-medium text-on-surface mb-1.5">
            Descripción del puesto *
          </label>
          <textarea
            id="job-description"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Detalles sobre el rol, responsabilidades y alcance del puesto..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium resize-y"
          />
          {errors.jobDescription && <p className="text-body-sm text-error mt-1">{errors.jobDescription}</p>}
        </div>

        <div>
          <label htmlFor="company-description" className="block text-body-medium font-medium text-on-surface mb-1.5">
            Descripción de la empresa (opcional)
          </label>
          <input
            id="company-description"
            type="text"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            placeholder="Información relevante sobre la empresa o industria..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium"
          />
        </div>

        <div>
          <label htmlFor="job-requirement" className="block text-body-medium font-medium text-on-surface mb-1.5">
            Requisitos del puesto *
          </label>
          <textarea
            id="job-requirement"
            rows={4}
            value={jobRequirement}
            onChange={(e) => setJobRequirement(e.target.value)}
            placeholder="Habilidades requeridas, tecnologías clave, años de experiencia..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium resize-y"
          />
          {errors.jobRequirement && <p className="text-body-sm text-error mt-1">{errors.jobRequirement}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company-url" className="block text-body-medium font-medium text-on-surface mb-1.5">
              URL del sitio web (opcional)
            </label>
            <input
              id="company-url"
              type="url"
              value={companyWebsiteUrl}
              onChange={(e) => setCompanyWebsiteUrl(e.target.value)}
              placeholder="https://empresa.com/empleos/123"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium"
            />
          </div>

          <div>
            <label htmlFor="job-status" className="block text-body-medium font-medium text-on-surface mb-1.5">
              Estado de la solicitud
            </label>
            <select
              id="job-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobApplicationStatus)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium"
            >
              <option value="pending">Pendiente (Pending - Default)</option>
              <option value="applied">Solicitado (Applied)</option>
              <option value="called">Llamada (Called)</option>
              <option value="interview">Entrevista (Interview)</option>
              <option value="techTest">Prueba técnica (Tech Test)</option>
              <option value="rejected">Descartado (Rejected)</option>
              <option value="gotTheJob">¡Conseguido! (Got the Job)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-outline text-on-surface font-medium hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Solicitud'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
