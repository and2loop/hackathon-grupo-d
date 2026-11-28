// Catálogo del curso: tipos (JSDoc) y helpers para leer src/data/manifest.json.
// FICHERO GENERADO por el pipeline del catálogo (`pipeline export`): no editar a mano.
// Guía para personas y agentes: src/data/README.md

import manifest from './manifest.json';

/**
 * @typedef {Object} Sentence  Frase de la transcripción.
 * @property {number} i       Índice de la frase dentro de la lección (0, 1, 2...).
 * @property {number} start   Inicio en segundos (con decimales).
 * @property {number} end     Fin en segundos (con decimales).
 * @property {string} text    Texto (subtítulos automáticos de YouTube, sin puntuación).
 */

/**
 * @typedef {Object} Segment  Tramo del vídeo: es el short y el destino de una pregunta fallada.
 * @property {string} id          Id estable: apartado + letra, p. ej. "1.2.1-a".
 * @property {number} start       Inicio en segundos enteros (modo virtual: redondeado hacia abajo).
 * @property {number} end         Fin en segundos enteros (modo virtual: redondeado hacia arriba).
 * @property {[number, number]} sentences  Primera y última frase de la transcripción (índices).
 * @property {string} title       Título; sale solo de lo que se dice en el vídeo.
 * @property {string} explanation Resumen; sale solo de lo que se dice en el vídeo.
 * @property {boolean} isShort    false si dura < 30 s: sirve de destino de preguntas pero no sale en shorts.
 */

/**
 * @typedef {Object} Section  Apartado del temario dentro de una lección.
 * @property {string} id            P. ej. "1.2.1".
 * @property {string} title
 * @property {Segment[]} segments   Uno o varios tramos, en orden.
 */

/**
 * @typedef {Object} Question  Pregunta del test de la lección (todavía vacío: lo rellenará otro agente).
 * @property {string} id          P. ej. "1.2-q1".
 * @property {string} prompt
 * @property {string[]} options
 * @property {number} correct     Índice de la opción correcta.
 * @property {string} segmentId   Tramo que explica la respuesta (sustituye al antiguo timestamp).
 * @property {string} explanation
 */

/**
 * @typedef {Object} Lesson  Lección = un vídeo de YouTube.
 * @property {string} id                 P. ej. "1.2".
 * @property {string} title
 * @property {{youtubeId: string, duration: number}} video   duration en segundos.
 * @property {string} transcript         Ruta relativa a src/data (p. ej. "transcripts/1.2.json").
 * @property {Section[]} sections
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Module
 * @property {string} id
 * @property {number} number
 * @property {string} title
 * @property {Lesson[]} lessons
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} channel
 * @property {string|null} playlistId
 * @property {string|null} description
 * @property {boolean} isNew
 * @property {boolean} trending
 * @property {boolean} promoted
 * @property {Module[]} modules
 */

/**
 * @typedef {Object} Manifest
 * @property {number} schemaVersion
 * @property {'virtual'|'cut'} shortsMode   virtual: se reproduce el vídeo de YouTube entre start y end.
 * @property {Course} course
 */

/** @type {Manifest} */
export const catalog = manifest;
export const course = manifest.course;

// Índices para búsquedas rápidas (se construyen una vez al importar).
const lessonsById = new Map();
const segmentsById = new Map();
for (const module of course.modules) {
  for (const lesson of module.lessons) {
    lessonsById.set(lesson.id, { lesson, module });
    for (const section of lesson.sections) {
      for (const segment of section.segments) {
        segmentsById.set(segment.id, { segment, section, lesson, module });
      }
    }
  }
}

// Carga perezosa de transcripciones (Metro necesita require con rutas fijas).
const transcriptLoaders = {
  '1.1': () => require('./transcripts/1.1.json'),
  '1.2': () => require('./transcripts/1.2.json'),
  '2.1': () => require('./transcripts/2.1.json'),
  '2.2': () => require('./transcripts/2.2.json'),
  '2.3': () => require('./transcripts/2.3.json'),
  '2.4': () => require('./transcripts/2.4.json'),
  '3.1': () => require('./transcripts/3.1.json'),
  '3.2': () => require('./transcripts/3.2.json'),
  '3.3': () => require('./transcripts/3.3.json'),
  '3.4': () => require('./transcripts/3.4.json'),
  '3.5': () => require('./transcripts/3.5.json'),
  '3.6': () => require('./transcripts/3.6.json'),
  '4.1': () => require('./transcripts/4.1.json'),
  '4.2': () => require('./transcripts/4.2.json'),
  '4.3': () => require('./transcripts/4.3.json'),
};

/**
 * Lección por id.
 * @param {string} lessonId  P. ej. "1.2".
 * @returns {Lesson|undefined}
 */
export function findLesson(lessonId) {
  return lessonsById.get(lessonId)?.lesson;
}

/**
 * Módulo al que pertenece una lección.
 * @param {string} lessonId
 * @returns {Module|undefined}
 */
export function findModuleOfLesson(lessonId) {
  return lessonsById.get(lessonId)?.module;
}

/**
 * Tramo por id, con su apartado, lección y módulo.
 * @param {string} segmentId  P. ej. "1.2.1-a".
 * @returns {{segment: Segment, section: Section, lesson: Lesson, module: Module}|undefined}
 */
export function findSegment(segmentId) {
  return segmentsById.get(segmentId);
}

/**
 * Todos los tramos de una lección, en orden de temario.
 * @param {string} lessonId
 * @returns {Segment[]}
 */
export function getSegments(lessonId) {
  const lesson = findLesson(lessonId);
  return lesson ? lesson.sections.flatMap((section) => section.segments) : [];
}

/**
 * Shorts de una lección: los tramos con isShort, en orden.
 * @param {string} lessonId
 * @returns {Segment[]}
 */
export function getShorts(lessonId) {
  return getSegments(lessonId).filter((segment) => segment.isShort);
}

/**
 * Tramo al que hay que mandar al alumno si falla una pregunta.
 * @param {Question} question
 * @returns {Segment|undefined}
 */
export function getQuestionTarget(question) {
  return findSegment(question.segmentId)?.segment;
}

/**
 * Lección siguiente en el orden del curso (o undefined si es la última).
 * @param {string} lessonId
 * @returns {Lesson|undefined}
 */
export function getNextLesson(lessonId) {
  const all = course.modules.flatMap((module) => module.lessons);
  const index = all.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? all[index + 1] : undefined;
}

/**
 * Transcripción de una lección (se carga al pedirla).
 * @param {string} lessonId
 * @returns {{lessonId: string, youtubeId: string, source: string, lang: string, sentences: Sentence[]}|undefined}
 */
export function loadTranscript(lessonId) {
  const load = transcriptLoaders[lessonId];
  return load ? load() : undefined;
}

/**
 * Segundos a "MM:SS" (o "H:MM:SS" si pasa de una hora).
 * @param {number} seconds
 * @returns {string}
 */
export function secondsToMMSS(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${String(m).padStart(2, '0')}:${s}`;
}

/**
 * URL de YouTube que empieza en un segundo concreto (útil fuera de la app o como respaldo).
 * @param {string} youtubeId
 * @param {number} [start]
 * @returns {string}
 */
export function youtubeUrl(youtubeId, start = 0) {
  return `https://www.youtube.com/watch?v=${youtubeId}${start ? `&t=${Math.floor(start)}s` : ''}`;
}
