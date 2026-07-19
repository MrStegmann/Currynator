import { z } from 'zod';

export const locationSchema = z.object({
  address: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  city: z.string().optional().default(""),
  countryCode: z.string().optional().default(""),
  region: z.string().optional().default(""),
});

export const profileSchema = z.object({
  network: z.string().optional().default(""),
  username: z.string().optional().default(""),
  url: z.string().optional().default(""),
});

export const basicsSchema = z.object({
  name: z.string().min(2, "El nombre completo es obligatorio"),
  label: z.string().optional().default(""),
  image: z.string().optional().default(""),
  email: z.string().email("El correo electrónico no tiene un formato válido").or(z.literal("")).optional(),
  phone: z.string().optional().default(""),
  url: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  location: locationSchema.optional().default({ address: '', postalCode: '', city: '', countryCode: '', region: '' }),
  profiles: z.array(profileSchema).optional().default([]),
});

export const workSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "La empresa es obligatoria"),
  position: z.string().min(2, "El puesto es obligatorio"),
  url: z.string().optional().default(""),
  startDate: z.string(),
  endDate: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  highlights: z.array(z.string()).optional().default([]),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2, "La institución es obligatoria"),
  url: z.string().optional().default(""),
  area: z.string().min(2, "El área de estudio es obligatoria"),
  studyType: z.string().optional().default(""),
  startDate: z.string(),
  endDate: z.string().optional().default(""),
  score: z.string().optional().default(""),
  courses: z.array(z.string()).optional().default([]),
});

export const certificateSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "El nombre del certificado es obligatorio"),
  date: z.string().optional().default(""),
  issuer: z.string().min(2, "El emisor es obligatorio"),
  url: z.string().optional().default(""),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "El nombre del proyecto es obligatorio"),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
  highlights: z.array(z.string()).optional().default([]),
  url: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
  roles: z.array(z.string()).optional().default([]),
});

export const skillSchema = z.object({
  name: z.string().min(2, "El nombre de la habilidad es obligatorio"),
  level: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
});

export const languageSchema = z.object({
  language: z.string().min(2, "El idioma es obligatorio"),
  fluency: z.string().optional().default(""),
});

export const interestSchema = z.object({
  name: z.string().min(2, "El nombre del interés es obligatorio"),
  keywords: z.array(z.string()).optional().default([]),
});

export const referenceSchema = z.object({
  name: z.string().min(2, "El nombre de la referencia es obligatorio"),
  reference: z.string().min(2, "La referencia es obligatoria"),
});

export const jobDetailsSchema = z.object({
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  companyInfo: z.string().optional(),
  companyUrl: z.string().optional(),
  jobFunctions: z.string().optional(),
  jobRequirements: z.string().optional(),
});

export const resumeSchema = z.object({
  id: z.string(),
  profileLabel: z.string().min(1, "El nombre del perfil es obligatorio"),
  lastUpdated: z.string(),
  
  basics: basicsSchema,
  work: z.array(workSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  certificates: z.array(certificateSchema).optional().default([]),
  skills: z.array(skillSchema).optional().default([]),
  languages: z.array(languageSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  interests: z.array(interestSchema).optional().default([]),
  references: z.array(referenceSchema).optional().default([]),
  razonamiento_ia: z.string().optional(),
  jobDetails: jobDetailsSchema.optional(),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export const geminiResponseSchema = resumeSchema.extend({
  razonamiento_ia: z.string().optional().describe("Explicación de los cambios realizados por la IA para adaptar el CV al puesto.")
});

export type GeminiResponseData = z.infer<typeof geminiResponseSchema>;

export const studyGuideSchema = z.object({
  preguntas_tecnicas: z.array(z.object({
    pregunta: z.string(),
    respuesta_sugerida: z.string()
  })),
  flujos_de_trabajo: z.array(z.object({
    tecnologia: z.string(),
    experiencia_candidato: z.string()
  })),
  kpis: z.array(z.object({
    metrica: z.string(),
    como_explicarlo: z.string()
  })),
  explicacion_tecnologias: z.array(z.object({
    nombre: z.string(),
    explicacion: z.string()
  })).optional()
});

export type StudyGuideData = z.infer<typeof studyGuideSchema>;

/**
 * Valida los datos del CV de forma estricta.
 * Retorna la data parseada si es válida, de lo contrario lanza un error con los detalles.
 */
export function validateCVData(data: unknown): ResumeData {
  const result = resumeSchema.safeParse(data);
  if (!result.success) {
    const errorMessages = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Validación fallida:\n${errorMessages.join('\n')}`);
  }
  return result.data;
}

export const githubAnalysisSchema = z.object({
  scoreBreakdown: z.object({
    readme: z.number(),
    projects: z.number(),
    activity: z.number(),
  }),
  topProjectVerdict: z.string(),
  actionableTips: z.array(z.object({
    category: z.enum(['README', 'REPOSITORY', 'METRICS', 'WORK_EXPERIENCE']).or(z.string()),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).or(z.string()),
    tip: z.string(),
    details: z.string(),
  }))
});

export type GithubAnalysisData = z.infer<typeof githubAnalysisSchema>;

