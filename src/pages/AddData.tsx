import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import ExperienceCard from '../components/Experience/ExperienceCard';
import AcademicCard from '../components/Academic/AcademicCard';
import ProjectCard from '../components/Project/ProjectCard';
import CertificationCard from '../components/Certification/CertificationCard';
import { resumeSchema } from '../main/utils/validation';
import TagInput from '../components/TagInput';
import Modal from '../components/Modal/Modal';
import ExperienceForm from '../components/Experience/ExperienceForm';
import AcademicForm from '../components/Academic/AcademicForm';
import ProjectForm from '../components/Project/ProjectForm';
import CertificationForm from '../components/Certification/CertificationForm';
import { useDebug } from '../contexts/DebugContext';
import type { DataProfile, Language, Skill, Profile, Interest, Reference } from '../types/Data';

const initialResumeState: DataProfile = {
  id: Date.now().toString(),
  profileLabel: '',
  lastUpdated: new Date().toISOString(),
  basics: {
    name: '',
    label: '',
    image: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: ''
    },
    profiles: []
  },
  skills: [],
  languages: [],
  work: [],
  education: [],
  certificates: [],
  projects: [],
  interests: [],
  references: []
};

type ModalType = 'work' | 'education' | 'certification' | 'project' | null;

export interface AddDataProps {
  initialData?: any;
}

