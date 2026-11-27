# Acuerdos de trabajo

## Roles

## Ramas y pull requests

  Seguiremos un flujo basado en GitHub Flow adaptado a la velocidad del proyecto:
  - main siempre estable: Nadie sube código directamente a main. Esta rama contien mo.
  - Ramas por funcionalidad: Dividiremos el trabajo por funcionalidades completas que incluyan su propia interfaz, lógica y pruebas, evitando separar los tests en ramas independientes para reducir conflictos al fusionar.
  - Pull Requests: Para integrar una rama en main es obligatorio abrir un PR y que al menos otro miembro del equipo revise que no rompe la aplicación.

## Cuándo damos algo por terminado

  Una tarea se considera terminada únicamente cuando cumple estos cuatro puntos:
  1. Funcionalidad completa: Cubre todos los criterios de aceptación previstos.
  2. Verificada: Pasa los tests automáticos/manuales sin errores y se ha comprobado su visualización en formato móvil.
  3. Integrada: El Pull Request ha sido revisado y fusionado en main.
  4. Registrada: Se ha actualizado la bitácora de trabajo con el avance y los posibles bloqueos resueltos.
