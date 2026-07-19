import React, { useState, useEffect } from 'react';
import { BasicInformation } from './components/BasicInformation';
import { WorkExperienceCard } from './components/work/WorkExperienceCard';
import { WorkExperienceFormModal } from './components/work/WorkExperienceFormModal';
import { EducationCard } from './components/education/EducationCard';
import { EducationFormModal } from './components/education/EducationFormModal';
import { CertificationCard } from './components/certification/CertificationCard';
import { CertificationFormModal } from './components/certification/CertificationFormModal';
import type { UserProfile, WorkExperience, Education, Certification } from '../../../../main/services/profile.service';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editWorkId, setEditWorkId] = useState<string | null>(null);

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editEduId, setEditEduId] = useState<string | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editCertId, setEditCertId] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await window.electronAPI.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (e) {
      console.error('Error loading profile', e);
    }
  };

  const saveProfile = async (updatedProfile: UserProfile) => {
    try {
      const res = await window.electronAPI.saveProfile(updatedProfile);
      if (res.success && res.data) {
        setProfile(res.data);
        setNotification('Datos guardados correctamente');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (e) {
      console.error('Error saving profile', e);
    }
  };

  if (!profile) return <div className="text-white p-5">Cargando perfil...</div>;

  // Basic Information Handlers
  const handleSaveBasicInfo = (updatedState: any) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updatedState };
      saveProfile(updatedProfile);
    }
  };

  // Work Experience Handlers
  const handleSaveWork = (work: WorkExperience) => {
    if (!profile) return;
    const isNew = !profile.experience.find(w => w.id === work.id);
    const updatedExp = isNew
      ? [...profile.experience, work]
      : profile.experience.map(w => w.id === work.id ? work : w);

    saveProfile({ ...profile, experience: updatedExp });
    setIsWorkModalOpen(false);
  };
  const handleDeleteWork = (id: string) => {
    if (!profile) return;
    saveProfile({ ...profile, experience: profile.experience.filter(w => w.id !== id) });
  };

  // Education Handlers
  const handleSaveEdu = (edu: Education) => {
    if (!profile) return;
    const isNew = !profile.education.find(e => e.id === edu.id);
    const updatedEdu = isNew
      ? [...profile.education, edu]
      : profile.education.map(e => e.id === edu.id ? edu : e);

    saveProfile({ ...profile, education: updatedEdu });
    setIsEduModalOpen(false);
  };
  const handleDeleteEdu = (id: string) => {
    if (!profile) return;
    saveProfile({ ...profile, education: profile.education.filter(e => e.id !== id) });
  };

  // Certification Handlers
  const handleSaveCert = (cert: Certification) => {
    if (!profile) return;
    const isNew = !profile.certifications.find(c => c.id === cert.id);
    const updatedCert = isNew
      ? [...profile.certifications, cert]
      : profile.certifications.map(c => c.id === cert.id ? cert : c);

    saveProfile({ ...profile, certifications: updatedCert });
    setIsCertModalOpen(false);
  };
  const handleDeleteCert = (id: string) => {
    if (!profile) return;
    saveProfile({ ...profile, certifications: profile.certifications.filter(c => c.id !== id) });
  };

  return (
    <div className="w-full p-5 max-w-5xl mx-auto flex flex-col gap-8">
      {/* SECTION 1: Basic Information */}
      <BasicInformation
        state={profile as any}
        onSave={handleSaveBasicInfo}
      />

      {/* SECTION 2: Work Experience */}
      <div className="w-full">
        <div className="border-b-2 border-white/20 pb-2 mb-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Experiencia Laboral</h2>
          <button
            onClick={() => { setEditWorkId(null); setIsWorkModalOpen(true); }}
            className="flex items-center gap-1 bg-surface-deep hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            <span className="text-lg">+</span> Añadir
          </button>
        </div>
        <div>
          {profile.experience.map(work => (
            <WorkExperienceCard
              key={work.id}
              experience={work}
              onEdit={(id) => { setEditWorkId(id); setIsWorkModalOpen(true); }}
              onDelete={handleDeleteWork}
            />
          ))}
          {profile.experience.length === 0 && <p className="text-gray-400 text-sm">No hay experiencias añadidas.</p>}
        </div>
      </div>

      {/* SECTION 3: Education */}
      <div className="w-full">
        <div className="border-b-2 border-white/20 pb-2 mb-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Educación</h2>
          <button
            onClick={() => { setEditEduId(null); setIsEduModalOpen(true); }}
            className="flex items-center gap-1 bg-surface-deep hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            <span className="text-lg">+</span> Añadir
          </button>
        </div>
        <div>
          {profile.education.map(edu => (
            <EducationCard
              key={edu.id}
              education={edu}
              onEdit={(id) => { setEditEduId(id); setIsEduModalOpen(true); }}
              onDelete={handleDeleteEdu}
            />
          ))}
          {profile.education.length === 0 && <p className="text-gray-400 text-sm">No hay estudios añadidos.</p>}
        </div>
      </div>

      {/* SECTION 4: Certifications */}
      <div className="w-full">
        <div className="border-b-2 border-white/20 pb-2 mb-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Certificados</h2>
          <button
            onClick={() => { setEditCertId(null); setIsCertModalOpen(true); }}
            className="flex items-center gap-1 bg-surface-deep hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            <span className="text-lg">+</span> Añadir
          </button>
        </div>
        <div>
          {profile.certifications.map(cert => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={(id) => { setEditCertId(id); setIsCertModalOpen(true); }}
              onDelete={handleDeleteCert}
            />
          ))}
          {profile.certifications.length === 0 && <p className="text-gray-400 text-sm">No hay certificados añadidos.</p>}
        </div>
      </div>

      {/* Modals */}
      {isWorkModalOpen && (
        <WorkExperienceFormModal
          experience={editWorkId ? profile.experience.find(w => w.id === editWorkId) : undefined}
          onSave={handleSaveWork}
          onCancel={() => setIsWorkModalOpen(false)}
        />
      )}

      {isEduModalOpen && (
        <EducationFormModal
          education={editEduId ? profile.education.find(e => e.id === editEduId) : undefined}
          onSave={handleSaveEdu}
          onCancel={() => setIsEduModalOpen(false)}
        />
      )}

      {isCertModalOpen && (
        <CertificationFormModal
          certification={editCertId ? profile.certifications.find(c => c.id === editCertId) : undefined}
          onSave={handleSaveCert}
          onCancel={() => setIsCertModalOpen(false)}
        />
      )}

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg shadow-green-900/20 z-50 animate-bounce-in flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </div>
  );
};
