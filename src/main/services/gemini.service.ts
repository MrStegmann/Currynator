import { GoogleGenAI } from '@google/genai';
import { geminiResponseSchema } from '../utils/validation.js';
import { jsonrepair } from 'jsonrepair';

import { readSettings } from '../utils/settings.js';

export async function generateCVFromGemini(
  profileData: any,
  generationType: 'general' | 'specific',
  jobDetails: any,
  aiInstructions: string
) {
  const model = 'gemini-2.5-flash';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key de Gemini no configurada en el archivo .env.");
  }
  const ai = new GoogleGenAI({ apiKey });

  let prompt = `Eres un experto consultor de carrera y optimizador de ATS (Applicant Tracking Systems).\n\n`;
  prompt += `A continuación tienes el perfil completo de un candidato en formato JSON:\n${JSON.stringify(profileData, null, 2)}\n\n`;

  if (generationType === 'specific') {
    prompt += `El objetivo es adaptar y reescribir este currículum para que sea el candidato perfecto para la siguiente empresa y puesto:\n`;
    prompt += `- Empresa: ${jobDetails.companyName}\n`;
    prompt += `- Puesto: ${jobDetails.jobTitle}\n`;
    if (jobDetails.companyInfo) prompt += `- Sobre la empresa: ${jobDetails.companyInfo}\n`;
    if (jobDetails.jobFunctions) prompt += `- Funciones del puesto: ${jobDetails.jobFunctions}\n`;
    if (jobDetails.jobRequirements) prompt += `- Requisitos: ${jobDetails.jobRequirements}\n\n`;
    prompt += `Ajusta el perfil, el resumen, las descripciones de la experiencia (usando la metodología STAR) y destaca las habilidades más relevantes para que coincidan con las palabras clave y requisitos del puesto.\n\n`;
  } else {
    prompt += `El objetivo es optimizar y mejorar este currículum de manera general, asegurando que las descripciones de experiencia tengan un alto impacto (metodología STAR), que el resumen sea profesional y que las habilidades destaquen.\n\n`;
  }

  if (aiInstructions) {
    prompt += `INSTRUCCIONES ADICIONALES DEL USUARIO:\n${aiInstructions}\n\n`;
  }

  prompt += `IMPORTANT RULES:\n`;
  prompt += `- You MUST return ONLY valid JSON.\n`;
  prompt += `- Do NOT return markdown code blocks like \`\`\`json\n`;
  prompt += `- The JSON must conform exactly to the JSON Resume schema format plus an extra "razonamiento_ia" string field at the root.\n`;
  prompt += `- In "razonamiento_ia", explain in Spanish the strategic changes you made to the CV and why.\n`;


  // Añadimos un timeout para evitar que se quede colgado indefinidamente
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout: Gemini tardó más de 60 segundos en responder")), 60000)
  );

  const apiPromise = ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });

  try {
    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    if (!response || !response.text) {
      throw new Error("La API de Gemini devolvió una respuesta vacía o sin texto.");
    }

    let responseText = response.text.trim();
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      console.warn("JSON.parse falló en generateCVFromGemini, intentando reparar JSON...");
      try {
        const repairedText = jsonrepair(responseText);
        parsedJson = JSON.parse(repairedText);
      } catch (repairError) {
        console.error("Fallo al reparar el JSON:", repairError);
        console.error("Texto crudo (primeros 500 chars):", responseText.substring(0, 500));
        throw e;
      }
    }

    const mergedData = {
      ...parsedJson,
      id: profileData.id,
      profileLabel: profileData.profileLabel,
      lastUpdated: new Date().toISOString(),
      jobDetails: jobDetails || undefined
    };

    const result = geminiResponseSchema.safeParse(mergedData);

    if (!result.success) {
      console.error("Error de validación en respuesta de Gemini:", result.error.issues);
      throw new Error(`La IA no devolvió el formato esperado: ${result.error.issues[0].message}`);
    }


    return result.data;
  } catch (err: any) {
    console.error("Error dentro de generateCVFromGemini:", err);
    throw err; // Propagar el error a ipcMain
  }
}

