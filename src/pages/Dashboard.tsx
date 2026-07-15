import React, { useEffect, useState } from 'react';
import CardData from '../components/Card/CardData';
import CardCV from '../components/Card/CardCV';
import Modal from '../components/Modal/Modal';
import ViewData from './ViewData';
import StudyCard from '../components/Study/StudyCard';
import EditCVModal from '../components/Modal/EditCVModal';
import type { DataProfile } from '../types/Data';
import { useNotification } from '../contexts/NotificationContext';
import { useDebug } from '../contexts/DebugContext';

interface DashboardProps {
  onEditProfile?: (data: any) => void;
  onViewProfile?: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEditProfile, onViewProfile }) => {
  const { addNotification } = useNotification();
  const { log } = useDebug();
  const [files, setFiles] = useState<string[]>([]);
  const [cvFiles, setCvFiles] = useState<{ filename: string, hasJobDetails: boolean }[]>([]);
  const [studyGuides, setStudyGuides] = useState<string[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ name: string, type: 'data' | 'cv' | 'guide' } | null>(null);

  const [aiReportModalOpen, setAiReportModalOpen] = useState(false);
  const [aiReportContent, setAiReportContent] = useState('');

  const [editCVModalOpen, setEditCVModalOpen] = useState(false);
  const [cvToEdit, setCvToEdit] = useState<DataProfile | null>(null);
  const [cvToEditFilename, setCvToEditFilename] = useState<string | null>(null);

  const [pdfData, setPdfData] = useState<any>(null);

  const loadFiles = async () => {
    try {
      const resData = await (window as any).electronAPI?.listResumeData();
      if (resData?.success) {
        setFiles(resData.files);
      } else {
        log('error', 'Error listando perfiles de datos', resData?.error);
      }
      const resCV = await (window as any).electronAPI?.listGeneratedCVs();
      if (resCV?.success) {
        setCvFiles(resCV.files);
      } else {
        log('error', 'Error listando CVs generados', resCV?.error);
      }
      const resGuides = await (window as any).electronAPI?.listStudyGuides();
      if (resGuides?.success) {
        setStudyGuides(resGuides.files);
      } else {
        log('error', 'Error listando guiones de estudio', resGuides?.error);
      }
    } catch (e: any) {
      log('error', 'Excepción al cargar archivos', e?.message || String(e));
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleEdit = async (filename: string) => {
    const res = await (window as any).electronAPI?.readResumeData(filename);
    if (res?.success && onEditProfile) {
      onEditProfile(res.data);
    }
  };

  const handleEditCV = async (filename: string) => {
    try {
      const res = await (window as any).electronAPI?.readGeneratedCV(filename);
      if (res?.success) {
        setCvToEdit(res.data);
        setCvToEditFilename(filename);
        setEditCVModalOpen(true);
      } else {
        log('error', `Falló readGeneratedCV(${filename})`, res?.error);
        addNotification("Error al cargar el currículum para editar: " + (res?.error || "Desconocido"), "error");
      }
    } catch (e: any) {
      log('error', `Excepción en handleEditCV(${filename})`, e?.message);
    }
  };

  const handleSaveEditedCV = async (editedData: DataProfile) => {
    if (!cvToEditFilename) return;
    const res = await (window as any).electronAPI?.saveResumeData(editedData, { isGenerated: true, customFileName: cvToEditFilename, skipDialog: true });
    if (res?.success) {
      setEditCVModalOpen(false);
      setCvToEdit(null);
      setCvToEditFilename(null);
      // Reload or no-op since filename doesn't change
      loadFiles();
    } else {
      addNotification("Error al guardar el currículum: " + (res?.error || "Desconocido"), "error");
    }
  };

  const handleView = async (filename: string, isCV: boolean) => {
    const apiCall = isCV
      ? (window as any).electronAPI?.readGeneratedCV(filename)
      : (window as any).electronAPI?.readResumeData(filename);

    const res = await apiCall;
    if (res?.success && onViewProfile) {
      onViewProfile(res.data);
    }
  };

  const handleDeleteClick = (filename: string, type: 'data' | 'cv' | 'guide') => {
    setFileToDelete({ name: filename, type });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      let apiCall;
      if (fileToDelete.type === 'cv') {
        apiCall = (window as any).electronAPI?.deleteGeneratedCV(fileToDelete.name);
      } else if (fileToDelete.type === 'guide') {
        apiCall = (window as any).electronAPI?.deleteStudyGuide(fileToDelete.name);
      } else {
        apiCall = (window as any).electronAPI?.deleteResumeData(fileToDelete.name);
      }

      const res = await apiCall;
      if (res?.success) {
        if (fileToDelete.type === 'cv') {
          setCvFiles(prev => prev.filter(f => f.filename !== fileToDelete.name));
        } else if (fileToDelete.type === 'guide') {
          setStudyGuides(prev => prev.filter(f => f !== fileToDelete.name));
        } else {
          setFiles(prev => prev.filter(f => f !== fileToDelete.name));
        }
      }
    }
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const handleAIReport = async (filename: string) => {
    const res = await (window as any).electronAPI?.readAIReasoning(filename);
    if (res?.success && res.data) {
      setAiReportContent(res.data);
      setAiReportModalOpen(true);
    } else {
      addNotification("No se encontró el Informe de IA para este currículum.", "warning");
    }
  };

  const handleRename = async (oldName: string, newName: string, type: 'cv' | 'guide') => {
    if (oldName === newName) return;

    // Add correct extension if missing
    let finalNewName = newName;
    if (type === 'cv' && !finalNewName.endsWith('.json')) finalNewName += '.json';
    if (type === 'guide' && !finalNewName.endsWith('.pdf')) finalNewName += '.pdf';

    const res = await (window as any).electronAPI?.renameFile(oldName, finalNewName, type);
    if (res?.success) {
      if (type === 'cv') {
        setCvFiles(prev => prev.map(f => f.filename === oldName ? { ...f, filename: finalNewName } : f));
      } else if (type === 'guide') {
        setStudyGuides(prev => prev.map(f => f === oldName ? finalNewName : f));
      }
    } else {
      addNotification("Error al renombrar: " + (res?.error || "Desconocido"), "error");
    }
  };

  const handleGeneratePDF = async (filename: string) => {
    const res = await (window as any).electronAPI?.readGeneratedCV(filename);
    if (res?.success) {
      setPdfData(res.data); // This will trigger the hidden render and PDF generation
    }
  };



  useEffect(() => {
    if (pdfData) {
      const timer = setTimeout(async () => {
        const container = document.getElementById('cv-print-container');
        if (container) {
          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
              <style>
                ${Array.from(document.styleSheets)
              .map(sheet => {
                try { return Array.from(sheet.cssRules).map(rule => rule.cssText).join(''); }
                catch (e) { return ''; }
              }).join('\n')}
              </style>
            </head>
            <body>
              ${container.outerHTML}
            </body>
            </html>
          `;
          try {
            const res = await (window as any).electronAPI.exportPDF(html);
            if (res.success) {
              addNotification('PDF exportado exitosamente a ' + res.filePath, "success");
              log('info', 'PDF generado correctamente', res.filePath);
            } else if (!res.canceled) {
              addNotification('Error al exportar: ' + res.error, "error");
              log('error', 'Fallo al exportar PDF de Puppeteer', res.error);
            }
          } catch (err: any) {
            addNotification('Error al exportar: ' + err.message, "error");
            log('error', 'Excepción crítica al exportar PDF', err.message);
          }
        }
        setPdfData(null);
      }, 500); // Dar un poco de tiempo para renderizar

      return () => clearTimeout(timer);
    }
  }, [pdfData]);

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Hidden ViewData for PDF Generation */}
      {pdfData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <ViewData data={pdfData} />
        </div>
      )}


      {/* Sección 1 */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#1E293B] pb-2 text-[#d3e4fe]">Datos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {files.map(file => (
            <CardData
              key={file}
              filename={file}
              onView={() => handleView(file, false)}
              onEdit={() => handleEdit(file)}
              onDelete={() => handleDeleteClick(file, 'data')}
            />
          ))}
          {files.length === 0 && <p className="text-[#8c909f] col-span-full">No hay perfiles de datos guardados.</p>}
        </div>
      </div>

      {/* Sección 2 */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#1E293B] pb-2 text-[#d3e4fe]">Curriculums (Generados)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cvFiles.map(file => (
            <CardCV
              key={file.filename}
              filename={file.filename}
              hasJobDetails={file.hasJobDetails}
              onView={() => handleView(file.filename, true)}
              onAIReport={() => handleAIReport(file.filename)}
              onEdit={() => handleEditCV(file.filename)}
              onGeneratePDF={() => handleGeneratePDF(file.filename)}
              onDelete={() => handleDeleteClick(file.filename, 'cv')}
              onRename={(newName) => handleRename(file.filename, newName, 'cv')}
            />
          ))}
          {cvFiles.length === 0 && <p className="text-[#8c909f] col-span-full">No hay currículums generados.</p>}
        </div>
      </div>

      {/* Sección 3: Guiones de Estudio */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#1E293B] pb-2 text-[#d3e4fe]">Guiones de Estudio (Generados)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studyGuides.map(file => (
            <StudyCard
              key={file}
              filename={file}
              onView={async () => {
                try {
                  const res = await (window as any).electronAPI.openStudyGuide(file);
                  if (!res.success) {
                    addNotification("Error abriendo el PDF: " + res.error, "error");
                    log('error', 'Fallo al abrir el PDF de estudio', res.error);
                  }
                } catch (e: any) {
                  log('error', 'Excepción al intentar abrir PDF', e?.message);
                }
              }}
              onDelete={() => handleDeleteClick(file, 'guide')}
              onRename={(newName) => handleRename(file, newName, 'guide')}
            />
          ))}
          {studyGuides.length === 0 && <p className="text-[#8c909f] col-span-full">No hay guiones de estudio generados.</p>}
        </div>
      </div>

      {/* Modal de Confirmación de Borrado */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Eliminar Archivo">
        <div className="flex flex-col gap-4 text-[#d3e4fe]">
          <p>¿Estás seguro de que deseas eliminar permanentemente el archivo <strong>{fileToDelete?.name}</strong>?</p>
          <p className="text-sm text-red-400">Esta acción no se puede deshacer y borrará los datos del disco duro.</p>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#1E293B]">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-md font-medium text-white border border-[#1E293B] hover:bg-[#1E293B] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Informe de IA */}
      <Modal isOpen={aiReportModalOpen} onClose={() => setAiReportModalOpen(false)} title="Informe de la IA">
        <div className="flex flex-col gap-4 text-[#d3e4fe] max-h-[60vh] overflow-y-auto">
          <p className="whitespace-pre-wrap leading-relaxed text-[14px]">
            {aiReportContent}
          </p>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#1E293B]">
            <button
              onClick={() => setAiReportModalOpen(false)}
              className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Edición de CV */}
      <EditCVModal
        isOpen={editCVModalOpen}
        onClose={() => setEditCVModalOpen(false)}
        cvData={cvToEdit}
        onSave={handleSaveEditedCV}
      />
    </div>
  );
};

export default Dashboard;
