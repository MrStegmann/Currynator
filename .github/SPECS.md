# Especificaciones Técnicas y Arquitectura: Currynator

1. Visión General del Proyecto

Currynator es una plataforma de ingeniería documental diseñada para la creación y optimización estratégica de currículos (CV) de alto rendimiento. El objetivo central es transformar trayectorias laborales pasivas en documentos de impacto mediante el uso de inteligencia artificial avanzada, aplicando el método STAR (Situación, Tarea, Acción, Resultado) para la generación de logros cuantificables.

La aplicación está diseñada bajo estándares de 2026, permitiendo la exportación de formatos híbridos, cronológicos y funcionales con una arquitectura orientada a la máxima compatibilidad con sistemas ATS (Applicant Tracking Systems) y una experiencia de usuario fluida en el entorno de escritorio.

2. Pila Tecnológica (Tech Stack)

Componente	Tecnología	Justificación Técnica
Frontend	React con TypeScript	Tipado estricto para modelos de datos de CV complejos.
Estilo	Tailwind CSS	Filosofía utility-first; bundles 5-7x más pequeños que Bootstrap.
Entorno	Electron	Arquitectura multi-proceso para aislamiento de lógica de SO.
PDF Engine	Puppeteer	Renderizado headless de alta fidelidad basado en Chromium.
Motor AI	Gemini 2.5 API	Soporte nativo de Structured Outputs y JSON Schema extendido.

3. Arquitectura Técnica y Procesos de Escritorio

Arquitectura de Electron

Se implementa una separación estricta entre el Proceso Principal (Main) y el Proceso de Renderizado (Renderer). Para garantizar la estabilidad del sistema, el hilo de la interfaz de usuario nunca debe ser bloqueado por operaciones síncronas.

Directivas para el hilo de UI:

* Aislamiento de I/O: Queda prohibido el uso de versiones Sync de módulos como fs o child_process.
* Comunicación Asíncrona: Toda interacción Main-Renderer debe utilizar ipcMain.handle e ipcRenderer.invoke.
* Perfilado de Carga: En sistemas Windows, donde require() tiene un alto overhead, se debe auditar el tiempo de carga de módulos mediante el comando: node --cpu-prof --heap-prof
* Offloading: Tareas intensivas de CPU deben delegarse a Worker Threads de Node.js o utilizar requestIdleCallback para tareas de baja prioridad en el Renderer.

Estrategia de Estilizado

Se descarta el uso de Bootstrap en favor de Tailwind CSS. Esta decisión se basa en la optimización de Core Web Vitals: mientras que Bootstrap carga componentes no utilizados, Tailwind genera CSS on-demand, reduciendo el bundle final significativamente y eliminando la necesidad de sobrescribir estilos predefinidos (Technical Debt).

4. Integración de Inteligencia Artificial (Gemini API)

Structured Outputs y Esquemas Avanzados

La integración con Gemini 2.5 garantiza que las respuestas del modelo sean determinísticas mediante el uso de JSON Schema. A diferencia de versiones anteriores, Gemini 2.5 asegura la preservación del orden de las propiedades, eliminando la necesidad de lógica de reordenamiento post-procesamiento.

El diseño del esquema debe aprovechar las capacidades extendidas:

* anyOf: Para estructuras condicionales en secciones de contacto o educación.
* $ref: Para definir esquemas recursivos (útil en subsecciones de habilidades anidadas).
* prefixItems: Para validación estricta de arrays tipo tupla.

Orquestación mediante Subagentes

Para evitar el "context rot" (degradación del contexto por exceso de tokens), se implementa un sistema de subagentes especializados:

* Definición: Los agentes se definen en archivos .md con YAML frontmatter en /.gemini/agents/.
* Ejecución: Se utiliza la sintaxis @agent para delegación explícita (ej. @codebase_investigator Map out auth flow).
* Paralelismo: El sistema soporta la ejecución de múltiples subagentes en paralelo para tareas de investigación masiva, reduciendo el tiempo total de procesamiento.

5. Motor de Generación de PDFs (Puppeteer)

Optimización y Gestión de Memoria

La generación de documentos a escala presenta riesgos de OOM (Out of Memory) y procesos Chrome huérfanos.

* Production Warning: Se debe implementar un pool de procesos (vía puppeteer-cluster) para evitar el costo de puppeteer.launch() en cada petición.
* Memory Isolation: Cada renderizado debe ocurrir en un contexto de navegación limpio para evitar fugas de memoria.

Fidelidad Visual y Page Breaks

Para resolver el "nightmare" de textos cortados por la mitad, se aplican las siguientes reglas de CSS Print:

* Fix Crítico: @page { margin: 0; size: auto; } para asegurar el control total de los márgenes desde el contenedor HTML.
* Control de Saltos: Aplicación de break-inside: avoid en bloques de experiencia laboral.
* Fuentes: Uso de base64-inlined strings en el CSS para garantizar que el PDF final no dependa de fuentes del sistema o de latencia de red (CDN).

6. Estructura de Directorios

/src
  /pages         # Páginas de la aplicación
  /components    # Componentes reutilizables de la aplicación
  /hooks         # Hooks personalizados de React
  /store         # Store de estado global
  /services      # Logica de negocio, Gemini API y orquestación de Puppeteer
  /utils         # Funciones de utilidad
  /assets        # Recursos estáticos
  /styles        # Estilos globales
/.gemini
  /agents        # Definiciones .md con YAML frontmatter de subagentes
/electron
  /main.ts       # Lógica del Proceso Principal (Electron)
  /preload.ts    # Preload del Proceso Principal (Electron)
  /utils.ts      # Funciones de utilidad de Electron

7. Estándares de Desarrollo y Manejo de Errores

Sistema de Gestión de Errores de 3 Capas

Para asegurar la trazabilidad en producción:

1. Identificación: Uso de la clase AppError con el flag isOperational para distinguir errores de lógica de fallos críticos del sistema.
2. Mapeo: Los controladores deben enriquecer el contexto del error antes de propagarlo (Mapping).
3. Middleware Global: Un único punto de control que sanitiza la respuesta (eliminando stack traces en producción) e integra el registro profesional (Winston).

Rendimiento del Entorno

* Just-in-Time (JIT) Loading: Carga diferida de módulos pesados.
* Bundling: Empaquetado obligatorio de archivos para reducir las llamadas al sistema de archivos en Windows.

8. Lógica de Dominio: Estándares de CV 2026

El software debe aplicar rigurosamente los siguientes principios de consultoría de carrera:

* Impacto Cuantificable: La IA transformará "Responsable de ventas" en "Superó cuota trimestral en 135% durante 4 trimestres consecutivos".
* Compatibilidad ATS: Evitar el uso de tablas complejas o gráficos no parseables; priorizar palabras clave exactas de la vacante.
* Regla de Oro de Extensión: El sistema priorizará currículos de una sola página, dado que en el mercado de LATAM esto incrementa la tasa de respuesta en un 21%.
* Formato Híbrido: Estructura recomendada que combina una sección de competencias clave (funcional) con un historial cronológico resumido para satisfacer tanto al ATS como al reclutador humano.
