import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';
import { generateQuestions, reviewCourses, sampleAttempts } from './reviewTests';

function resultDetail(attempt, fonts) {
  return {
    title: attempt.title,
    description: `${attempt.score}/${attempt.total} aciertos · ${attempt.date}`,
    message: attempt.mistakes.length === 0 ? 'Sin fallos' : undefined,
    content: attempt.mistakes.map(({ prompt, selected, correct }) => (
      <View key={prompt} style={styles.correction}>
        <Text style={[styles.label, fonts.bold]}>{prompt}</Text>
        <Text style={[styles.meta, fonts.regular]}>Tu respuesta: {selected}</Text>
        <Text style={[styles.label, fonts.semibold]}>Respuesta correcta: {correct}</Text>
      </View>
    )),
  };
}

function ReviewQuiz({ questions, fonts, onFinish }) {
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const question = questions[answers.length];
  const lastQuestion = answers.length + 1 === questions.length;

  function advance() {
    if (selected === null) return;

    const nextAnswers = [...answers, selected];
    if (lastQuestion) {
      const mistakes = questions.flatMap(({ prompt, correct }, index) => (
        nextAnswers[index] === correct ? [] : [{ prompt, correct, selected: nextAnswers[index] }]
      ));
      onFinish(mistakes);
      return;
    }

    setAnswers(nextAnswers);
    setSelected(null);
  }

  return (
    <>
      <Text accessibilityLiveRegion="polite" style={[styles.meta, fonts.regular]}>
        Pregunta {answers.length + 1} de {questions.length}
      </Text>
      <Text accessibilityRole="header" style={[styles.cardTitle, fonts.bold]}>{question.prompt}</Text>
      {question.options.map((option) => {
        const correct = selected !== null && option === question.correct;
        const incorrect = selected === option && !correct;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === option }}
            disabled={selected !== null}
            onPress={() => setSelected(option)}
            style={({ pressed }) => [styles.option, correct && styles.correct, incorrect && styles.incorrect, pressed && styles.pressed]}
          >
            <Text style={[styles.label, fonts.semibold]}>{option}</Text>
          </Pressable>
        );
      })}
      {selected !== null && (
        <Text accessibilityLiveRegion="polite" style={[styles.meta, fonts.regular]}>
          {selected === question.correct ? 'Respuesta correcta' : `Respuesta correcta: ${question.correct}`}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={selected === null}
        onPress={advance}
        style={({ pressed }) => [styles.action, selected === null && styles.disabled, pressed && styles.pressed]}
      >
        <Text style={[styles.actionText, fonts.bold]}>{lastQuestion ? 'Ver resultado' : 'Siguiente'}</Text>
      </Pressable>
    </>
  );
}

