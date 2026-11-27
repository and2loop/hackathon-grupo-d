const keyExplanation = {
  author: 'tutor',
  text: 'La key le dice a React qué elemento es cuál cuando la lista cambia, así no los repinta todos.',
  video: true,
};

export const initialMessages = [
  { author: 'tutor', text: 'Fallaste la pregunta sobre la prop key. ¿La repasamos?' },
  { author: 'student', text: 'Sí, no entiendo para qué sirve' },
  keyExplanation,
];

export function replyToQuestion(question) {
  const text = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const aboutKeys = /\b(keys?|listas?|map)\b/.test(text);
  const exampleFollowUp = /^[¿¡]?(?:(?:ponme|dame|me pones)\s+)?(?:un\s+)?ejemplo[?.!\s]*$/.test(text);

  if (exampleFollowUp || (aboutKeys && /\b(ejemplos?|indices?|id)\b/.test(text))) {
    return {
      author: 'tutor',
      text: 'Si cada tarea tiene un id, usa <li key={tarea.id}> al dibujar la lista. Aunque cambie el orden, React podrá reconocer cada tarea por su id.',
      video: true,
    };
  }

  if (aboutKeys) return keyExplanation;

  if (/\b(plataforma|480 ?academy|mi progreso|mis cursos|donde (?:veo|encuentro) (?:el |mi |los )?(?:curso|test|video))\b/.test(text)) {
    return {
      author: 'tutor',
      text: 'Desde Inicio puedes retomar tu última lección. En Repaso puedes revisar dudas como la de listas y keys.',
    };
  }

  return {
    author: 'tutor',
    text: 'En esta demo puedo ayudarte con listas y keys de React o con la navegación de 480 Academy.',
  };
}
