export const reviewCourses = [
  {
    title: 'React desde cero',
    lessons: [
      {
        id: '2.1',
        title: 'Componentes y props',
        questions: [
          ['¿Qué representan las props?', 'Los datos que un componente recibe', 'Los estilos de toda la aplicación', 'El estado global de React'],
          ['¿Cómo se escribe el nombre de un componente propio en JSX?', 'Empieza con mayúscula', 'Empieza con minúscula', 'Debe llevar un guion'],
          ['¿Cómo se pasa el valor de una variable a una prop?', 'Con llaves, como nombre={usuario}', 'Con comillas, como nombre="usuario"', 'Con paréntesis, como nombre=(usuario)'],
          ['¿Quién puede cambiar el valor que recibe un componente como prop?', 'El componente que se la pasa', 'Cualquier componente que la lea', 'Solo el navegador'],
          ['¿Qué contiene la prop children?', 'El contenido entre las etiquetas del componente', 'Todos los componentes de la página', 'Los estilos heredados'],
        ],
      },
      {
        id: '2.2',
        title: 'Eventos',
        questions: [
          ['¿Cómo se pasa un manejador a onClick?', 'onClick={guardar}', 'onClick={guardar()}', 'onClick="guardar"'],
          ['¿Cuándo se ejecuta la función de onClick={() => guardar(id)}?', 'Al pulsar el botón', 'Al renderizar el botón', 'Al importar el componente'],
          ['¿Qué método evita el envío habitual de un formulario?', 'event.preventDefault()', 'event.stopPropagation()', 'event.target()'],
          ['¿Qué propiedad permite leer el valor escrito en un campo al cambiar?', 'event.target.value', 'event.type.value', 'event.key.value'],
          ['¿Qué hace event.stopPropagation()?', 'Detiene la propagación del evento a los ancestros', 'Impide el comportamiento predeterminado del navegador', 'Elimina el manejador del elemento'],
        ],
      },
      {
        id: '2.3',
        title: 'Listas y keys',
        questions: [
          ['¿Para qué sirve la prop key?', 'Para que React distinga cada elemento', 'Para darle estilo al elemento', 'Para ordenar la lista'],
          ['¿Qué método transforma un array de datos en una lista de elementos JSX?', 'map()', 'includes()', 'join()'],
          ['¿Dónde se coloca key al renderizar una lista?', 'En el elemento que devuelve map()', 'En el contenedor que envuelve toda la lista', 'En el último elemento de la lista'],
          ['¿Cuál es una key estable al reordenar una lista de tareas?', 'El identificador único de la tarea', 'La posición actual de la tarea', 'Un número aleatorio en cada renderizado'],
          ['¿Entre qué elementos debe ser única una key?', 'Entre los elementos hermanos de la lista', 'Entre todos los elementos de toda la aplicación', 'Entre todas las páginas del sitio'],
        ],
      },
      {
        id: '2.4',
        title: 'Estado',
        questions: [
          ['¿Qué devuelve useState?', 'El valor actual y una función para actualizarlo', 'El valor actual y una copia del componente', 'Solo el valor inicial'],
          ['¿En qué parte de un componente se llama a useState?', 'En el nivel superior del componente', 'Dentro de un bucle', 'Dentro del manejador de un botón'],
          ['¿Cómo se actualiza el contador a partir de su valor anterior?', 'setContador(anterior => anterior + 1)', 'contador = contador + 1', 'useState(contador + 1)'],
          ['¿Cómo se añade un elemento a una lista en el estado?', 'Se crea un array nuevo con el elemento y se actualiza el estado', 'Se modifica el array original con push()', 'Se reasigna directamente la variable del estado'],
          ['¿Qué conserva React entre renderizados del mismo componente?', 'El estado asociado al componente', 'Todas las variables locales de la función', 'Los argumentos de la última llamada a un evento'],
        ],
      },
    ],
  },
  {
    title: 'Git y GitHub en equipo',
    lessons: [
      {
        id: '1.2',
        title: 'Ramas',
        questions: [
          ['¿Para qué sirve una rama de Git?', 'Para desarrollar cambios en una línea de trabajo independiente', 'Para borrar los cambios de otras personas', 'Para subir archivos automáticamente'],
          ['¿Cómo se crea una rama y se cambia a ella en un paso?', 'git switch -c mi-rama', 'git branch --list', 'git status mi-rama'],
          ['¿Qué hace git merge?', 'Integra cambios de otra rama en la rama actual', 'Borra todos los commits de la rama actual', 'Publica automáticamente la rama en GitHub'],
          ['¿Qué comando muestra las ramas locales?', 'git branch', 'git log', 'git diff'],
          ['¿Qué indica HEAD cuando estás en una rama?', 'La rama que tienes activa', 'La URL del repositorio remoto', 'El nombre del primer commit del repositorio'],
        ],
      },
    ],
  },
];

export const sampleAttempts = [
  {
    id: 'react-review', title: 'Repaso de 2.1 a 2.3', score: 4, total: 5, date: 'Ayer',
    summary: 'Fallaste: para qué sirve la key',
    mistakes: [{
      prompt: '¿Para qué sirve la prop key?', selected: 'Para ordenar la lista',
      correct: 'Para que React distinga cada elemento',
    }],
  },
  {
    id: 'react-events', title: 'Test de 2.2 Eventos', score: 5, total: 5, date: 'Lunes',
    summary: 'Sin fallos', mistakes: [],
  },
  {
    id: 'git-intro', title: 'Test inicial de Git', score: 2, total: 3, date: '15 nov.',
    summary: 'Fallaste: ramas',
    mistakes: [{
      prompt: '¿Para qué sirve una rama de Git?', selected: 'Para subir archivos automáticamente',
      correct: 'Para desarrollar cambios en una línea de trabajo independiente',
    }],
  },
];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

export function generateQuestions(lessons, count) {
  const banks = shuffle(lessons).map((lesson) => shuffle(lesson.questions));
  const questions = [];

  for (let round = 0; banks.some((bank) => round < bank.length); round++) {
    for (const bank of banks) {
      const question = bank[round];
      if (!question) continue;

      const [prompt, correct, ...distractors] = question;
      questions.push({ prompt, correct, options: shuffle([correct, ...distractors]) });
      if (questions.length === count) return questions;
    }
  }

  return questions;
}
