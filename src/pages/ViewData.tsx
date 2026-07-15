import React from 'react';
import type { DataProfile } from '../types/Data';
import { ArrowLeft } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface ViewDataProps {
  data?: DataProfile;
  onBack?: () => void;
}

const sortDesc = (a: string | undefined, b: string | undefined) => {
  if (!a) return 1;
  if (!b) return -1;
  const isPresent = (val: string) => val.toLowerCase() === 'presente' || val.toLowerCase() === 'present' || val.toLowerCase() === 'actualidad';
  if (isPresent(a) && !isPresent(b)) return -1;
  if (!isPresent(a) && isPresent(b)) return 1;
  if (isPresent(a) && isPresent(b)) return 0;

  return new Date(b).getTime() - new Date(a).getTime();
};

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-[12px] font-bold uppercase border-b border-black pb-1 mb-2 tracking-wide font-sans mt-3 text-black">
    {title}
  </h2>
);

const ViewData: React.FC<ViewDataProps> = ({ data, onBack }) => {
  const { addNotification } = useNotification();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#8c909f]">
        <p>No se ha cargado ningún perfil para visualizar.</p>
      </div>
    );
  }

  const linkedinProfile = data.basics?.profiles?.find(p => p.network.toLowerCase() === 'linkedin');

  // Sorting logic
  const workSorted = [...(data.work || [])].sort((a, b) => sortDesc(a.startDate, b.startDate));
  const eduSorted = [...(data.education || [])].sort((a, b) => sortDesc(a.startDate, b.startDate));
  const certSorted = [...(data.certificates || [])].sort((a, b) => sortDesc(a.date, b.date));
  const projSorted = [...(data.projects || [])].sort((a, b) => sortDesc(a.startDate, b.startDate));

  return (
    <div className="w-full flex flex-col pb-20 relative text-black">
      {/* HEADER para la UI de la aplicación (se oculta al imprimir) */}
      <div className="flex justify-between items-center bg-slate-900 p-0.75 rounded-lg border border-[#1E293B] shadow-lg mb-12 text-[#d3e4fe] print:hidden">
        <div className="flex-1 px-4 py-2 flex gap-4 items-center">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold leading-4 tracking-wider uppercase text-[#8c909f] font-sans">Profile Label</span>
            <span className="font-mono text-[#adc6ff] text-[13px]">{data.profileLabel || 'Sin Etiqueta'}</span>
          </div>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-md hover:bg-[#1E293B] text-[#8c909f] hover:text-[#d3e4fe] transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        )}
        <button
          onClick={async () => {
            const container = document.getElementById('cv-print-container');
            if (!container) return;

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
                  
                  @page { margin: 0; size: A4; }
                  html, body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
                addNotification('PDF exportado exitosamente a ' + res.filePath, 'success');
              } else if (!res.canceled) {
                addNotification('Error al exportar: ' + res.error, 'error');
              }
            } catch (err: any) {
              addNotification('Error al exportar: ' + err.message, 'error');
            }
          }}
          className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm"
        >
          Exportar PDF
        </button>
      </div>

      {/* CONTENEDOR DEL CV (Fondo blanco, texto negro, 2 columnas) */}
      <div
        id="cv-print-container"
        className="flex flex-row w-full bg-white text-black font-sans mx-auto shadow-sm"
        style={{ minHeight: '297mm', maxWidth: '210mm' }}
      >

        {/* Columna Izquierda (30%) */}
        <div className="w-[30%] bg-[#f3f4f6] p-1.25 flex flex-col gap-2">
          {data.basics?.image && (
            <div className="w-full flex justify-center mb-2 mt-2">
              <img src={data.basics.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm" />
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <div className="mt-2">
              <SectionHeader title="Habilidades" />
              <div className="flex flex-col gap-3">
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col gap-1 print-avoid-break">
                    <span className="font-bold text-[11px] leading-tight">{skill.name}</span>
                    <ul className="list-disc list-outside ml-3 text-[11px] leading-snug">
                      {skill.keywords?.map((kw, i) => (
                        <li key={i} className="pl-1">{kw}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="mt-2">
              <SectionHeader title="Idiomas" />
              <div className="flex flex-col gap-1">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between print-avoid-break text-[11px] leading-snug">
                    <span className="font-bold">{lang.language}</span>
                    <span>{lang.fluency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha (70%) */}
        <div className="w-[70%] bg-white p-1.25 flex flex-col gap-2 pl-4">

          {/* Sección 1: Cabecera e Info Personal */}
          <div className="flex flex-col gap-1 mb-2 mt-2">
            <h1 className="text-[22px] font-bold uppercase tracking-wide leading-none">{data.basics?.name || '-'}</h1>
            {data.basics?.label && (
              <h2 className="text-[13px] font-medium text-gray-600 leading-none mb-3">{data.basics.label}</h2>
            )}

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] leading-tight">
              {data.basics?.email && (
                <div className="truncate"><span className="font-bold">Email:</span> {data.basics.email}</div>
              )}
              {data.basics?.phone && (
                <div className="truncate"><span className="font-bold">Tel:</span> {data.basics.phone}</div>
              )}
              {data.basics?.location && (
                <div className="truncate"><span className="font-bold">Ubicación:</span> {[data.basics.location.city, data.basics.location.region, data.basics.location.countryCode].filter(Boolean).join(', ')}</div>
              )}
              {linkedinProfile && (
                <div className="truncate"><span className="font-bold">LinkedIn:</span> <a href={linkedinProfile.url}>{linkedinProfile.url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>
              )}
              {data.basics?.url && (
                <div className="truncate"><span className="font-bold">Web:</span> <a href={data.basics.url}>{data.basics.url.replace(/^https?:\/\/(www\.)?/, '')}</a></div>
              )}
            </div>
          </div>

          {/* Sección 2: Resumen Profesional */}
          {data.basics?.summary && (
            <div className="mt-1">
              <SectionHeader title="Resumen Profesional" />
              <p className="text-[11px] whitespace-pre-wrap text-justify leading-snug">{data.basics.summary}</p>
            </div>
          )}

          {/* Sección 3: Experiencia Profesional */}
          {workSorted && workSorted.length > 0 && (
            <div className="mt-1">
              <SectionHeader title="Experiencia Profesional" />
              <div className="flex flex-col gap-3">
                {workSorted.map((exp) => (
                  <div key={exp.id} className="flex flex-col gap-1 print-avoid-break">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[12px] uppercase leading-tight">{exp.position}</span>
                      <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap ml-2">{exp.startDate} - {exp.endDate || 'Presente'}</span>
                    </div>
                    <div className="font-semibold italic text-[11px] text-gray-800 leading-tight">{exp.name}</div>
                    {exp.summary && <p className="text-[11px] leading-snug text-justify">{exp.summary}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-3 mt-1 text-[11px] leading-snug">
                        {exp.highlights.map((ach, i) => (
                          <li key={i} className="pl-1 text-justify">{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección 4: Educación */}
          {eduSorted && eduSorted.length > 0 && (
            <div className="mt-1">
              <SectionHeader title="Estudios Académicos" />
              <div className="flex flex-col gap-2">
                {eduSorted.map((edu) => (
                  <div key={edu.id} className="flex flex-col print-avoid-break">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] leading-tight">{edu.area} {edu.studyType && `(${edu.studyType})`}</span>
                      <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap ml-2">{edu.startDate} - {edu.endDate || 'Presente'}</span>
                    </div>
                    <div className="italic text-[11px] text-gray-800 leading-tight">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección 5: Certificados */}
          {certSorted && certSorted.length > 0 && (
            <div className="mt-1">
              <SectionHeader title="Certificados" />
              <div className="flex flex-col gap-2">
                {certSorted.map((cert) => (
                  <div key={cert.id} className="flex flex-col print-avoid-break">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] leading-tight">{cert.name}</span>
                      <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap ml-2">{cert.date}</span>
                    </div>
                    <div className="italic text-[11px] text-gray-800 leading-tight">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección 6: Proyectos */}
          {projSorted && projSorted.length > 0 && (
            <div className="mt-1">
              <SectionHeader title="Proyectos" />
              <div className="flex flex-col gap-2">
                {projSorted.map((proj) => (
                  <div key={proj.id} className="flex flex-col gap-1 print-avoid-break">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] leading-tight">{proj.name}</span>
                      {proj.startDate && <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap ml-2">{proj.startDate} - {proj.endDate || 'Presente'}</span>}
                    </div>
                    {proj.description && <p className="text-[11px] leading-snug text-justify">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-3 text-[11px] leading-snug">
                        {proj.highlights.map((high, i) => (
                          <li key={i} className="pl-1 text-justify">{high}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewData;
