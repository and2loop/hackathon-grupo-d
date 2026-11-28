# Agente segmentador del catálogo

Ficha de lo que el agente hizo de verdad para preparar `src/data/` el 28/11/2026. Las instrucciones completas y las decisiones están en
[segmentador-instrucciones.md](segmentador-instrucciones.md). Cómo usar el resultado en la app: [src/data/README.md](../src/data/README.md).

| Agente | Qué hace | Modelo | Entrada | Salida | Límites |
| --- | --- | --- | --- | --- | --- |
| Segmentador del catálogo | Transcribe, propone el temario, divide cada vídeo en apartados y tramos de 30–90 s y exporta el catálogo | Claude Opus (Opus 5.5) en T3 Code, con 4 subagentes del mismo modelo para verificar | Los 15 primeros vídeos de SPEC.md §8 (subtítulos y metadatos de YouTube) | `manifest.json`, transcripciones por lección y `catalog.js` | No inventa contenido; cada paso importante espera el visto bueno de una persona; nunca toca la app ni otras ramas |

## Qué hizo, paso a paso

Trabajó en un pipeline local, fuera de este repo: Python con un CLI `pipeline ingest|temario|segment|review|export` y un entorno Nix con yt-dlp y ffmpeg.

1. **Ingesta.** Con yt-dlp descargó los subtítulos y los metadatos de los 15 vídeos, sin descargar los vídeos: 3 h 7 min en total.
   - **Subtítulos:** ninguno tenía subtítulos manuales, así que usó los automáticos en español (`es-orig`, json3, con tiempo por palabra y sin puntuación).
   - **Frases:** las cortó por pausas de voz y salieron 1503 frases numeradas `{i, start, end, text}`.
   - **Glosario:** corrigió errores claros del reconocimiento con 86 reglas comprobadas en contexto, que hicieron 179 sustituciones (por ejemplo, "dama y down" → "DAM y DAW" o "Falls" → "false").
2. **Esquema.** Propuso el formato del JSON a partir de los mocks de la rama Lección y del modelo de datos de la SPEC. Andrés lo validó.
3. **Temario.** El curso no traía temario. Propuso 4 módulos, 15 lecciones (una por vídeo) y 72 apartados a partir de tres fuentes: el índice que da el profesor en el vídeo de presentación, los capítulos de YouTube y las transcripciones. Andrés lo validó.
4. **Segmentación.** Leyó cada transcripción y eligió los límites de cada tramo por índice de frase, nunca escribiendo tiempos a mano. Para cada tramo escribió un título y un resumen con lo que se dice en ese trozo. Después, un script tradujo los índices a segundos con 0,5 s de margen y redondeo a segundos enteros. El resultado son 185 tramos de 32 a 89 s (media 60 s).
5. **Verificación.** Cuatro subagentes, uno por módulo, compararon cada título y resumen con el texto de su tramo y rehicieron las cuentas y las trazas de los algoritmos.
   - **Inventado:** no encontraron nada.
   - **Corregido:** había 10 puntos que arreglar: datos que estaban en el tramo de al lado, cortes a mitad de idea y "ejercicio" donde el profesor dice "expresión".
6. **Revisión humana.** Generó un informe por lección con cada tramo: título, inicio–fin con enlace a YouTube, y primera y última frase. Andrés lo revisó.
7. **Export.** Escribió `src/data/` en la rama Catalogo y lo comprobó con un script de Node:
   - funcionan todos los helpers;
   - los 185 tramos duran entre 30 y 90 s y quedan dentro de su vídeo;
   - los índices de frase existen;
   - cargan las 15 transcripciones.

## Diferencias con lo que planteaba la SPEC (§7)

- **Transcripción:** no se usó WhisperX. Los 15 vídeos ya tenían subtítulos automáticos de YouTube, así que WhisperX queda como respaldo para vídeos sin subtítulos.
- **Shorts:** no se cortó ningún vídeo. Los shorts son "virtuales": la app reproduce el vídeo de YouTube entre `start` y `end`, así que no hace falta editor ni almacenamiento de vídeo. El modo con mp4 queda como opción futura.
- **Tests:** las preguntas no forman parte de este encargo. El campo `questions` existe, vacío, y cada pregunta tendrá que apuntar a un tramo con `segmentId`.

## Límites conocidos

- **Transcripciones:** salen del reconocimiento automático, no tienen puntuación y conservan algunos errores. El glosario solo corrige los que son claros.
- **Frases que juntan dos ideas:** algunas mezclan el final de una idea y el principio de la siguiente (por ejemplo, la frase 102 de la lección 1.2). Como los cortes van por frase, ese tramo empieza un poco a destiempo.
- **Introducciones y cierres:** las presentaciones genéricas de cada vídeo no tienen tramo. Están en el vídeo completo, pero no salen como short.
- **Comprobación dentro de la app:** no se ha probado en Expo Go, porque esta rama todavía no tiene código de pantallas.

## Tokens gastados

Medidos en los registros de la sesión de Claude Code (agente principal y los 4 subagentes, todos Claude Opus 5.5), desde la ingesta hasta el PR:

| Tipo | Principal | Subagentes | Total | Por vídeo (÷ 15) |
| --- | ---: | ---: | ---: | ---: |
| Entrada nueva | 180 | 18 | 198 | ≈ 13 |
| Escritura en caché | 334.854 | 223.662 | 558.516 | ≈ 37.000 |
| Lectura de caché | 16.777.221 | 259.115 | 17.036.336 | ≈ 1.136.000 |
| Salida generada | 142.453 | 24.784 | 167.237 | ≈ 11.000 |
| **Total** | **17.254.708** | **507.579** | **17.762.287** | **≈ 1.184.000** |

- **Casi todo es lectura de caché:** en cada paso el modelo vuelve a leer la conversación acumulada, que incluye transcripciones de hasta 160 frases. La caché abarata mucho esas relecturas, pero cuentan como tokens.
- **Incluye más que los vídeos:** la cifra cuenta también montar el pipeline, la documentación y el PR. El trabajo de cada vídeo por sí solo (leer la transcripción y escribir sus tramos) es una parte de esos ≈ 1,2 M.
- **Se hace una vez por vídeo, no por alumno:** el agente trabaja una sola vez sobre el catálogo y la app solo lee el JSON resultante, sin llamar a ningún modelo. Que haya 10 alumnos o 10.000 no cambia este gasto. Solo vuelve a haber gasto si se añaden vídeos nuevos (≈ 1 M de tokens por vídeo como orden de magnitud) o si se rehace la segmentación de alguno.
