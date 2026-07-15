import { Type } from '@google/genai';
import type { Schema } from '@google/genai';

/**
 * Esquema estricto de JSON Schema para la generación de la sección de Experiencia (Work)
 * y Proyectos (Projects) según el estándar JSON Resume y requerimientos ATS.
 */
export const atsResumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    work: {
      type: Type.ARRAY,
      description: "Historial de experiencia laboral. Debe incluir logros utilizando el formato STAR (Situación, Tarea, Acción, Resultado).",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Nombre de la empresa o empleador."
          },
          position: {
            type: Type.STRING,
            description: "Cargo ocupado. Debe ser claro y estándar para sistemas ATS."
          },
          url: {
            type: Type.STRING,
            description: "URL de la empresa."
          },
          startDate: {
            type: Type.STRING,
            description: "Fecha de inicio en formato YYYY-MM-DD o YYYY-MM."
          },
          endDate: {
            type: Type.STRING,
            description: "Fecha de fin en formato YYYY-MM-DD o YYYY-MM. Puede quedar omitido si es el trabajo actual."
          },
          summary: {
            type: Type.STRING,
            description: "Breve resumen de las responsabilidades generales."
          },
          highlights: {
            type: Type.ARRAY,
            description: "Logros específicos aplicando el método STAR: Verbo de acción + Tarea + Herramienta + Resultado métrico.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["name", "position", "startDate", "highlights"]
      }
    },
    projects: {
      type: Type.ARRAY,
      description: "Proyectos relevantes desarrollados, aplicando el método STAR para describir el impacto.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Nombre del proyecto."
          },
          description: {
            type: Type.STRING,
            description: "Descripción breve del proyecto."
          },
          highlights: {
            type: Type.ARRAY,
            description: "Logros técnicos o funcionales específicos aplicando el método STAR.",
            items: {
              type: Type.STRING
            }
          },
          keywords: {
            type: Type.ARRAY,
            description: "Tecnologías, lenguajes o herramientas clave utilizadas (keywords para ATS).",
            items: {
              type: Type.STRING
            }
          },
          startDate: {
            type: Type.STRING,
            description: "Fecha de inicio en formato YYYY-MM-DD o YYYY-MM."
          },
          endDate: {
            type: Type.STRING,
            description: "Fecha de fin en formato YYYY-MM-DD o YYYY-MM."
          },
          url: {
            type: Type.STRING,
            description: "URL del repositorio o proyecto en vivo."
          },
          roles: {
            type: Type.ARRAY,
            description: "Roles desempeñados en el proyecto.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["name", "description", "highlights"]
      }
    }
  },
  required: ["work", "projects"]
};
