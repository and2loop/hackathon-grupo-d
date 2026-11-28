# Instrucciones del agente segmentador (pipeline del catálogo)

> Copia de las instrucciones (`CLAUDE.md`) con las que trabajó el agente que preparó `src/data/` (Claude Opus en T3 Code).
> «Yo» es Andrés, que dirigió el trabajo. El pipeline es un proyecto local aparte de este repo; las rutas como
> `temario.yaml`, `segmentacion/` o `data/` son relativas a ese proyecto. Lo que ve la app está en `src/data/`
> (guía: [src/data/README.md](../src/data/README.md)).

## Proyecto del pipeline (fuera de este repo)

| Fichero | Para qué |
|---|---|
| `config.yaml` | `repo: <la ruta del clon del repo>`, `branch: Catalogo`, `shorts_mode: virtual`, idioma y los 15 ids de vídeo |
| `flake.nix` | Entorno (`nix develop`): python con pyyaml, yt-dlp y ffmpeg; añade `bin/` al PATH |
| `glosario.yaml` | Correcciones de errores claros del reconocimiento de voz, opcionalmente por vídeo |
| `temario.yaml` | Módulos, lecciones (una por vídeo) y apartados validados |
| `segmentacion/<lección>.yaml` | Tramos por índice de frase `s: [a, b]`, con `title` y `explanation` |
| `docs/esquema.md` | Esquema del JSON (el mismo que documenta `src/data/catalog.js`) |
| `pipeline/` | Código: `ingest`, `temario`, `frases`, `segment`, `review`, `export` |
| `data/` | Generado: `raw/` (descargas de yt-dlp), `transcripts/`, `segments/`, `review/` |

Orden de uso: `pipeline ingest` → `pipeline temario` → (`pipeline frases <lección>` para leer y escribir `segmentacion/`) →
`pipeline segment` → `pipeline review` → `pipeline export` (con el clon de este repo en la rama Catalogo; no hace commit).

## Contexto
Hackathon de 480 Academy. App móvil en React Native + Expo, que se enseña con Expo Go; tiene que ir bien en 4G y todo en español. Cada lección tiene su vídeo, shorts por lección y tests que, si fallas una pregunta, te mandan al tramo del vídeo que la explica. El cliente no quiere una plataforma de vídeo: el catálogo se da por cargado con un fichero de configuración y los vídeos son de YouTube.

Este proyecto es un pipeline offline y en local que prepara ese catálogo. La app nunca procesa vídeo: solo lee el JSON que generamos aquí.

Repo de la app: https://github.com/and2loop/hackathon-grupo-d (trabajar SOLO en la rama Catalogo; no tocar otras ramas).
- SPEC.md: apartado 6 (modelo de datos), 7 (agentes) y 8 (lista de vídeos del curso).
- Mocks de las pantallas (rama Lección, leer con `git show origin/Lección:<ruta>`): src/shorts/clips.js, src/test-leccion/questions.js, src/leccion/lesson.js. Solo como referencia: el código de la app se va a rehacer y las pantallas se adaptarán al esquema de este pipeline (docs/esquema.md del pipeline; en este repo, src/data/README.md), no al revés.

## Curso
"MEGA Curso JAVA desde 0 [DAM - DAW]" del canal Aula en la nube. Las URLs están en SPEC.md, apartado 8. El enunciado pide una muestra de 10–15 vídeos: usar los 15 primeros salvo que diga otra cosa. El curso no trae temario: hay que proponerlo.

## Objetivo
1. Transcripción normalizada de cada vídeo.
2. Cada lección dividida por los apartados del temario (inicio y fin).
3. Shorts por apartado. Modo por defecto "virtual": solo marcas de tiempo, la app reproduce el vídeo de YouTube con start/end (react-native-youtube-iframe). Modo "cut" (mp4) opcional, más adelante.
4. Un manifest.json que la app importe tal cual.

## Flujo
1. Ingesta: con yt-dlp, subtítulos (manuales antes que automáticos; json3 si hay, si no vtt/srt) y metadatos (id, título, duración). No descargar el vídeo salvo para el modo "cut". Normalizar a frases numeradas {i, start, end, text}. Los .vtt automáticos repiten líneas en cascada: deduplicar. Si un vídeo no tiene subtítulos, avisar (el respaldo sería WhisperX, no montarlo ahora).
2. Temario: proponer módulos, lecciones y apartados con id (1.1, 1.1.1...) a partir de los títulos y las transcripciones. Enseñármelo y esperar mi visto bueno antes de seguir.
3. Segmentación: leer las frases numeradas y elegir los límites de cada apartado por ÍNDICE de frase, nunca escribiendo tiempos a mano; un script traduce índices a segundos. Un apartado puede tener varios tramos.
4. Ajuste: inicio y fin al límite de frase; 0,5 s de margen; shorts de 30–90 s (partir los tramos largos); en modo virtual, start redondeado hacia abajo y end hacia arriba a segundos enteros.
5. Revisión: informe por lección con los tramos (título, inicio–fin, primera y última frase) para que yo lo revise.
6. Export al repo, rama Catalogo: src/data/manifest.json, src/data/transcripts/<leccion>.json y un fichero JS con el esquema documentado (JSDoc; la app es JS, no TS) y helpers (buscar lección o tramo, segundos → "MM:SS").