const AddData: React.FC<AddDataProps> = ({ initialData }) => {
  const [data, setData] = useState<DataProfile>(initialData || initialResumeState);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData(initialResumeState);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { log } = useDebug();

  const handleStringChange = (field: keyof DataProfile, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    clearError(field as string);
  };

  const handleBasicsChange = (field: keyof DataProfile['basics'], value: any) => {
    setData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value
      }
    }));
    clearError(`basics.${field}`);
  };

  const handleLocationChange = (field: keyof DataProfile['basics']['location'], value: any) => {
    setData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        location: {
          ...prev.basics.location,
          [field]: value
        }
      }
    }));
    clearError(`basics.location.${field}`);
  };

  const handleProfileChange = (index: number, field: keyof Profile, value: string) => {
    setData(prev => {
      const newProfiles = [...prev.basics.profiles];
      newProfiles[index] = { ...newProfiles[index], [field]: value };
      return {
        ...prev,
        basics: { ...prev.basics, profiles: newProfiles }
      };
    });
  };

  const handleAddProfile = () => {
    setData(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        profiles: [...prev.basics.profiles, { network: '', username: '', url: '' }]
      }
    }));
  };

  const handleRemoveProfile = (index: number) => {
    setData(prev => {
      const newProfiles = [...prev.basics.profiles];
      newProfiles.splice(index, 1);
      return {
        ...prev,
        basics: { ...prev.basics, profiles: newProfiles }
      };
    });
  };

  const handleAddLanguage = () => {
    setData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', fluency: '' }]
    }));
  };

  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    setData(prev => {
      const newLangs = [...prev.languages];
      newLangs[index] = { ...newLangs[index], [field]: value };
      return { ...prev, languages: newLangs };
    });
  };

  const handleRemoveLanguage = (index: number) => {
    setData(prev => {
      const newLangs = [...prev.languages];
      newLangs.splice(index, 1);
      return { ...prev, languages: newLangs };
    });
  };

  const handleAddSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: '', keywords: [] }]
    }));
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    setData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, skills: newSkills };
    });
  };

  const handleRemoveSkill = (index: number) => {
    setData(prev => {
      const newSkills = [...prev.skills];
      newSkills.splice(index, 1);
      return { ...prev, skills: newSkills };
    });
  };

  const handleAddInterest = () => {
    setData(prev => ({
      ...prev,
      interests: [...prev.interests, { name: '', keywords: [] }]
    }));
  };

  const handleInterestChange = (index: number, field: keyof Interest, value: any) => {
    setData(prev => {
      const newInterests = [...prev.interests];
      newInterests[index] = { ...newInterests[index], [field]: value };
      return { ...prev, interests: newInterests };
    });
  };

  const handleRemoveInterest = (index: number) => {
    setData(prev => {
      const newInterests = [...prev.interests];
      newInterests.splice(index, 1);
      return { ...prev, interests: newInterests };
    });
  };

  const handleAddReference = () => {
    setData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', reference: '' }]
    }));
  };

  const handleReferenceChange = (index: number, field: keyof Reference, value: string) => {
    setData(prev => {
      const newReferences = [...prev.references];
      newReferences[index] = { ...newReferences[index], [field]: value };
      return { ...prev, references: newReferences };
    });
  };

  const handleRemoveReference = (index: number) => {
    setData(prev => {
      const newReferences = [...prev.references];
      newReferences.splice(index, 1);
      return { ...prev, references: newReferences };
    });
  };

  const clearError = (path: string) => {
    if (errors[path]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[path];
        return newErrs;
      });
    }
  };

  const handleSave = async () => {
    if (!data.profileLabel.trim()) {
      setSaveStatus({ type: 'error', msg: 'El Profile Label es obligatorio para poder guardar.' });
      setErrors(prev => ({ ...prev, profileLabel: 'Obligatorio' }));
      return;
    }

    const formData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };

    const result = resumeSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      setSaveStatus({ type: 'error', msg: 'Hay errores en el formulario. Por favor, revísalos.' });
      log('warn', 'Errores de validación de esquema', JSON.stringify(newErrors));
      return;
    }

    setErrors({});
    setSaveStatus({ type: 'idle', msg: 'Guardando...' });

    try {
      const response = await (window as any).electronAPI?.saveResumeData(result.data);
      if (response?.success) {
        setSaveStatus({ type: 'success', msg: '¡Archivo JSON guardado con éxito!' });
      } else if (response?.canceled) {
        setSaveStatus({ type: 'idle', msg: '' });
      } else {
        setSaveStatus({ type: 'error', msg: response?.error || 'Error al guardar el archivo.' });
        log('error', 'Fallo al guardar ResumeData en Electron', response?.error);
      }
    } catch (e: any) {
      setSaveStatus({ type: 'error', msg: e.message || 'Error de comunicación con Electron.' });
      log('error', 'Excepción crítica al comunicarse con Electron', e?.message);
    }
  };

  const InputError = ({ path }: { path: string }) => {
    if (!errors[path]) return null;
    return <span className="text-red-400 text-xs mt-1 block">{errors[path]}</span>;
  };

  return (
    <div className="w-full flex flex-col pb-20 relative text-[#d3e4fe]">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900 p-0.75 rounded-lg border border-[#1E293B] top-0 z-10 shadow-lg mb-12">
        <div className="flex-1 px-4 py-2 flex gap-4 items-center">
          <label className="block text-sm font-medium text-[#8c909f] whitespace-nowrap">Profile Label *</label>
          <div className="flex-1 max-w-sm">
            <input
              required
              value={data.profileLabel}
              onChange={(e) => handleStringChange('profileLabel', e.target.value)}
              type="text"
              className={`w-full bg-[#020617] border ${errors['profileLabel'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
              placeholder="Ej. Desarrollador Frontend Senior"
            />
            <InputError path="profileLabel" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* SECCIÓN 1: Basics (Información Personal) */}
        <section className="w-full flex flex-col gap-6">
          <h2 className="text-2xl font-semibold border-b border-[#1E293B] pb-2">Información Personal (Basics)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre Completo *</label>
                <input
                  value={data.basics.name}
                  onChange={(e) => handleBasicsChange('name', e.target.value)}
                  type="text"
                  className={`w-full bg-slate-900 border ${errors['basics.name'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Ej. Juan Pérez García"
                />
                <InputError path="basics.name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Puesto (Label)</label>
                <input
                  value={data.basics.label}
                  onChange={(e) => handleBasicsChange('label', e.target.value)}
                  type="text"
                  className={`w-full bg-slate-900 border ${errors['basics.label'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Ej. Software Engineer"
                />
                <InputError path="basics.label" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">URL (Website principal)</label>
                <input
                  value={data.basics.url}
                  onChange={(e) => handleBasicsChange('url', e.target.value)}
                  type="url"
                  className={`w-full bg-slate-900 border ${errors['basics.url'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="https://..."
                />
                <InputError path="basics.url" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Dirección (Address)</label>
                <input
                  value={data.basics.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  type="text"
                  className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej. Calle Principal 123"
                />
                <InputError path="basics.location.address" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#8c909f] mb-1">Código Postal</label>
                  <input
                    value={data.basics.location.postalCode}
                    onChange={(e) => handleLocationChange('postalCode', e.target.value)}
                    type="text"
                    className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ej. 28001"
                  />
                  <InputError path="basics.location.postalCode" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#8c909f] mb-1">Código de País</label>
                  <input
                    value={data.basics.location.countryCode}
                    onChange={(e) => handleLocationChange('countryCode', e.target.value)}
                    type="text"
                    className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ej. ES"
                  />
                  <InputError path="basics.location.countryCode" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Ciudad (Location)</label>
                <input
                  value={data.basics.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  type="text"
                  className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej. Madrid"
                />
                <InputError path="basics.location.city" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">País o Región</label>
                <input
                  value={data.basics.location.region}
                  onChange={(e) => handleLocationChange('region', e.target.value)}
                  type="text"
                  className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej. España"
                />
                <InputError path="basics.location.region" />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Teléfono</label>
                <input
                  value={data.basics.phone}
                  onChange={(e) => handleBasicsChange('phone', e.target.value)}
                  type="text"
                  className="w-full bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+34 600 000 000"
                />
                <InputError path="basics.phone" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8c909f] mb-1">Email *</label>
                <input
                  value={data.basics.email}
                  onChange={(e) => handleBasicsChange('email', e.target.value)}
                  type="email"
                  className={`w-full bg-slate-900 border ${errors['basics.email'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="correo@ejemplo.com"
                />
                <InputError path="basics.email" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-[#8c909f]">Perfiles (Social / Redes)</label>
                  <button
                    onClick={handleAddProfile}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {data.basics.profiles.map((profile, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={profile.network}
                          onChange={(e) => handleProfileChange(idx, 'network', e.target.value)}
                          className="w-1/3 bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Ej. LinkedIn"
                        />
                        <input
                          type="url"
                          value={profile.url}
                          onChange={(e) => handleProfileChange(idx, 'url', e.target.value)}
                          className="flex-1 bg-slate-900 border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="URL del perfil"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProfile(idx)}
                      className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Resumen Profesional */}
        <section className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-semibold border-b border-[#1E293B] pb-2">Resumen Profesional (Summary)</h2>
          <div className="w-full">
            <textarea
              value={data.basics.summary}
              onChange={(e) => handleBasicsChange('summary', e.target.value)}
              rows={5}
              className={`w-full bg-slate-900 border ${errors['basics.summary'] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors resize-y`}
              placeholder="Escribe tu perfil profesional o 'Sobre mí'..."
            />
            <InputError path="basics.summary" />
          </div>
        </section>

        {/* SECCIÓN 3: Habilidades */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Habilidades (Skills)</h2>
            <button
              onClick={handleAddSkill}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir Categoría de Skill
            </button>
          </div>
          <p className="text-sm text-[#8c909f] italic bg-slate-900 p-3 rounded-md border border-[#1E293B]">
            Agrupa tus habilidades por categorías (ej. "Frontend", "Backend", "Habilidades Blandas"). Presiona <span className="text-[#d3e4fe] font-semibold">coma ( , )</span> para añadir una palabra clave.
          </p>
          <div className="flex flex-col gap-6">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-slate-900 p-4 rounded-md border border-[#1E293B]">
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre (Categoría) *</label>
                      <input
                        value={skill.name}
                        onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                        type="text"
                        className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Ej. Web Development"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#8c909f] mb-1">Nivel (Opcional)</label>
                      <input
                        value={skill.level}
                        onChange={(e) => handleSkillChange(idx, 'level', e.target.value)}
                        type="text"
                        className="w-full bg-[#020617] border border-[#1E293B] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Ej. Master, Experto..."
                      />
                    </div>
                  </div>
                  <TagInput
                    label="Palabras clave (Keywords)"
                    tags={skill.keywords}
                    onChange={(tags) => handleSkillChange(idx, 'keywords', tags)}
                    placeholder="Ej. React, HTML, CSS..."
                  />
                </div>
                <button
                  onClick={() => handleRemoveSkill(idx)}
                  className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors self-start mt-6"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 4: Idiomas */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Idiomas</h2>
            <button
              onClick={handleAddLanguage}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir Idioma
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.languages.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">No hay idiomas añadidos.</p>
            ) : (
              data.languages.map((lang, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      value={lang.language}
                      onChange={(e) => handleLanguageChange(idx, 'language', e.target.value)}
                      type="text"
                      className={`w-full bg-slate-900 border ${errors[`languages.${idx}.language`] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Ej. Inglés"
                    />
                    <InputError path={`languages.${idx}.language`} />
                  </div>
                  <div className="flex-1">
                    <input
                      value={lang.fluency}
                      onChange={(e) => handleLanguageChange(idx, 'fluency', e.target.value)}
                      type="text"
                      className={`w-full bg-slate-900 border ${errors[`languages.${idx}.fluency`] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Ej. Nativo / C1"
                    />
                    <InputError path={`languages.${idx}.fluency`} />
                  </div>
                  <button
                    onClick={() => handleRemoveLanguage(idx)}
                    className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors self-start mt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            <InputError path="languages" />
          </div>
        </section>

        {/* SECCIÓN 5: Experiencia */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Experiencia Laboral</h2>
            <button
              onClick={() => { setEditingItem(null); setModalType('work'); }}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.work.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.work.map((w) => (
                <ExperienceCard
                  key={w.id}
                  {...w}
                  onEdit={() => { setEditingItem(w); setModalType('work'); }}
                  onDelete={() => setData(prev => ({ ...prev, work: prev.work.filter(e => e.id !== w.id) }))}
                />
              ))
            )}
            <InputError path="work" />
          </div>
        </section>

        {/* SECCIÓN 6: Educación */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Educación (Títulos Académicos)</h2>
            <button
              onClick={() => { setEditingItem(null); setModalType('education'); }}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.education.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.education.map((aca) => (
                <AcademicCard
                  key={aca.id}
                  {...aca}
                  onEdit={() => { setEditingItem(aca); setModalType('education'); }}
                  onDelete={() => setData(prev => ({ ...prev, education: prev.education.filter(a => a.id !== aca.id) }))}
                />
              ))
            )}
            <InputError path="education" />
          </div>
        </section>

        {/* SECCIÓN 7: Certificaciones */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Certificaciones</h2>
            <button
              onClick={() => { setEditingItem(null); setModalType('certification'); }}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.certificates.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.certificates.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  {...cert}
                  onEdit={() => { setEditingItem(cert); setModalType('certification'); }}
                  onDelete={() => setData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c.id !== cert.id) }))}
                />
              ))
            )}
            <InputError path="certificates" />
          </div>
        </section>

        {/* SECCIÓN 8: Proyectos */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Proyectos Personales</h2>
            <button
              onClick={() => { setEditingItem(null); setModalType('project'); }}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data.projects.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.projects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  {...proj}
                  onEdit={() => { setEditingItem(proj); setModalType('project'); }}
                  onDelete={() => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }))}
                />
              ))
            )}
            <InputError path="projects" />
          </div>
        </section>

        {/* SECCIÓN 9: Intereses */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Intereses</h2>
            <button
              onClick={handleAddInterest}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir Interés
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {data.interests.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.interests.map((interest, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-slate-900 p-4 rounded-md border border-[#1E293B]">
                  <div className="flex flex-col gap-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre (Interés) *</label>
                      <input
                        value={interest.name}
                        onChange={(e) => handleInterestChange(idx, 'name', e.target.value)}
                        type="text"
                        className={`w-full bg-[#020617] border ${errors[`interests.${idx}.name`] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Ej. Lectura"
                      />
                      <InputError path={`interests.${idx}.name`} />
                    </div>
                    <TagInput
                      label="Palabras clave (Keywords)"
                      tags={interest.keywords}
                      onChange={(tags) => handleInterestChange(idx, 'keywords', tags)}
                      placeholder="Ej. Ficción, Historia..."
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveInterest(idx)}
                    className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors self-start mt-6"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
            <InputError path="interests" />
          </div>
        </section>

        {/* SECCIÓN 10: Referencias */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h2 className="text-2xl font-semibold">Referencias</h2>
            <button
              onClick={handleAddReference}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Añadir Referencia
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {data.references.length === 0 ? (
              <p className="text-sm text-[#8c909f] italic">Aún no se ha añadido nada</p>
            ) : (
              data.references.map((ref, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-slate-900 p-4 rounded-md border border-[#1E293B]">
                  <div className="flex flex-col gap-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-[#8c909f] mb-1">Nombre (Referencia) *</label>
                      <input
                        value={ref.name}
                        onChange={(e) => handleReferenceChange(idx, 'name', e.target.value)}
                        type="text"
                        className={`w-full bg-[#020617] border ${errors[`references.${idx}.name`] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Ej. Jane Doe"
                      />
                      <InputError path={`references.${idx}.name`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8c909f] mb-1">Referencia (Texto) *</label>
                      <textarea
                        value={ref.reference}
                        onChange={(e) => handleReferenceChange(idx, 'reference', e.target.value)}
                        rows={3}
                        className={`w-full bg-[#020617] border ${errors[`references.${idx}.reference`] ? 'border-red-500' : 'border-[#1E293B]'} rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors resize-y`}
                        placeholder="Ej. Excelente profesional..."
                      />
                      <InputError path={`references.${idx}.reference`} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveReference(idx)}
                    className="p-2 text-red-400 hover:bg-[#1E293B] rounded-md transition-colors self-start mt-6"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
            <InputError path="references" />
          </div>
        </section>

        {/* FOOTER */}
        <div className="flex justify-end pt-4 pb-10">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md"
          >
            <Save size={20} /> Guardar Datos
          </button>
        </div>
      </div>

      {/* MODALES */}
      <Modal
        isOpen={modalType === 'work'}
        onClose={() => { setModalType(null); setEditingItem(null); }}
        title={editingItem ? "Editar Experiencia" : "Añadir Experiencia"}
      >
        <ExperienceForm
          initialData={editingItem}
          onCancel={() => { setModalType(null); setEditingItem(null); }}
          onAdd={(newExp) => {
            setData(prev => ({
              ...prev,
              work: editingItem
                ? prev.work.map(e => e.id === newExp.id ? newExp : e)
                : [...prev.work, newExp]
            }));
            setModalType(null);
            setEditingItem(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'education'}
        onClose={() => { setModalType(null); setEditingItem(null); }}
        title={editingItem ? "Editar Título Académico" : "Añadir Título Académico"}
      >
        <AcademicForm
          initialData={editingItem}
          onCancel={() => { setModalType(null); setEditingItem(null); }}
          onAdd={(newAca) => {
            setData(prev => ({
              ...prev,
              education: editingItem
                ? prev.education.map(a => a.id === newAca.id ? newAca : a)
                : [...prev.education, newAca]
            }));
            setModalType(null);
            setEditingItem(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'certification'}
        onClose={() => { setModalType(null); setEditingItem(null); }}
        title={editingItem ? "Editar Certificación" : "Añadir Certificación"}
      >
        <CertificationForm
          initialData={editingItem}
          onCancel={() => { setModalType(null); setEditingItem(null); }}
          onAdd={(newCert) => {
            setData(prev => ({
              ...prev,
              certificates: editingItem
                ? prev.certificates.map(c => c.id === newCert.id ? newCert : c)
                : [...prev.certificates, newCert]
            }));
            setModalType(null);
            setEditingItem(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'project'}
        onClose={() => { setModalType(null); setEditingItem(null); }}
        title={editingItem ? "Editar Proyecto" : "Añadir Proyecto"}
      >
        <ProjectForm
          initialData={editingItem}
          onCancel={() => { setModalType(null); setEditingItem(null); }}
          onAdd={(newProj) => {
            setData(prev => ({
              ...prev,
              projects: editingItem
                ? prev.projects.map(p => p.id === newProj.id ? newProj : p)
                : [...prev.projects, newProj]
            }));
            setModalType(null);
            setEditingItem(null);
          }}
        />
      </Modal>

    </div>
  );
};

export default AddData;
