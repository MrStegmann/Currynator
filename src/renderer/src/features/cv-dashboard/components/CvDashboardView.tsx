import React from 'react';
import { useCvDashboardStore } from '../store/useCvDashboardStore';
import { CvDashboardEmptyState } from './CvDashboardEmptyState';
import { CvItemCard } from './CvItemCard';
import { DeleteCvModal } from './DeleteCvModal';

export const CvDashboardView: React.FC = () => {
  const { cvItems, deletingCvId, deleteCv, setDeletingCvId } = useCvDashboardStore();

  const targetCv = cvItems.find((item) => item.id === deletingCvId);

  if (cvItems.length === 0) {
    return <CvDashboardEmptyState onCreateNewCv={() => {}} />;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-headline-medium text-on-surface font-semibold m-0 tracking-tight">
            Mis Currículums
          </h2>
          <p className="text-body-medium text-on-surface-variant mt-1">
            Gestiona tus currículums personalizados por oferta de empleo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[676px]:grid-cols-3 gap-6">
        {cvItems.map((item) => (
          <CvItemCard
            key={item.id}
            cvItem={item}
            onView={(id) => {
              // View component placeholder
            }}
            onEdit={(id) => {
              // Edit component placeholder
            }}
            onDelete={(id) => {
              setDeletingCvId(id);
            }}
          />
        ))}
      </div>

      <DeleteCvModal
        isOpen={Boolean(deletingCvId)}
        targetTitle={targetCv?.targetVacancyTitle}
        onConfirm={() => {
          if (deletingCvId) {
            deleteCv(deletingCvId);
          }
        }}
        onCancel={() => {
          setDeletingCvId(null);
        }}
      />
    </div>
  );
};