## Formato
El esquema está validado y documentado en docs/esquema.md (en este repo: src/data/catalog.js y src/data/README.md); es la referencia para el export y para la app. Campos en inglés, tiempos en segundos, ids estables en los tramos ("1.2.1-a" = apartado + letra) y preguntas enlazadas con segmentId en vez de timestamp. Las preguntas no son parte de este encargo, pero el campo tiene que existir. Cualquier cambio de esquema: subir `schemaVersion` y actualizar docs/esquema.md.

## Restricciones
- El pipeline corre en NixOS: flake.nix o shell.nix con python, yt-dlp y ffmpeg.
- CLI tipo `pipeline ingest|temario|segment|review|export` y config.yaml (ruta del repo, vídeos, modo de shorts).
- No inventar contenido: los tramos y los resúmenes salen solo de lo que se dice en el vídeo.
- No hacer push salvo que Andrés lo pida expresamente. En el repo de la app, commits solo en la rama Catalogo y sin Co-Authored-By ni ninguna atribución a Claude (tampoco en los PR).
- Al terminar (no antes): redactar agents/segmentador.md con lo que el agente ha hecho de verdad (instrucciones, entradas, salidas, límites, modelo: Claude Opus en T3 Code) y un borrador de entrada de bitácora para que yo lo revise.

## Decisiones cerradas
- Ingesta (2026-11-28): los 15 vídeos tienen solo subtítulos automáticos (pista `es-orig`, json3, sin puntuación). Las frases se cortan por pausas (≥ 0,8 s, máx. 12 s), los conectores finales ("y", "entonces"...) pasan a la frase siguiente y se corrigen las mayúsculas espurias del ASR. Los 15 traen capítulos de YouTube (se guardan en `data/transcripts/<id>.json` como pista para el temario). 
- Esquema (2026-11-28, validado): ver docs/esquema.md. Ids de tramo "1.2.1-a"; una lección = un vídeo y los módulos agrupan vídeos; sin `code`/`highlight` (la app se rehace y no se inventa código); tramos < 30 s se quedan como tramo con `isShort: false` (destino de preguntas, no salen en shorts).
- Glosario ASR (2026-11-28): glosario.yaml corrige al normalizar los errores claros del reconocimiento ("dama y down" → "DAM y DAW", "Falls" → "false", "cer0", "Wild"/"Ford"...), opcionalmente por vídeo. Solo errores comprobados en contexto; nunca cambiar lo que se dice. `pipeline ingest` reutiliza data/raw y siempre renormaliza (`--force` para volver a descargar).
- Temario (2026-11-28, validado): temario.yaml, 4 módulos, 15 lecciones, 72 apartados. Las introducciones genéricas de cada vídeo no son apartado ni generan tramos; los capítulos cortos de YouTube se juntan con el de al lado. `pipeline temario` lo valida. (2.4.4 y 2.4.5 renombrados a "Expresiones 11 y 12" / "Expresión 13": el profesor las llama expresiones.)
- Segmentación (2026-11-28): segmentacion/<lección>.yaml con tramos por índice de frase [a, b], título y resumen escritos leyendo la transcripción. `pipeline segment` traduce a segundos y ajusta; `pipeline review` genera data/review/informe.md y data/review/texto/<lección>.md (texto completo por tramo). 185 tramos de 32–89 s (media 60 s). Las introducciones y cierres genéricos quedan sin tramo. Cuatro subagentes verificaron título/resumen contra el texto de cada tramo; se corrigieron 10 puntos (afirmaciones que estaban en el tramo de al lado y cortes a mitad de idea). Revisado y validado por Andrés.
- Export (2026-11-28): `pipeline export` escribe en <la ruta del clon del repo>/src/data/ manifest.json (~96 KB, indentado para diffs legibles), transcripts/<lección>.json (una frase por línea) y catalog.js (generado desde pipeline/catalog.template.js: JSDoc + helpers findLesson, findModuleOfLesson, findSegment, getSegments, getShorts, getQuestionTarget, getNextLesson, loadTranscript, secondsToMMSS, youtubeUrl). Solo exporta si el repo está en la rama Catalogo; no hace commit. Comprobado con Node (helpers e integridad de los 185 tramos). Guía para otros agentes en src/data/README.md; copia genérica de estas instrucciones en agents/segmentador-instrucciones.md del repo de la app.
- Límite conocido: algunas frases del ASR juntan el final de una idea y el inicio de la siguiente (p. ej. 1.2 [102]); con cortes por índice no se pueden partir. Si molesta, la solución sería partir esa frase al normalizar.
