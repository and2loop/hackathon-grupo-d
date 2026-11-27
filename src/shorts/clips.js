export const clips = [
  {
    title: 'Usa map para convertir datos en una lista',
    start: '01:20',
    code: '{tareas.map(t => (\n  <li>{t.texto}</li>\n))}',
    highlight: 'map',
    explanation: 'map devuelve un elemento JSX por cada tarea. Al renderizar esa lista, añade una key a cada elemento.',
  },
  {
    title: 'Cada elemento de una lista necesita una key',
    start: '03:12',
    code: '{tareas.map(t =>\n  <li key={t.id}>\n    {t.texto}\n  </li>\n)}',
    highlight: 'key={t.id}',
    explanation: 'La key permite que React reconozca la misma tarea cuando la lista cambia de orden.',
  },
  {
    title: 'La key debe ser única entre elementos hermanos',
    start: '04:28',
    code: '<ul>\n  <li key="a">Leer</li>\n  <li key="b">Probar</li>\n</ul>',
    highlight: 'key="b"',
    explanation: '«Leer» y «Probar» necesitan claves distintas dentro de la misma lista.',
  },
  {
    title: 'Usa un identificador que se mantenga al reordenar',
    start: '06:02',
    code: 'tareas.map(t => (\n  <Tarea key={t.id}\n    texto={t.texto} />\n))',
    highlight: 't.id',
    explanation: 'Usa el id de los datos. Si la tarea cambia de posición, conserva el mismo identificador.',
  },
  {
    title: 'Pasa el id como prop si el componente lo necesita',
    start: '08:10',
    code: '<Tarea\n  key={t.id}\n  id={t.id}\n/>',
    highlight: '  id={t.id}',
    explanation: 'React usa key para identificar el elemento. Pasa id como una prop propia para leerlo en Tarea.',
  },
];
