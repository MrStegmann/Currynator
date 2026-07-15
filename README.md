# Currynator 🚀

**Versión:** 0.0.1 (Estado: MVP Arquitectónico y Funcional Base)

Currynator es una plataforma de ingeniería documental avanzada diseñada para la creación, optimización estratégica y gestión de currículums de alto impacto. Concebida como una aplicación nativa de escritorio, esta herramienta aborda el desafío crítico de la empleabilidad moderna: transformar historiales laborales estáticos en documentos persuasivos, cuantificables y altamente optimizados para sistemas ATS (Applicant Tracking Systems).

---

## 🎯 Utilidad y Enfoque

En un mercado laboral altamente competitivo y mediado por algoritmos de filtrado (ATS), un currículum estándar no es suficiente. Currynator se rige por principios avanzados de consultoría de carrera y aplica metodologías comprobadas, como el **Método STAR** (Situación, Tarea, Acción, Resultado), para garantizar que la trayectoria del candidato demuestre un impacto cuantificable.

A diferencia de los editores visuales convencionales, Currynator abstrae el diseño y se enfoca en la calidad de la información, inyectando la inteligencia artificial de **Gemini 2.5** para redactar narrativas profesionales que incrementen drásticamente la tasa de respuesta y entrevistas.

---

## ⚙️ Funcionamiento y Características Principales

1. **Análisis y Optimización por IA (Gemini 2.5 API)**
   - Utiliza salidas estructuradas (Structured Outputs) mediante JSON Schema avanzado para un determinismo absoluto en la generación.
   - Es capaz de adaptar el CV general a un formato *híbrido*, *funcional* o *cronológico*, enfocado estrictamente en las descripciones de las ofertas de trabajo objetivo.
   
2. **Motor de Renderizado Headless (Puppeteer)**
   - Currynator incluye un motor de generación de PDF de alta fidelidad, asegurando compatibilidad total con formatos de impresión, inyección de fuentes base64 y control absoluto de márgenes para prevenir los errores comunes de renderizado.

3. **Arquitectura y UI Modernas**
   - Interfaz de usuario construida con **React** y estilisada mediante la filosofía "utility-first" de **Tailwind CSS**, logrando cargas rápidas y una experiencia de usuario estelar.
   - Tipado estricto extremo con **TypeScript** en todo el stack.
   - Aislamiento robusto de hilos nativos mediante **Electron** (separando estrictamente los procesos `Main` y `Renderer` para evitar bloqueos del hilo de UI).

4. **Sistema de Depuración Dinámico (Modo Dev)**
   - En su estado actual, incorpora una arquitectura global de telemetría capaz de registrar errores no controlados mediante un **Debug Terminal** integrado en la UI sin interferir con la experiencia del usuario.

---

## 🛠️ Pila Tecnológica (Tech Stack)

Este proyecto representa una integración profunda de tecnologías de vanguardia:

- **Entorno de Ejecución:** Electron & Node.js
- **Frontend:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS
- **IA y Orquestación:** Google Gemini 2.5 API (con soporte de subagentes paralelos)
- **Document Engine:** Puppeteer (Chromium)

---

## 📊 Estado del Proyecto (v0.0.1)

Actualmente, el proyecto se encuentra en la versión **0.0.1**. Los hitos alcanzados en esta etapa inicial incluyen:

- ✅ Arquitectura base de Electron configurada con IPC asíncrono y seguridad activa.
- ✅ Interfaz y sistema de enrutado interno del *Dashboard* y *Panel de Configuración*.
- ✅ Integración del sistema de telemetría y Debug Terminal ("Ghost in the Machine").
- ✅ Conexión estructurada con el modelo Gemini lista para ingestar datos JSON de candidatos.
- ✅ Sistema de compilación y empaquetado optimizado mediante Vite y Rolldown.

> *Este repositorio encapsula los esfuerzos de desarrollo para constituir un proyecto de ingeniería de software robusto, con miras a revolucionar la empleabilidad tecnológica automatizada.*
