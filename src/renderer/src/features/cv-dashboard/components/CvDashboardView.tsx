import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCvDashboardStore } from '../store/useCvDashboardStore';
import { CvDashboardEmptyState } from './CvDashboardEmptyState';
import { CvItemCard } from './CvItemCard';
import { DeleteCvModal } from './DeleteCvModal';
import { JobApplicationFormModal } from './JobApplicationFormModal';

export const CvDashboardView: React.FC = () => {
  const {
    cvItems,
    jobApplications,
    deletingCvId,
    deleteCv,
    deleteJobApplication,
    setDeletingCvId,
    isFormModalOpen,
    editingJobApp,
    setFormModalOpen,
    saveJobApplication,
    updateJobApplicationStatus,
    loadJobApplications,
  } = useCvDashboardStore();

  useEffect(() => {
    loadJobApplications();
  }, [loadJobApplications]);

  const targetCv = cvItems.find((item) => item.id === deletingCvId);
  const targetJobApp = jobApplications.find((item) => item.id === deletingCvId);
  const targetTitle = targetCv?.targetVacancyTitle || targetJobApp?.title;

  const totalItems = cvItems.length + jobApplications.length;

  return (
    <div className="relative max-w-7xl mx-auto pb-12">
      {/* Top-right Floating Action Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-headline-medium text-on-surface font-semibold m-0 tracking-tight">
            Mis Currículums y Solicitudes
          </h2>
          <p className="text-body-medium text-on-surface-variant mt-1">
            Gestiona tus currículums y solicitudes de empleo personalizadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormModalOpen(true, null)}
          aria-label="Nueva Solicitud de Empleo"
          title="Nueva Solicitud de Empleo"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-medium rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Solicitud</span>
        </button>
      </div>

      {totalItems === 0 ? (
        <CvDashboardEmptyState onCreateNewCv={() => setFormModalOpen(true, null)} />
      ) : (
        <div className="grid grid-cols-1 min-[676px]:grid-cols-3 gap-6">
          {/* Render Job Applications */}
          {jobApplications.map((jobApp) => (
            <CvItemCard
              key={jobApp.id}
              cvItem={jobApp}
              onView={(id) => {
                const item = jobApplications.find((app) => app.id === id);
                if (item) setFormModalOpen(true, item);
              }}
              onEdit={(id) => {
                const item = jobApplications.find((app) => app.id === id);
                if (item) setFormModalOpen(true, item);
              }}
              onDelete={(id) => {
                setDeletingCvId(id);
              }}
              onStatusChange={(id, newStatus) => {
                updateJobApplicationStatus(id, newStatus);
              }}
            />
          ))}

          {/* Render Legacy CV Items */}
          {cvItems.map((item) => (
            <CvItemCard
              key={item.id}
              cvItem={item}
              onView={(id) => {
                // View placeholder
              }}
              onEdit={(id) => {
                // Edit placeholder
              }}
              onDelete={(id) => {
                setDeletingCvId(id);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCvModal
        isOpen={Boolean(deletingCvId)}
        targetTitle={targetTitle}
        onConfirm={() => {
          if (deletingCvId) {
            if (targetJobApp) {
              deleteJobApplication(deletingCvId);
            } else {
              deleteCv(deletingCvId);
            }
          }
        }}
        onCancel={() => {
          setDeletingCvId(null);
        }}
      />

      {/* Job Application Create/Edit Modal */}
      {isFormModalOpen && (
        <JobApplicationFormModal
          isOpen={isFormModalOpen}
          initialData={editingJobApp}
          onSave={(data) => {
            saveJobApplication(data);
          }}
          onClose={() => {
            setFormModalOpen(false, null);
          }}
        />
      )}
    </div>
  );
};
