# Bitácora

## Sesión 1 · 23/11/2026

  - En esta primera sesión entre todos hemos planteado la solución al problema expuesto. Aportando ideas creativas, diseñando la arquitectura y empezando a desarrollar el paquete de diseño solicitado. Además, hemos recogido información que nos ha parecido esencial del cliente y hemos planteado propuestas para la UI. Individualmente:
      1. Andrés: Se ha encargado de la creación del repositorio, de darnos acceso a todo el equipo y, principalmente, del diseño de la arquitectura del programa.
      2. Sebastián: Ha reunido todas las dudas del equipo para las rondas de preguntas.
      3. Jose Manuel: Se ha encargado de analizar el enunciado y las restricciones del cliente, además de colaborar en la lluvia de ideas y del diseño inicial en papel.
      4. Pedro: Se ha encargado de empezar a desarrollar los documentos pedidos en el paquete de diseño.

### Problemas

  1. Duda con el procesamiento de vídeo: Inicialmente planteamos editar/fragmentar los vídeos con la IA en local, pero vimos que era inviable por hardware y costes.
   Resolución:
     Separamos las responsabilidades: Dejamos la IA local para tareas más sencillas y que no necesitan mucho procesamiento. Para ello utilizamos una IA frontera que se encarga de esta edición de vídeos.
  2. Encaje del tutor digital sin caer en el "típico chatbot": El cliente pidió ir más allá de un chat genérico y garantizar la privacidad de menores bajo el RGPD.
     Resolución:
       Acotamos el tutor únicamente al contexto del temario mediante IDs anónimos (sin datos personales) usando una IA en local para que no salgan datos de la empresa,, y priorizamos los tests dinámicos con salto directo al segundo exacto del fallo en el vídeo. 

## Catálogo · 28/11/2026

- Hemos generado el catálogo de los 15 vídeos del curso de Java: 4 módulos, 15 lecciones, 72 apartados y 185 shorts de 30–90 s, en `src/data/`.
- Lo ha hecho un agente (Claude Opus en T3 Code) a partir de los subtítulos de YouTube. Andrés ha validado el esquema, el temario y los tramos.
- Los shorts son marcas de tiempo sobre el vídeo de YouTube, así que no hay que cortar ni subir vídeo.
- Gasto: unos 17,8 M de tokens en total (≈ 1,2 M por vídeo, casi todo lectura de caché). Se hace una vez por vídeo, no por alumno.

### Problemas

  1. Los subtítulos automáticos venían sin puntuación y con errores ("dama y down" por "DAM y DAW").
     Resolución: frases cortadas por pausas y un glosario con las correcciones claras.
