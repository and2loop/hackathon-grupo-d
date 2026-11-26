## 1. El alumno y su problema
  La solución propuesta, principalmente, es para los alumnos que se saltan los videos, ya sea por aburrimiento, tendencias, contenido poco dinámico...

## 2. Flujo del alumno

  ![Boceto del flujo del alumno](docs/img/flujo-alumno.jpg)

  1. **Login:** el alumno entra con su usuario y contraseña, o se registra si es la primera vez.
  2. **Home:** ve los cursos nuevos, los que son tendencia y los que se están promocionando, y elige uno.
  3. **Mis cursos:** aparecen los cursos que está haciendo, con el temario dividido en lecciones (1.1, 1.2...) para ver por dónde va.
  4. **Vídeos / Módulo:** ve el vídeo de la lección y, al terminar, puede hacer el test de ese módulo.
  5. **Shorts / Módulo:** la misma lección en vídeos cortos que se van pasando deslizando, como en YouTube Shorts o TikTok.
  6. **Repaso / Tutor:** chat con el tutor digital para resolver dudas y repasar lo que ha fallado en los tests.

  La barra de abajo tiene cuatro accesos: inicio, tests/repaso, cursos y perfil.

## 3. Respuesta a los problemas
  - Los alumnos se saltan vídeos: Opción de contenido corto y resumido.
  - Los itinerarios son iguales para todos: Test inicial en el módulo para valorar el conocimiento y así poder saltar a la parte que no conoce.
  - No sabemos si el alumno aprende: Tests gamificados (por cada lección), obligando al usuario a volver a ver las partes del vídeo en las que ha fallado.
  - El acompañamiento no llega a todos: Tutor digital, mediante un chatbot.

## 4. Historias de usuario
  | Como... | Quiero... | Para... | Prioridad (imprecindible / deseable / fuera) | Criterios de aceptación
  | --- | --- | --- | --- | --- |
  | Usuario | Acceder un curso de la manera más eficiente | tener un aprendizaje que sea amable con mi tiempo | deseable | 
  | Usuario | Una intefaz accesible e intuitiva | Facilitarme el uso de la aplicación | imprescindible | 
  | Usuario | Privacidad en mis datos | Que ninguna IA se aproveche de ellos | imprescindible | Que sea trasparente todo el flujo de mis datos
  | Usuario |

## 5. Arquitectura

  ![Diagrama de arquitectura](docs/img/arquitectura.jpg)

## 6. Modelo de datos y flujo hacia la IA
  Utilizaremos la IA para un chatbot, edición+transcripción de video y generación de tests dinámicos. Los datos que saldrían serían los que el usuario exponga en el chatbot. Para que haya privacidad en la información, utilizaríamos una IA local para que el tratamiento de datos dependiera exclusivamente de la empresa y no de externas (explicar en un apartado de la app o en el chatbot si preguntan los procesos de eliminación de chats pasados para no conservar información personal)

## 7. Agentes de IA

  | Agente | Qué hace | Modelo y por qué | Entrada | Salida | Límites
  | --- | --- | --- | --- | --- | --- |
  | Chatbot | Es el encargado de manejar el chatbot | Qwen3 8B, ya que consume muy pocos recursos y es suficiente para hacer un chatbot | Texto | Texto | Límite de solicitudes/tokens y límites de respuesta, para que no se salga del contexto |
  | Editor de video | Coge vídeos ya creados y crea shorts a partir de ellos, y además particiona los vídeos | Modelo frontera + MCP editor | Vídeos | Vídeos | No añadir contenido inventado |
  | Generación de test | Coge la trascripción del vídeo y genera tests a partir de las transcripciones | Qwen3 8B, ya que no se necesita ningún modelo grande para hacer esto | Texto | Texto | Contenido que no se salga de lo impartido |
  | Trascripción | Convertir audio a texto | WhisperX, porque es el mejor modelo de transcripción | Vídeo | Texto | No generar texto que no esté en el vídeo |

## 8. Contenido

## 9. Coste


## 10. Idea original

  - Introducción de shorts: Mejora el aprendizaje del alumno haciéndolo de manera mas interactiva.
  - Introducción de test: pruebas de conocimiento tanto para aprender como dinamizar lo que el alumno debe estudiar, lo que ayuda a reiterar contenidos o saltarlos.
  - Sectorización de vídeos con descripción: índices especiales en los vídeos para saltarlos según tema y para saber qué debe de ver un estudiante si falla una pregunta del test.
  - Tutor digital: chat para resolver dudas del temario que pida el estudiante o respecto todo lo que envuelve el producto (480 Academy).



## 11. Alcance para el 30/11

  Estaría fuera de nuestro alcance el uso de IA local, ya sería inviable por el tema hardware, la implementación del chatbot ya que no disponemos de IA local.
  Entra todo el flujo de la interacción con un curso.




  