export default function ReviewTestsScreen({ fonts, attempts, onOpenDetail, onComplete }) {
  const [course, setCourse] = useState(reviewCourses[0]);
  const [lessonIds, setLessonIds] = useState(['2.2', '2.3']);
  const [preferredCount, setPreferredCount] = useState(10);
  const lessons = course.lessons.filter(({ id }) => lessonIds.includes(id));
  const availableQuestions = lessons.reduce((total, lesson) => total + lesson.questions.length, 0);
  const questionCount = availableQuestions >= 10 ? preferredCount : 5;
  const canGenerate = availableQuestions >= questionCount;

  function selectCourse(nextCourse) {
    if (nextCourse !== course) {
      setCourse(nextCourse);
      setLessonIds([nextCourse.lessons[0].id]);
    }
    onOpenDetail(null);
  }

  function toggleLesson(id) {
    setLessonIds((previous) => (
      previous.includes(id) ? previous.filter((key) => key !== id) : [...previous, id]
    ));
  }

  function startTest() {
    const questions = generateQuestions(lessons, questionCount);
    const title = `Repaso de ${lessons.map(({ id }) => id).join(', ')}`;

    function finishTest(mistakes) {
      const attempt = {
        id: attempts.length + 1,
        title,
        date: 'Hoy',
        total: questions.length,
        score: questions.length - mistakes.length,
        summary: mistakes.length ? `${mistakes.length} ${mistakes.length === 1 ? 'fallo' : 'fallos'}` : 'Sin fallos',
        mistakes,
      };
      onComplete(attempt);
      onOpenDetail(resultDetail(attempt, fonts));
    }

    onOpenDetail({
      title: 'Test de repaso',
      description: `${course.title} · ${title}`,
      content: <ReviewQuiz questions={questions} fonts={fonts} onFinish={finishTest} />,
    });
  }

  return (
    <View style={styles.content}>
      <View accessibilityRole="tablist" style={styles.segment}>
        <Pressable accessibilityRole="tab" aria-selected={true} style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.label, fonts.bold]}>Tests</Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          aria-selected={false}
          onPress={() => onOpenDetail({ title: 'Tutor', message: 'El tutor digital estará disponible en una próxima versión.' })}
          style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
        >
          <Text style={[styles.label, styles.muted, fonts.bold]}>Tutor</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text accessibilityRole="header" style={[styles.cardTitle, fonts.bold]}>Nuevo test de repaso</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Curso: ${course.title}`}
          onPress={() => onOpenDetail({
            title: 'Elegir curso',
            actions: reviewCourses.map((item) => ({ label: item.title, onPress: () => selectCourse(item) })),
          })}
          style={({ pressed }) => [styles.field, pressed && styles.pressed]}
        >
          <Text style={[styles.label, styles.fieldText, fonts.semibold]}>{course.title}</Text>
          <HomeIcon name="down" color={colors.muted} size={18} />
        </Pressable>

        <View style={styles.chips}>
          {course.lessons.map(({ id, title }) => {
            const checked = lessonIds.includes(id);

            return (
              <Pressable
                key={id}
                accessibilityRole="checkbox"
                accessibilityLabel={`${id} ${title}`}
                aria-checked={checked}
                onPress={() => toggleLesson(id)}
                onKeyDown={Platform.OS === 'web' ? (event) => {
                  if (event.key !== ' ') return;

                  event.preventDefault();
                  if (!event.repeat) toggleLesson(id);
                } : undefined}
                style={({ pressed }) => [styles.chip, checked && styles.selectedChip, pressed && styles.pressed]}
              >
                <Text style={[styles.chipText, fonts.bold, checked && styles.selectedText]}>{id}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityHint="Elegir el número de preguntas"
          disabled={availableQuestions < 10}
          onPress={() => onOpenDetail({
            title: 'Número de preguntas',
            actions: [5, 10].map((count) => ({
              label: `${count} preguntas`,
              onPress: () => {
                setPreferredCount(count);
                onOpenDetail(null);
              },
            })),
          })}
          style={({ pressed }) => [styles.chip, styles.count, pressed && styles.pressed]}
        >
          <Text style={[styles.chipText, fonts.bold]}>{questionCount} preguntas</Text>
        </Pressable>

        {!canGenerate && (
          <Text accessibilityLiveRegion="polite" style={[styles.meta, fonts.regular]}>
            Selecciona al menos una lección.
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          disabled={!canGenerate}
          onPress={startTest}
          style={({ pressed }) => [styles.action, !canGenerate && styles.disabled, pressed && styles.pressed]}
        >
          <HomeIcon name="spark" color={colors.onGreen} />
          <Text style={[styles.actionText, fonts.bold]}>Generar test</Text>
        </Pressable>
      </View>

      <Text accessibilityRole="header" style={[styles.sectionTitle, fonts.bold]}>Tests anteriores</Text>
      {[...attempts, ...sampleAttempts].map((attempt) => {
        const perfect = attempt.score === attempt.total;
        const summary = `${attempt.date}${attempt.date.endsWith('.') ? ' ' : '. '}${attempt.summary}`;

        return (
          <Pressable
            key={attempt.id}
            accessibilityRole="button"
            accessibilityLabel={`${attempt.title}, ${attempt.score} de ${attempt.total} aciertos. ${summary}`}
            onPress={() => onOpenDetail(resultDetail(attempt, fonts))}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={[styles.score, perfect && styles.correct]}>
              <Text style={[styles.label, styles.scoreText, fonts.extraBold]}>{attempt.score}/{attempt.total}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.label, fonts.semibold]}>{attempt.title}</Text>
              <Text style={[styles.meta, fonts.regular]}>{summary}</Text>
            </View>
            <HomeIcon name="chevron" color={colors.muted} size={18} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  segment: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16,
    padding: 4, marginTop: 6, marginBottom: 24,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 39, borderRadius: 12 },
  activeTab: { backgroundColor: colors.white, boxShadow: '0 1px 3px #0002' },
  muted: { color: colors.muted },
  card: { padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  cardTitle: { color: colors.ink, fontSize: 17, lineHeight: 24 },
  label: { color: colors.ink, fontSize: 15, lineHeight: 21 },
  field: {
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', minHeight: 46, paddingHorizontal: 14, paddingVertical: 6,
    marginTop: 12, marginBottom: 10, gap: 8,
  },
  fieldText: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 99, borderWidth: 1.5, borderColor: colors.line, paddingHorizontal: 11, paddingVertical: 5 },
  chipText: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  selectedChip: { backgroundColor: colors.ink, borderColor: colors.ink },
  selectedText: { color: colors.white },
  count: { alignSelf: 'flex-start', marginTop: 6, marginBottom: 14 },
  action: {
    minHeight: 48, borderRadius: 14, backgroundColor: colors.green, padding: 8,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
  },
  disabled: { opacity: 0.45 },
  actionText: { color: colors.onGreen, fontSize: 15, lineHeight: 21, textAlign: 'center' },
  pressed: { opacity: 0.7 },
  sectionTitle: {
    color: colors.ink, fontSize: 18, lineHeight: 25, letterSpacing: -0.18, marginTop: 24, marginBottom: 10,
  },
  row: {
    flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  score: {
    minWidth: 48, minHeight: 48, paddingHorizontal: 4, borderRadius: 12,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  scoreText: { fontVariant: ['tabular-nums'] },
  rowText: { flex: 1, gap: 2 },
  meta: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  option: { padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: colors.line },
  correct: { backgroundColor: colors.green, borderColor: colors.green },
  incorrect: { borderColor: '#E5484D' },
  correction: { padding: 12, gap: 4, borderRadius: 12, backgroundColor: colors.surface },
});
