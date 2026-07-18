SPEC.md: Currynator – Career Copilot for Developers

1. Visión General del Proyecto y Objetivos Estratégicos

En el ecosistema tecnológico actual, la brecha entre el talento técnico y su representación en el mercado laboral genera una fricción significativa que penaliza incluso a los ingenieros más brillantes. Currynator no es simplemente un editor de texto; es una solución estratégica diseñada para actuar como un copiloto inteligente de carrera (Career Copilot). Su propósito fundamental es transformar la narrativa profesional del desarrollador, eliminando las barreras técnicas y psicológicas que impiden una conversión efectiva en los procesos de selección. Al automatizar la optimización del currículum y la validación de perfiles, Currynator permite que el profesional se enfoque en su propuesta de valor, garantizando que su mensaje resuene tanto en algoritmos de filtrado (ATS) como en líderes técnicos.

Como aplicación de escritorio de alta especialización, Currynator se rige por tres pilares de valor:

* Eliminación de fricción: Automatización del proceso de adaptación de perfiles a vacantes específicas.
* Aumento exponencial de la tasa de conversión: Aplicación de metodologías de alto impacto para garantizar visibilidad ante sistemas automatizados.
* Personalización técnica: Generación de contenido con una precisión semántica que solo una IA entrenada en contextos de ingeniería puede alcanzar.

Esta visión estratégica demanda una arquitectura de software rigurosa, capaz de gestionar datos sensibles con una estabilidad y seguridad de grado industrial.

2. Arquitectura de Software: Estructura Basada en Procesos (Process-Based)

Para garantizar la integridad del sistema, Currynator implementa una arquitectura basada en procesos, inspirada en los principios de aislamiento que protegen la estabilidad del sistema operativo. Citando estándares como Intel Memory Protection Keys (MPK), que permiten una protección de memoria por hilo (per-thread memory protection), nuestra arquitectura emula este aislamiento para separar las responsabilidades críticas y reducir la superficie de ataque.

La jerarquía del proyecto sigue un modelo de separación estricta:

* main/: Núcleo orquestador de la aplicación, encargado del ciclo de vida y operaciones nativas.
* renderer/: Capa de interfaz de usuario (React + TailwindCSS), totalmente aislada de los recursos sensibles del sistema operativo.
* preload/: El puente de comunicación seguro (Bridge) que actúa como la única interfaz permitida entre el Renderer y el Main.

Análisis de Resiliencia: El aislamiento de procesos mitiga riesgos de seguridad críticos. Al manejar tokens de OAuth y datos biográficos, esta estructura asegura que una vulnerabilidad en la capa de UI no pueda escalar hacia los módulos de Node.js o el sistema de archivos. Este diseño no solo protege los datos, sino que garantiza que un fallo en el proceso de renderizado no provoque el colapso del núcleo de la aplicación.

3. Configuración del Proceso Principal (main.ts) y Servicios

El archivo main.ts se mantiene estrictamente minimalista, funcionando exclusivamente como el orquestador del ciclo de vida (bootstrap) y gestor de ventanas. La lógica de negocio pesada, como la integración con APIs de IA o la persistencia de archivos, se delega a la carpeta main/services.

Checklist de Responsabilidades del Proceso Principal:

* [ ] Orquestar el ciclo de vida de la aplicación (app.on('ready', ...)).
* [ ] Gestionar instancias de BrowserWindow y configuraciones de seguridad.
* [ ] Registrar canales de comunicación IPC asíncronos.
* [ ] Inicializar servicios de fondo (IA, Auth, File System) mediante inyección de dependencias.
* [ ] Garantizar que el Proceso Principal permanezca agnóstico respecto al estado de la UI.

Esta compartimentación asegura que el hilo principal sea liviano y responda rápidamente a los eventos del sistema operativo, delegando la complejidad a servicios especializados.

4. Capa Intermedia: Preload.js bajo el Modelo REST API

El archivo preload.js implementa un modelo de abstracción tipo REST API para interactuar con los servicios del Main. Esta decisión arquitectónica desacopla el Renderer del motor de ejecución, lo cual es fundamental para la testabilidad del sistema, permitiendo el uso de mocks del backend durante las pruebas unitarias del frontend.

Utilizando el contextBridge, se exponen métodos seguros que emulan peticiones HTTP:

* api.get(resource): Recuperación de configuraciones o perfiles.
* api.post(resource, data): Envío de prompts a la IA o triggers de autenticación.
* api.put(resource, data): Actualización de datos del CV.
* api.delete(resource): Purga de datos temporales.

Este diseño previene ataques de inyección al actuar como una lista blanca (allowlist) de funciones, garantizando que el Renderer nunca tenga acceso directo a módulos como fs o child_process.

