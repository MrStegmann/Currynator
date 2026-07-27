# Currynator 🚀

**Currynator** es una plataforma de ingeniería documental, optimización de empleabilidad y preparación de entrevistas de alto impacto impulsada por Inteligencia Artificial. Concebida como una aplicación nativa de escritorio construida sobre **Electron**, **React 19**, **TypeScript** y **Tailwind CSS**, esta herramienta transforma historiales laborales estáticos en documentos persuasivos, cuantificables y altamente optimizados para sistemas ATS (*Applicant Tracking Systems*).

---

## 🎯 Enfoque y Propósito

En un mercado laboral tecnológico altamente competitivo y mediado por algoritmos de filtrado, un currículum estándar no es suficiente. Currynator combina metodologías avanzadas de consultoría de carrera (como el **Método STAR**: Situación, Tarea, Acción, Resultado) con el poder de modelos de Inteligencia Artificial de última generación para:

1. **Superar los filtros ATS**: Reescribir y estructurar la experiencia profesional utilizando palabras clave relevantes e impacto cuantificable.
2. **Personalizar candidaturas**: Adaptar el CV a ofertas de trabajo específicas (empresa, puesto, funciones y requisitos) o generar versiones optimizadas generales.
3. **Preparar la entrevista técnica**: Generar guiones de estudio estratégicos para anticipar preguntas de reclutadores y defender el stack tecnológico.
4. **Auditar la marca en GitHub**: Analizar el perfil público de GitHub y los repositorios del desarrollador mediante IA para optimizar READMEs y detectar áreas de mejora.

---

## ⚙️ Características Principales

### 1. 🎨 Studio de Edición y Optimización en Vivo (Workspace de 3 Columnas)
- **Panel Izquierdo (Gestor de Perfil y Ofertas)**: Carga y administración de perfiles JSON, definición de ofertas laborales objetivo (empresa, puesto, funciones, requisitos) e instrucciones personalizadas para la IA.
- **Canvas Central (Lienzo Interactivo)**: Renderizado en tiempo real del CV con diseño profesional compatible con ATS, vista previa de impresión y exportación directa a PDF.
- **Panel Derecho (Asistente IA y Guiones)**: Generación con **Google Gemini 2.5 Flash**, visualización del razonamiento estratégico de la IA (`razonamiento_ia`) y gestión del historial de CVs generados.

### 2. 🎓 Generador de Guiones de Estudio (Interview Preparation)
- Creación de guías de preparación personalizadas basadas en el CV del candidato y la descripción del puesto objetivo.
- Preguntas y respuestas técnicas sugeridas formuladas con metodología STAR.
- Desglose y explicación profunda de tecnologías y frameworks para defender en entrevistas técnicas.
- Indicadores Clave de Rendimiento (KPIs) y métricas recomendadas a mencionar.
- Exportación nativa del guion de estudio a formato PDF.

### 3. 🐙 Auditoría de GitHub con Groq AI
- Conexión nativa con la API de GitHub mediante Token de Acceso Personal (PAT).
- Evaluación automática del **README de perfil** del usuario mediante modelos avanzados de **Groq** (`llama-3.3-70b-versatile`, `mixtral-8x7b-32768`, `gemma2-9b-it`).
- Auditoría profunda de repositorios: puntuación de descripción, estructura de archivos, README de proyecto y distribución de lenguajes de programación.
- Feedback accionable con consejos, advertencias y detección de malas prácticas.

### 4. 📄 Motor de Exportación PDF de Alta Fidelidad
- Motor de renderizado Headless mediante **Puppeteer** (Chromium) y `react-to-print`.
- Control estricto de tipografías base64 y márgenes de página para prevenir desbordamientos y desviaciones visuales.

### 5. 🔒 Seguridad y Persistencia de Datos
- Almacenamiento cifrado de llaves API (Gemini, Groq, GitHub PAT) en el almacén seguro del sistema operativo mediante la API `safeStorage` de Electron.
- Datos 100% locales almacenados en esquemas JSON estructurados y validados con **Zod** y **jsonrepair**.

### 6. 🧙‍♂️ Asistente de Configuración Inicial (Installer Wizard)
- Wizard paso a paso en la primera ejecución de la aplicación para configurar carpetas de trabajo, claves de API y el perfil base del candidato.

---

## 🛠️ Pila Tecnológica (Tech Stack)

| Capa | Tecnologías |
| :--- | :--- |
| **Entorno Desktop** | [Electron](https://www.electronjs.org/) (v43), Node.js, IPC asíncrono seguro |
| **Frontend & UI** | [React](https://react.dev/) (v19), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) (v8), [Framer Motion](https://www.framer.com/motion/) |
| **Estilos & UI** | [Tailwind CSS](https://tailwindcss.com/) (v4), Lucide React |
| **Modelos de IA** | **Google Gemini 2.5 Flash** (`@google/genai`), **Groq SDK** (`groq-sdk`: Llama 3.3 70B, Llama 3.1 70B, Mixtral, Gemma 2) |
| **Validación & JSON** | [Zod](https://zod.dev/), `jsonrepair` |
| **Document PDF Engine** | [Puppeteer](https://pptr.dev/), `react-to-print` |
| **Calidad de Código** | [Oxlint](https://oxc.dev/) |

---

## 📁 Estructura del Almacenamiento Local

Currynator gestiona los documentos localmente dentro del directorio de trabajo configurado por el usuario:

- `data/`: Almacena las versiones base de perfiles en formato JSON.
- `CV/`: Guarda los currículums generados y optimizados por la IA en formato JSON.
- `aiReasoning/`: Archivos Markdown (`.md`) con la justificación estratégica del modelo de IA para cada CV optimizado.
- `study/`: Documentos PDF generados con los guiones de estudio para entrevistas.

---

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- **Node.js** v20 o superior
- **npm** v10 o superior
- Clave de API de **Google Gemini** ([Google AI Studio](https://aistudio.google.com/))
- Clave de API de **Groq** ([Groq Cloud](https://console.groq.com/)) *(Requerida para la auditoría de GitHub)*
- **GitHub Personal Access Token (PAT)** *(Requerido para análisis de repositorios)*

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MrStegmann/Currynator.git
   cd Currynator
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional en desarrollo):**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   GEMINI_API_KEY=tu_gemini_api_key
   GROQ_API_KEY=tu_groq_api_key
   ```

4. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Validar código con Oxlint:**
   ```bash
   npm run lint
   ```

6. **Compilar y empaquetar la aplicación:**
   ```bash
   npm run build
   ```

---

## 📊 Estado Actual del Proyecto

El proyecto cuenta con las siguientes funcionalidades operativas:
- ✅ **Studio Workspace (3 columnas)** para edición de perfiles, optimización por IA y previsualización interactiva.
- ✅ **Optimización con Google Gemini 2.5 Flash** utilizando salida JSON estructurada y resiliencia con Zod / jsonrepair.
- ✅ **Generación y exportación a PDF de Guiones de Estudio** para la preparación de entrevistas técnicas.
- ✅ **Módulo de Auditoría de GitHub** respaldado por modelos de Groq (Llama 3.3, Mixtral, etc.).
- ✅ **Almacenamiento Seguro** de tokens mediante `safeStorage` del sistema operativo.
- ✅ **Installer Wizard** para configuración guiada en la primera ejecución.