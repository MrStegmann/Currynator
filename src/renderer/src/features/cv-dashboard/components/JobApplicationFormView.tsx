import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Sparkles, FolderGit2, Check, Tag, Info } from 'lucide-react';
import { JobApplication, JobApplicationStatus } from '../../../../../main/shared/schema/jobApplicationSchema';
import { useProjectsStore } from '../../projects/store/useProjectsStore';
import { extractLanguageKeywords, matchProjectsByKeywords } from '../../projects/utils/projectMatcher';
import { sortChronologicalDescending } from '../../../shared/utils/dateSorting';

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

  // Selected GitHub repository IDs
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const [hasManuallyModifiedSelection, setHasManuallyModifiedSelection] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { repositories, loadInitialState } = useProjectsStore();

  useEffect(() => {
    if (!repositories || repositories.length === 0) {
      loadInitialState();
    }
  }, [repositories, loadInitialState]);

  // Extract detected keywords from requirement and description
  const detectedKeywords = useMemo(() => {
    const combinedText = `${jobRequirement} ${jobDescription}`.trim();
    return extractLanguageKeywords(combinedText);
  }, [jobRequirement, jobDescription]);

  // Match repositories with detected keywords
  const matchedResults = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];
    return matchProjectsByKeywords({ repositories, keywords: detectedKeywords });
  }, [repositories, detectedKeywords]);

  // Auto-preselect matched projects if user has not manually customized the selection
  useEffect(() => {
    if (initialData?.tailored_json_resume?.projects && Array.isArray(initialData.tailored_json_resume.projects)) {
      // If editing an existing application that already has selected projects, match by name or url
      const existingNames = new Set(initialData.tailored_json_resume.projects.map((p: any) => p.name));
      const matchedIds = (repositories || [])
        .filter((r) => existingNames.has(r.name))
        .map((r) => r.id);
      setSelectedRepoIds(matchedIds);
      setHasManuallyModifiedSelection(true);
    } else if (!hasManuallyModifiedSelection) {
      const autoSelectedIds = matchedResults
        .filter((m) => m.isMatched)
        .map((m) => m.repository.id);
      setSelectedRepoIds(autoSelectedIds);
    }
  }, [initialData, matchedResults, repositories, hasManuallyModifiedSelection]);

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
      setHasManuallyModifiedSelection(false);
    }
    setErrors({});
  }, [initialData]);

  const toggleRepoSelection = (repoId: number) => {
    setHasManuallyModifiedSelection(true);
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const handleSelectAllMatched = () => {
    setHasManuallyModifiedSelection(true);
    const matchedIds = matchedResults.filter((m) => m.isMatched).map((m) => m.repository.id);
    setSelectedRepoIds(matchedIds);
  };

  const handleClearAllProjects = () => {
    setHasManuallyModifiedSelection(true);
    setSelectedRepoIds([]);
  };

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
      const selectedProjects = (repositories || [])
        .filter((repo) => selectedRepoIds.includes(repo.id))
        .map((repo) => ({
          name: repo.name,
          description: repo.description || '',
          url: repo.html_url,
          updated_at: repo.updated_at,
        }));

      const existingTailored = initialData?.tailored_json_resume || {};
      const updatedTailored = {
        ...existingTailored,
        projects: sortChronologicalDescending(selectedProjects),
      };

      await onSave({
        ...(initialData?.id ? { id: initialData.id } : {}),
        title: title.trim(),
        jobDescription: jobDescription.trim(),
        companyDescription: companyDescription.trim(),
        jobRequirement: jobRequirement.trim(),
        companyWebsiteUrl: companyWebsiteUrl.trim(),
        status,
        tailored_json_resume: updatedTailored,
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
              Completa los detalles de la oferta para generar automáticamente tu CV específico y preseleccionar proyectos relevantes.
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
            placeholder="Habilidades requeridas, tecnologías clave (ej. React, TypeScript, Python), años de experiencia..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-body-medium resize-y"
          />
          {errors.jobRequirement && <p className="text-body-sm text-error mt-1">{errors.jobRequirement}</p>}
        </div>

        {/* Dynamic Language Keywords & GitHub Projects Preselection */}
        <div className="pt-2 pb-2">
          <div className="rounded-2xl border border-outline-variant/80 bg-surface-container-low/40 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-primary" />
                <h3 className="text-title-medium font-semibold text-on-surface m-0">
                  Proyectos de GitHub Seleccionados
                </h3>
              </div>
              {matchedResults.length > 0 && (
                <div className="flex items-center gap-2 text-label-small">
                  <button
                    type="button"
                    onClick={handleSelectAllMatched}
                    className="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                  >
                    Seleccionar coincidentes
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllProjects}
                    className="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error transition-colors"
                  >
                    Limpiar selección
                  </button>
                </div>
              )}
            </div>

            {/* Detected Keywords Tag List */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-label-medium text-on-surface-variant">
                <Tag className="w-3.5 h-3.5" />
                Tecnologías detectadas:
              </span>
              {detectedKeywords.length > 0 ? (
                detectedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-label-small font-medium border border-primary/20"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-body-sm text-on-surface-variant italic">
                  Escribe requisitos para detectar tecnologías automáticamente
                </span>
              )}
            </div>

            {/* Projects Preselection Cards */}
            {repositories && repositories.length > 0 ? (
              <div className="space-y-2.5 pt-2 max-h-72 overflow-y-auto pr-1">
                {matchedResults.map(({ repository: repo, isMatched, matchedKeywords }) => {
                  const isSelected = selectedRepoIds.includes(repo.id);
                  return (
                    <div
                      key={repo.id}
                      onClick={() => toggleRepoSelection(repo.id)}
                      className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-xs'
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-primary border-primary text-on-primary'
                              : 'border-outline-variant bg-surface'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-on-surface text-body-medium">
                              {repo.name}
                            </span>
                            {repo.language && (
                              <span className="px-2 py-0.2 rounded-md bg-surface-container-high text-on-surface-variant text-label-small font-mono">
                                {repo.language}
                              </span>
                            )}
                            {isMatched && (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.2 rounded-md bg-tertiary-container/40 text-tertiary font-medium">
                                Coincide con {matchedKeywords.join(', ')}
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-1">
                              {repo.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-label-small text-on-surface-variant shrink-0 font-mono">
                        ★ {repo.stargazers_count ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-body-sm text-on-surface-variant">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>
                  No hay repositorios de GitHub cargados. Configura tu Token en la sección de Proyectos para sincronizar tus repositorios.
                </span>
              </div>
            )}
          </div>
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

