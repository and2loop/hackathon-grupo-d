# Repository Guidelines

## Estructura y stack

La aplicación móvil de 480 Academy usa **React Native y Expo**. `App.js` monta la pantalla `Inicio`, cuya interfaz e iconos están en `src/inicio/`. Consulta `SPEC.md` para el flujo del alumno, los criterios de aceptación y el alcance de la demo.

- `480Academy propuestas de diseño (Copy).html` contiene la maqueta web de referencia. Ábrela en el navegador para comparar pantallas, paletas y variantes.
- `docs/img/` contiene los bocetos de flujo y arquitectura y la hoja de acuerdos. Registra las decisiones técnicas en `docs/decisiones.md`.
- `CONTRIBUTING.md` recoge los acuerdos del equipo. Registra avances y bloqueos resueltos en `BITACORA.md`.

## Desarrollo local

- Para servir la maqueta desde la raíz del repositorio, ejecuta `python3 -m http.server 8000 --bind 127.0.0.1` y selecciona el HTML en `http://127.0.0.1:8000/`.
- Ejecuta `npm ci` desde la raíz para instalar las dependencias y `npm start` para iniciar Expo. Usa el código QR para abrir la app en un dispositivo o ejecuta `npm run web` para verla en el navegador. [Documentación de Expo](https://docs.expo.dev/get-started/start-developing/)

## Estilo y pruebas

Usa dos espacios para código nuevo, nombres de componentes en `PascalCase` y textos de interfaz en español. Mantén juntos la interfaz, la lógica y las pruebas de cada funcionalidad. El repositorio aún no tiene formateador, linter ni pruebas automatizadas configurados.

Comprueba los criterios de aceptación de cada cambio y revisa el resultado en formato móvil. Si modificas la maqueta, prueba los selectores de diseño, paleta y distribución, y comprueba que la selección se conserva al recargar la URL.

## Commits y pull requests

Trabaja en ramas por funcionalidad. Usa mensajes de commit breves y descriptivos, como `SPEC: aclarar el alcance de la demo`. Integra los cambios en `main` mediante un pull request revisado por al menos otro miembro del equipo. Resume qué cambió y cómo lo verificaste, enlaza la tarea si existe y adjunta una captura móvil si hay cambios visuales.
