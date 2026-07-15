import { GoogleGenAI } from '@google/genai';
import { atsResumeSchema } from './schema.js';
import { SYSTEM_PROMPT } from './prompts.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Inicializar el cliente de Gemini. La API Key debe estar en process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OptimizeResumeParams {
  resumeData: any;
  jobDescription?: string;
  userInstructions?: string;
}

/**
 * Optimiza las secciones de un CV (Work y Projects) utilizando Gemini 2.5
 * y aplicando reglas estrictas ATS y el método STAR.
 */
export async function optimizeResumeSection(params: OptimizeResumeParams): Promise<any> {
  const { resumeData, jobDescription, userInstructions } = params;

  // Preparar el prompt del usuario con los datos brutos
  let userPrompt = `A continuación te proporciono los datos brutos del currículum (secciones de Experiencia y Proyectos):\n\n${JSON.stringify(resumeData, null, 2)}`;
  
  if (jobDescription) {
    userPrompt += `\n\nOptimiza estos datos específicamente para la siguiente oferta laboral, asegurando que las palabras clave coincidan si están presentes en mi experiencia:\n${jobDescription}`;
  }

  if (userInstructions) {
    userPrompt += `\n\nInstrucciones adicionales del usuario:\n${userInstructions}`;
  }

  try {
    // Llamada al modelo Gemini con Structured Outputs y JSON Mode
    const response = await ai.models.generateContent({
      // Requerido por SPECS.md para Structured Outputs (usamos gemini-2.5-flash como modelo estándar recomendado)
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: atsResumeSchema,
        temperature: 0.2, // Baja temperatura para reducir alucinaciones y forzar determinismo
      }
    });

    if (!response.text) {
      throw new Error("Gemini no devolvió texto en la respuesta.");
    }

    // El resultado debe ser un JSON string válido basado en el esquema
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error al optimizar el CV con Gemini:", error);
    throw error;
  }
}