import { studyGuideSchema } from '../utils/validation.js';

export async function generateStudyGuideFromGemini(profileData: any, jobDetails: any, aiInstructions?: string) {
  const model = 'gemini-2.5-flash';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key de Gemini no configurada en el archivo .env.");
  }
  const ai = new GoogleGenAI({ apiKey });

  let prompt = `Eres un experto Headhunter y Entrevistador Técnico. A continuación, tienes el perfil optimizado de un candidato.\n\n`;
  prompt += `PERFIL DEL CANDIDATO (JSON):\n${JSON.stringify(profileData, null, 2)}\n\n`;

  if (jobDetails && Object.keys(jobDetails).length > 0) {
    prompt += `DETALLES DE LA OFERTA:\n${JSON.stringify(jobDetails, null, 2)}\n\n`;
    prompt += `Tu tarea es generar un Guion de Estudio estructurado para preparar al candidato para la entrevista específica de esta oferta.\n`;
  } else {
    prompt += `Tu tarea es generar un Guion de Estudio estructurado y general para preparar al candidato para futuras entrevistas. Basa tus preguntas y consejos únicamente en el contenido de su Currículum y el perfil profesional (label) indicado. Anticipa las preguntas más relevantes y explica cómo defender cada apartado de su experiencia y habilidades.\n`;
  }

  prompt += `Para ambos casos, explica qué son y cómo funcionan los stacks, librerías y/o arquitecturas principales que el candidato tenga en su CV, de forma clara y orientada a defenderlos en una entrevista.\n\n`;

  if (aiInstructions) {
    prompt += `INSTRUCCIONES ADICIONALES DEL USUARIO:\n${aiInstructions}\n\n`;
  }

  prompt += `IMPORTANT RULES:\n`;
  prompt += `- You MUST return ONLY valid JSON.\n`;
  prompt += `- Do NOT return markdown code blocks like \`\`\`json\n`;
  prompt += `- The JSON must conform exactly to this schema:\n`;
  prompt += `{
    "preguntas_tecnicas": [ { "pregunta": "...", "respuesta_sugerida": "... utilizando la metodología STAR (Situación, Tarea, Acción, Resultado)" } ],
    "flujos_de_trabajo": [ { "tecnologia": "...", "experiencia_candidato": "..." } ],
    "explicacion_tecnologias": [ { "nombre": "...", "explicacion": "..." } ],
    "kpis": [ { "metrica": "...", "como_explicarlo": "..." } ]
  }\n`;

  console.log("Enviando petición de Guion a Gemini...");

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout: Gemini tardó más de 60 segundos en responder")), 60000)
  );

  const apiPromise = ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3
    }
  });

  try {
    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    if (!response || !response.text) {
      throw new Error("La API de Gemini devolvió una respuesta vacía o sin texto.");
    }

    let responseText = response.text.trim();
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      console.warn("JSON.parse falló en generateStudyGuideFromGemini, intentando reparar JSON...");
      try {
        const repairedText = jsonrepair(responseText);
        parsedJson = JSON.parse(repairedText);
      } catch (repairError) {
        console.error("Fallo al reparar el JSON:", repairError);
        console.error("Texto crudo (primeros 500 chars):", responseText.substring(0, 500));
        throw e;
      }
    }
    const result = studyGuideSchema.safeParse(parsedJson);

    if (!result.success) {
      console.error("Error de validación en Guion de Gemini:", result.error.issues);
      throw new Error(`La IA no devolvió el formato esperado para el guion: ${result.error.issues[0].message}`);
    }

    return result.data;
  } catch (err: any) {
    console.error("Error dentro de generateStudyGuideFromGemini:", err);
    throw err;
  }
}
