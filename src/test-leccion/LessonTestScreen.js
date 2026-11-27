import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';
import { lessonQuestions } from './questions';

const errorColor = '#E5484D';

function TestButton({ children, fonts, onPress, secondary }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, pressed && styles.pressed]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText, fonts.bold]}>{children}</Text>
    </Pressable>
  );
}

export default function LessonTestScreen({
  lessonTitle, nextLessonNumber, fonts, onReview, onClose, onContinue, onScrollToTop,
}) {
  const [responses, setResponses] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = lessonQuestions[questionIndex];
  const selected = responses[questionIndex];
  const answered = selected !== undefined;
  const correct = answered && selected === question?.correct;
  const score = responses.filter((answer, index) => answer === lessonQuestions[index].correct).length;
  const passed = score === lessonQuestions.length;

  function selectOption(option) {
    setResponses((previous) => previous.length === questionIndex ? [...previous, option] : previous);
  }

  function nextQuestion() {
    setQuestionIndex((current) => current === questionIndex ? current + 1 : current);
    onScrollToTop();
  }

  function retry() {
    setResponses([]);
    setQuestionIndex(0);
    onScrollToTop();
  }

  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={[styles.title, fonts.bold]}>Test de la lección</Text>
      <Text style={[styles.muted, fonts.regular]}>{lessonTitle}</Text>

      {question ? (
        <View style={styles.body}>
          {answered && (
            <View style={[styles.feedback, correct && styles.correctFeedback]}>
              {!correct && <HomeIcon name="playOutline" size={20} color={errorColor} />}
              <Text accessibilityLiveRegion="polite" style={[styles.feedbackText, fonts.semibold]}>
                {correct ? 'Respuesta correcta.' : `Incorrecta. Repasa el vídeo desde el ${question.timestamp}.`}
              </Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={[styles.muted, fonts.regular]}>Pregunta {questionIndex + 1} de {lessonQuestions.length}</Text>
            <Text accessibilityRole="header" style={[styles.prompt, fonts.bold]}>{question.prompt}</Text>
            <View style={styles.options}>
              {question.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isCorrect = answered && index === question.correct;
                const isIncorrect = answered && !correct && index === selected;
                const status = isCorrect ? ', respuesta correcta' : isIncorrect ? ', respuesta incorrecta' : '';

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityLabel={`${letter}. ${option}${status}`}
                    accessibilityState={{ disabled: answered, selected: index === selected }}
                    disabled={answered}
                    onPress={() => selectOption(index)}
                    style={({ pressed }) => [
                      styles.option,
                      isCorrect && styles.correctOption,
                      isIncorrect && styles.incorrectOption,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.letter, isCorrect && styles.correctLetter]}>
                      <Text style={[styles.letterText, fonts.extraBold]}>{letter}</Text>
                    </View>
                    <Text style={[styles.optionText, fonts.semibold]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {answered && (
            <View style={styles.actions}>
              {!correct && (
                <TestButton fonts={fonts} secondary onPress={() => onReview(question)}>
                  Ver {question.timestamp}
                </TestButton>
              )}
              <TestButton fonts={fonts} onPress={nextQuestion}>
                {questionIndex + 1 === lessonQuestions.length ? 'Ver resultado' : 'Siguiente'}
              </TestButton>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.body}>
          <View style={styles.card}>
            <Text accessibilityRole="header" style={[styles.result, fonts.bold]}>Resultado del test</Text>
            <Text accessibilityLiveRegion="polite" style={[styles.muted, fonts.regular]}>
              {score} de {lessonQuestions.length} respuestas correctas
            </Text>
            {passed && (
              <Text style={[styles.resultMessage, fonts.regular]}>Ya puedes pasar a la lección {nextLessonNumber}.</Text>
            )}
          </View>

          <View style={styles.actions}>
            <TestButton fonts={fonts} secondary onPress={passed ? onClose : retry}>
              {passed ? 'Volver a la lección' : 'Repetir el test'}
            </TestButton>
            <TestButton fonts={fonts} onPress={passed ? onContinue : onClose}>
              {passed ? `Ir a la lección ${nextLessonNumber}` : 'Volver a la lección'}
            </TestButton>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 31, letterSpacing: -0.56, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  body: { marginTop: 26 },
  feedback: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E5484D21',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
  },
  correctFeedback: { backgroundColor: '#39FE9026' },
  feedbackText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21 },
  card: { padding: 16, backgroundColor: colors.surface, borderRadius: 18 },
  prompt: { color: colors.ink, fontSize: 20, lineHeight: 24, letterSpacing: -0.2, marginTop: 4, marginBottom: 14 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: colors.white, borderRadius: 14, borderWidth: 2, borderColor: colors.line, minHeight: 56,
  },
  correctOption: { backgroundColor: colors.green, borderColor: colors.green },
  incorrectOption: { borderColor: errorColor },
  letter: {
    backgroundColor: colors.line, width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  correctLetter: { backgroundColor: '#10231A2E' },
  letterText: { color: colors.ink, fontSize: 13, lineHeight: 18 },
  optionText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  button: {
    flex: 1, minHeight: 48, paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.green, borderRadius: 14,
  },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  buttonText: { textAlign: 'center', color: colors.onGreen, fontSize: 15, lineHeight: 21 },
  secondaryText: { color: colors.ink },
  result: { color: colors.ink, fontSize: 20, lineHeight: 24, marginBottom: 4 },
  resultMessage: { color: colors.ink, fontSize: 15, lineHeight: 21, marginTop: 12 },
  pressed: { opacity: 0.7 },
});
