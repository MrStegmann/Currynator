import React from 'react';

export interface ViewStudyGuideProps {
  data: any;
}

const ViewStudyGuide: React.FC<ViewStudyGuideProps> = ({ data }) => {
  if (!data) return null;
  const { jobDetails, profileLabel, preguntas_tecnicas, flujos_de_trabajo, kpis, explicacion_tecnologias } = data;

  return (
    <div id="study-guide-print-container" className="bg-white text-black font-sans mx-auto shadow-sm" style={{ minHeight: '297mm', maxWidth: '210mm', padding: '1in' }}>
      
      {/* 1. Encabezado de Contexto */}
      <section className="border-b-4 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Guion de Entrevista: <span className="text-blue-600">{jobDetails?.companyName || 'Entrevista General'}</span>
        </h1>
        <h2 className="text-xl text-gray-700 font-semibold mb-2">
          Puesto / Perfil: {jobDetails?.jobTitle || profileLabel || 'General'}
        </h2>
        {jobDetails?.companyInfo && (
          <p className="text-sm text-gray-600 mt-2">
            <strong>Contexto:</strong> {jobDetails.companyInfo}
          </p>
        )}
      </section>

      {/* 2. Glosario de Tecnologías y Workflows */}
      {flujos_de_trabajo && flujos_de_trabajo.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b border-gray-300 pb-2">Flujos de Trabajo</h2>
          <div className="grid grid-cols-2 gap-4">
            {flujos_de_trabajo.map((flujo: any, idx: number) => (
              <article key={idx} className="bg-gray-50 p-4 border border-gray-200 rounded-md">
                <h3 className="font-bold text-lg mb-2"><mark>{flujo.tecnologia}</mark></h3>
                <p className="text-sm">{flujo.experiencia_candidato}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2.5 Explicación de Tecnologías */}
      {explicacion_tecnologias && explicacion_tecnologias.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b border-gray-300 pb-2">Tecnologías, Stacks y Frameworks</h2>
          <div className="grid grid-cols-1 gap-4">
            {explicacion_tecnologias.map((tec: any, idx: number) => (
              <article key={idx} className="bg-blue-50 p-4 border border-blue-200 rounded-md">
                <h3 className="font-bold text-lg mb-2 text-blue-900">{tec.nombre}</h3>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{tec.explicacion}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Defensa de KPIs */}
      {kpis && kpis.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b border-gray-300 pb-2">Métricas Clave (KPIs) a Defender</h2>
          <ul className="list-disc pl-5 space-y-3">
            {kpis.map((kpi: any, idx: number) => (
              <li key={idx} className="text-base">
                <strong><mark>{kpi.metrica}</mark></strong>: {kpi.como_explicarlo}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. Tarjetas de Estudio (Q&A) */}
      {preguntas_tecnicas && preguntas_tecnicas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b border-gray-300 pb-2">Simulación de Entrevista (Modelo STAR)</h2>
          <div className="flex flex-col gap-6">
            {preguntas_tecnicas.map((qa: any, idx: number) => (
              <article key={idx} className="tarjeta-estudio-star">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Pregunta {idx + 1}: {qa.pregunta}</h3>
                <div className="text-sm text-gray-800 space-y-2">
                  <p><strong>Respuesta STAR Sugerida:</strong></p>
                  <p className="whitespace-pre-wrap">{qa.respuesta_sugerida}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      
    </div>
  );
};

export default ViewStudyGuide;
