import React, { useEffect, useState } from 'react';
import type { DataProfile } from '../../types/Data';

interface Step1ProfileSelectionProps {
  selectedProfileId: string | null;
  onSelect: (profile: DataProfile) => void;
}

const Step1ProfileSelection: React.FC<Step1ProfileSelectionProps> = ({ selectedProfileId, onSelect }) => {
  const [profiles, setProfiles] = useState<DataProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const response = await (window as any).electronAPI.listResumeData();
        if (response.success && response.files) {
          const loadedProfiles: DataProfile[] = [];
          for (const file of response.files) {
            const readRes = await (window as any).electronAPI.readResumeData(file);
            if (readRes.success) {
              loadedProfiles.push(readRes.data);
            }
          }
          setProfiles(loadedProfiles);
        }
      } catch (error) {
        console.error("Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-[#8c909f]">Cargando perfiles...</div>;
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[#8c909f] mb-4">No tienes perfiles guardados.</p>
        <p className="text-sm">Ve a la sección "Añadir Datos" para crear uno primero.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#d3e4fe]">1. Selecciona tu Perfil Base</h2>
      <p className="text-sm text-[#8c909f]">Elige un perfil base guardado para utilizarlo como punto de partida en la generación del currículum.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => {
          const isSelected = selectedProfileId === profile.id;
          return (
            <div
              key={profile.id}
              onClick={() => onSelect(profile)}
              className={`p-1.25 rounded border cursor-pointer transition-all ${isSelected
                ? 'border-[#3B82F6] border-2 shadow-md shadow-[#3B82F6]/20 bg-slate-900'
                : 'border-[#1E293B] border bg-[#020617] hover:bg-slate-900'
                }`}
            >
              <div className="p-3">
                <h3 className="text-xl font-bold text-[#d3e4fe] mb-1 truncate">{profile.profileLabel || 'Sin nombre'}</h3>
                <p className="text-sm text-[#8c909f] mb-2 truncate">{profile.basics.label || 'Sin puesto definido'}</p>
                <div className="text-xs text-[#424754]">
                  Actualizado: {new Date(profile.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step1ProfileSelection;
