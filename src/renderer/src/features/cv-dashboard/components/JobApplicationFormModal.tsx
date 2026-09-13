import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';

interface JobApplicationFormModalProps {
  isOpen: boolean;
  initialData?: JobApplication | null;
  onSave: (data: Partial<JobApplication>) => void;
  onClose: () => void;
}

export const JobApplicationFormModal: React.FC<JobApplicationFormModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [jobRequirement, setJobRequirement] = useState('');
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState('');
  const [status, setStatus] = useState<JobApplicationStatus>('applied');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setJobDescription(initialData.jobDescription || '');
      setCompanyDescription(initialData.companyDescription || '');
      setJobRequirement(initialData.jobRequirement || '');
      setCompanyWebsiteUrl(initialData.companyWebsiteUrl || '');
      setStatus(initialData.status || 'applied');
    } else {
      setTitle('');
      setJobDescription('');
      setCompanyDescription('');
      setJobRequirement('');
      setCompanyWebsiteUrl('');
      setStatus('applied');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'El título del puesto es obligatorio.';
    if (!jobDescription.trim()) newErrors.jobDescription = 'La descripción del puesto es obligatoria.';
    if (!jobRequirement.trim()) newErrors.jobRequirement = 'Los requisitos del puesto son obligatorios.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      jobDescription: jobDescription.trim(),
      companyDescription: companyDescription.trim(),
      jobRequirement: jobRequirement.trim(),
      companyWebsiteUrl: companyWebsiteUrl.trim(),
      status,
    });
  };

  const isEditMode = Boolean(initialData?.id);
  const modalTitle = isEditMode ? 'Editar Solicitud de Empleo' : 'Nueva Solicitud de Empleo';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="job-title" className="block text-body-medium font-medium text-on-surface mb-1">
            Título del puesto *
          </label>
          <input
            id="job-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Senior Frontend Developer"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />
          {errors.title && <p className="text-body-sm text-error mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="job-description" className="block text-body-medium font-medium text-on-surface mb-1">
            Descripción del puesto *
          </label>
          <textarea
            id="job-description"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Detalles sobre el rol y responsabilidades..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary resize-y"
          />
          {errors.jobDescription && <p className="text-body-sm text-error mt-1">{errors.jobDescription}</p>}
        </div>

        <div>
          <label htmlFor="company-description" className="block text-body-medium font-medium text-on-surface mb-1">
            Descripción de la empresa (opcional)
          </label>
          <input
            id="company-description"
            type="text"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            placeholder="Información sobre la empresa..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="job-requirement" className="block text-body-medium font-medium text-on-surface mb-1">
            Requisitos del puesto *
          </label>
          <textarea
            id="job-requirement"
            rows={3}
            value={jobRequirement}
            onChange={(e) => setJobRequirement(e.target.value)}
            placeholder="Habilidades requeridas, experiencia necesaria..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary resize-y"
          />
          {errors.jobRequirement && <p className="text-body-sm text-error mt-1">{errors.jobRequirement}</p>}
        </div>

        <div>
          <label htmlFor="company-url" className="block text-body-medium font-medium text-on-surface mb-1">
            URL del sitio web de la empresa (opcional)
          </label>
          <input
            id="company-url"
            type="url"
            value={companyWebsiteUrl}
            onChange={(e) => setCompanyWebsiteUrl(e.target.value)}
            placeholder="https://empresa.com/empleos/123"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="job-status" className="block text-body-medium font-medium text-on-surface mb-1">
            Estado de la solicitud
          </label>
          <select
            id="job-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobApplicationStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="applied">Solicitado (Applied)</option>
            <option value="called">Llamada (Called)</option>
            <option value="interview">Entrevista (Interview)</option>
            <option value="techTest">Prueba técnica (Tech Test)</option>
            <option value="rejected">Descartado (Rejected)</option>
            <option value="gotTheJob">¡Conseguido! (Got the Job)</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-outline text-on-surface font-medium hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};
