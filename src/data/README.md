# Catálogo del curso (`src/data`)

Guía para personas y agentes que trabajen en las pantallas. Aquí está todo el contenido del curso que usa la app.
**No se edita a mano:** lo genera un pipeline offline (ver [agents/segmentador-instrucciones.md](../../agents/segmentador-instrucciones.md)).
La app nunca procesa vídeo: solo lee estos ficheros.

| Fichero | Qué es |
|---|---|
| `manifest.json` | Curso → módulos → lecciones → apartados → tramos. Unos 96 KB, va empaquetado en la app (no hace falta red). |
| `transcripts/<lección>.json` | Transcripción por frases de cada lección (`1.1.json` … `4.3.json`). Se cargan solo cuando se piden. |
| `catalog.js` | Tipos documentados con JSDoc y helpers. **Importad siempre desde aquí**, no el JSON directamente. |

## El curso

"MEGA Curso JAVA desde 0 [DAM - DAW]" del canal Aula en la nube: los 15 primeros vídeos de la lista de SPEC.md, apartado 8.
Los 15 forman el tema 1 del curso original (introducción a la programación con pseudocódigo, todavía sin Java).
El curso no traía temario; el nuestro es este:

| Módulo | Lecciones |
|---|---|
| 1 · Presentación e introducción a la programación | 1.1 Presentación del curso · 1.2 Problemas, algoritmos y programas |
| 2 · Representación de algoritmos y expresiones | 2.1 Representación de algoritmos · 2.2 Datos, variables y expresiones aritméticas · 2.3 Expresiones lógicas y operadores relacionales · 2.4 Operadores lógicos |
| 3 · Instrucciones y estructuras de control en pseudocódigo | 3.1 Instrucciones · 3.2 Alternativas (SI) · 3.3 Bucles y MIENTRAS · 3.4 Ejercicio: multiplicar sumando · 3.5 REPETIR-MIENTRAS · 3.6 PARA |
| 4 · Ejercicios y seguimiento de algoritmos | 4.1 Ejercicios resueltos · 4.2 Seguimiento de algoritmos · 4.3 Bucles anidados |

En total: 4 módulos, 15 lecciones, 72 apartados y 185 tramos.

## Cómo se organiza

```
course
└── modules[]            id "1"            Módulo: agrupa vídeos por tema
    └── lessons[]        id "1.2"          Lección = UN vídeo de YouTube (video.youtubeId, video.duration)
        ├── sections[]   id "1.2.1"        Apartado del temario dentro del vídeo
        │   └── segments[] id "1.2.1-a"    Tramo: trozo del vídeo de 30–90 s = un short
        ├── transcript   "transcripts/1.2.json"
        └── questions[]  (vacío por ahora)  Cada pregunta apunta a un tramo con segmentId
```

- **Ids estables.** Un tramo es el id del apartado más una letra (`1.2.1-a`, `1.2.1-b`). Se pueden guardar en el progreso del alumno.
- **Tiempos en segundos.** `start` y `end` son enteros. Para mostrarlos, usad `secondsToMMSS(s)`, que devuelve "MM:SS".
- **Contenido fiel.** `title` y `explanation` de cada tramo salen solo de lo que se dice en ese trozo del vídeo.
- **Qué falta.** No hay `code` ni `highlight` como en los mocks antiguos de Shorts: de una transcripción no se puede sacar código fiable.
- **Huecos entre tramos.** Las introducciones ("en este vídeo veremos…") y los cierres de cada vídeo no tienen tramo, pero sí están en el vídeo completo.

## Cómo se usa en las pantallas

**Lección.** Con `findLesson(id)` tenéis el título, la duración y los apartados. Con `getNextLesson(id)`, la siguiente lección.
El vídeo completo se reproduce con su `video.youtubeId`.

**Shorts.** `getShorts(lessonId)` devuelve los tramos con `isShort: true`, en orden. Ahora mismo son todos.
El modo es `virtual`, así que no hay mp4: cada short es el mismo vídeo de YouTube reproducido entre `start` y `end`.
Con `react-native-youtube-iframe`:

```jsx
import YoutubePlayer from 'react-native-youtube-iframe';
import { findLesson, getShorts } from '../data/catalog';

const lesson = findLesson('3.3');
const short = getShorts('3.3')[0];

<YoutubePlayer
  height={220}
  videoId={lesson.video.youtubeId}
  play
  initialPlayerParams={{ start: short.start, end: short.end, controls: false, modestbranding: true }}
/>
// Debajo: short.title y short.explanation.
```

**Test.** Cada pregunta lleva `segmentId`, no un timestamp. Si el alumno falla, `getQuestionTarget(question)` devuelve el tramo al que mandarlo:
abrid el vídeo en `segment.start` y mostrad `segment.title`.
Las preguntas todavía no existen (`questions: []`). Quien las genere tiene que usar ids de tramo que existan, y `findSegment(id)` sirve para comprobarlo.

**Transcripción.** `loadTranscript(lessonId)` devuelve `{ sentences: [{ i, start, end, text }] }`.
`segment.sentences = [a, b]` son la primera y la última frase de un tramo, por si queréis mostrar su texto.
La transcripción sale de los subtítulos automáticos de YouTube: no tiene puntuación y puede tener algún error de reconocimiento.

## Helpers de `catalog.js`

| Helper | Devuelve |
|---|---|
| `course`, `catalog` | El curso y el manifest completo |
| `findLesson(lessonId)` / `findModuleOfLesson(lessonId)` | La lección / su módulo |
| `findSegment(segmentId)` | `{ segment, section, lesson, module }` |
| `getSegments(lessonId)` / `getShorts(lessonId)` | Todos los tramos / solo los shorts |
| `getQuestionTarget(question)` | El tramo que explica una pregunta |
| `getNextLesson(lessonId)` | La lección siguiente (o `undefined`) |
| `loadTranscript(lessonId)` | La transcripción (carga perezosa) |
| `secondsToMMSS(seconds)` | "MM:SS" (o "H:MM:SS") |
| `youtubeUrl(youtubeId, start)` | URL de YouTube que empieza en ese segundo |

## Si hay que cambiar algo

Pedid el cambio en el pipeline (temario, tramos, títulos) y que vuelva a exportar: si se edita el JSON a mano, se pierde en la siguiente exportación.
Si cambia la forma de los datos, sube `schemaVersion` (ahora vale 1).