5. Arquitectura del Renderer: Organización Basada en Funcionalidades (Feature-Based)

En el frontend, Currynator utiliza una organización basada en funcionalidades en lugar de tipos de archivos. Esto no solo facilita la escalabilidad, sino que es una medida estratégica para prevenir dependencias circulares (Circular Dependencies), un problema común en proyectos de gran envergadura.

La estructura en src/renderer se divide en módulos autocontenidos:

* features/cv-editor: Lógica y componentes de edición.
* features/auth-dashboard: Gestión de identidad y OAuth.
* features/ai-analysis: Visualización de métricas de impacto.

Característica	Estructura Convencional	Estructura Basada en Funcionalidades
Navegación	/components, /hooks, /services	/features/cv-editor, /features/auth
Localidad	Baja (archivos relacionados dispersos)	Alta (todo lo necesario está en un solo lugar)
Dependencias	Riesgo alto de acoplamiento global	Bajo; evita dependencias circulares
Escalabilidad	Complejidad logarítmica	Modular y lineal

6. Motor de Mejora de CV: Integración con Gemini AI API

La IA actúa como un consultor de reclutamiento técnico de élite. La integración con la API de Gemini no busca "rellenar texto", sino aplicar metodologías probadas para optimizar la compatibilidad con sistemas ATS y el impacto humano.

Lógica de Negocio y Metodología STAR

El motor de IA debe transformar cada experiencia profesional siguiendo la fórmula STAR estricta: Verbo de Acción + Qué hiciste (Tarea) + Mediante qué Método/Herramienta + Resultado Cuantificable.

* Ejemplo: "Optimicé el tiempo de carga de la aplicación en un 45% mediante la refactorización del backend y caché con Redis, mejorando la retención de usuarios en un 12%".

Formato Híbrido/Combinado (Estándar 2026)

El sistema generará currículums bajo una estructura híbrida optimizada para el mercado actual:

1. Perfil Profesional: Resumen de 3-4 líneas del expertise.
2. Competencias Clave: 3-4 áreas con logros agrupados temáticamente.
3. Historial Laboral: Resumen cronológico (Empresa, Cargo, Fechas) para lectura de ATS.
4. Educación y Certificaciones.

Implementación Técnica

Para asegurar una consistencia total entre el esquema de datos y la UI, Currynator se apoya en el Implicit Property Ordering de los modelos Gemini 2.5+. Esto garantiza que el JSON devuelto respete estrictamente el orden del esquema definido, eliminando la necesidad de capas de ordenamiento adicionales en el cliente.

7. Autenticación y Datos Externos: Implementación de OAuth

La integración con LinkedIn mediante OAuth 2.0 (Authorization Code Flow) permite validar la identidad y extraer datos de rendimiento publicitario para perfiles de marketing técnico.

Lógica de Procesamiento de Datos:

* Micro-moneda: Los datos de inversión (spend) de LinkedIn se reciben en micro-unidades. Es obligatorio dividir todos los valores de costo por 1,000,000 (ej: 5,000,000 unidades = $5.00) antes de su persistencia o visualización.
* Identificadores URN: El sistema debe manejar nativamente identificadores en formato URN (ej: urn:li:sponsoredCampaign:12345).

// Flujo de datos esquematizado
{
  "auth": "OAuth 2.0 Authorization Code Flow",
  "secure_storage": "Tokens almacenados en el Main Process (Secure Storage)",
  "data_normalization": {
    "currency_conversion": "value / 1,000,000",
    "id_parsing": "extract numeric from URN"
  }
}


8. Directrices de Rendimiento y Buenas Prácticas en Electron

El rendimiento es una métrica de calidad innegociable. La fluidez de Currynator depende de una gestión eficiente de los hilos de ejecución.

Acciones de Optimización Obligatorias:

* Web Workers: Se mandata el uso de Web Workers para tareas intensivas de CPU, específicamente para la transformación de JSON a PDF y el procesamiento pesado de respuestas de la IA.
* IPC Asíncrono: Queda prohibido el uso del módulo remote y de llamadas síncronas que bloqueen el hilo de la UI.
* Carga Just-In-Time (JIT): Los módulos de servicios pesados solo se cargan en el momento de su ejecución inicial para reducir el tiempo del "First Second".
* Planificación de Tareas: Uso de requestIdleCallback para operaciones de baja prioridad como la telemetría o el autoguardado, asegurando que no interfieran con las animaciones a 60fps.

La excelencia de Currynator reside en su capacidad para ofrecer una experiencia de usuario instantánea mientras realiza análisis técnicos profundos, manteniendo siempre los más altos estándares de seguridad y eficiencia arquitectónica.
