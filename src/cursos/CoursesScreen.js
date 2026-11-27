import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

const courses = [
  {
    title: 'React desde cero',
    progress: 62,
    summary: 'Lección 6 de 9',
    nextLesson: '2.3 Listas y keys',
  },
  {
    title: 'Git y GitHub en equipo',
    progress: 80,
    summary: 'Lección 4 de 5',
    nextLesson: '1.4 Resolver conflictos',
  },
  {
    title: 'Python para analizar datos',
    progress: 17,
    summary: 'Lección 2 de 12',
    nextLesson: '1.2 Listas y diccionarios',
  },
  {
    title: 'Ciberseguridad para todos',
    progress: 0,
    summary: 'Sin empezar',
    nextLesson: '1.1 Introducción a la ciberseguridad',
  },
];

const completedCourses = [
  { title: 'IA generativa', progress: 100, summary: '8 lecciones completadas' },
  { title: 'Excel avanzado', progress: 100, summary: '11 lecciones completadas' },
];

const ringRadius = 15;
const ringCircumference = 2 * Math.PI * ringRadius;

function CourseCard({ course, fonts, onPress }) {
  const { title, progress, summary } = course;

  return (
    <View style={styles.cell}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${summary}. ${progress} por ciento completado.`}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.ring}>
          <Svg width={52} height={52} viewBox="0 0 36 36" accessible={false} style={styles.ringGraphic}>
            <Circle cx={18} cy={18} r={ringRadius} fill="none" stroke={colors.line} strokeWidth={3.5} />
            {progress > 0 && (
              <Circle
                cx={18}
                cy={18}
                r={ringRadius}
                fill="none"
                stroke={colors.green}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={[ringCircumference * progress / 100, ringCircumference]}
                transform="rotate(-90 18 18)"
              />
            )}
          </Svg>
          <Text maxFontSizeMultiplier={1.5} style={[styles.percentage, fonts.bold]}>{progress}%</Text>
        </View>
        <Text style={[styles.courseTitle, fonts.bold]}>{title}</Text>
        <Text style={[styles.summary, fonts.regular]}>{summary}</Text>
      </Pressable>
    </View>
  );
}

export default function CoursesScreen({ fonts, onOpenDetail, onOpenLesson, onScrollToTop }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const visibleCourses = showCompleted ? completedCourses : courses;

  function openCourse({ title, summary, progress, nextLesson }) {
    const detail = { title, description: `${summary} · ${progress} % completado` };

    if (nextLesson) {
      detail.message = `Siguiente lección: ${nextLesson}`;
      detail.actions = [
        {
          label: 'Vídeo',
          onPress: () => onOpenLesson({
            title: nextLesson,
            description: title,
            message: 'La reproducción estará disponible cuando se incorpore el vídeo de esta lección.',
          }),
        },
        {
          label: 'Shorts',
          onPress: () => onOpenDetail({
            title: nextLesson,
            description: title,
            message: 'Los shorts estarán disponibles cuando se incorporen los clips de esta lección.',
          }),
        },
      ];
    }

    onOpenDetail(detail);
  }

  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={[styles.heading, fonts.bold]}>
        {showCompleted ? 'Cursos terminados' : 'Mis cursos'}
      </Text>

      <View style={styles.grid}>
        {visibleCourses.map((course) => (
          <CourseCard key={course.title} course={course} fonts={fonts} onPress={() => openCourse(course)} />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onScrollToTop();
          setShowCompleted(!showCompleted);
        }}
        style={({ pressed }) => [styles.listButton, pressed && styles.pressed]}
      >
        <Text style={[styles.listButtonText, fonts.bold]}>
          {showCompleted ? 'Volver a mis cursos' : `Ver cursos terminados (${completedCourses.length})`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  heading: {
    color: colors.ink, fontSize: 28, lineHeight: 31, letterSpacing: -0.56, marginTop: 8, marginBottom: 22,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, marginHorizontal: -6 },
  cell: { width: '50%', paddingHorizontal: 6 },
  card: { flex: 1, padding: 16, gap: 8, backgroundColor: colors.surface, borderRadius: 18 },
  ring: { alignSelf: 'flex-start', minWidth: 52, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  ringGraphic: { position: 'absolute', top: 0, left: 0 },
  percentage: { color: colors.ink, fontSize: 13.5, lineHeight: 18 },
  courseTitle: { color: colors.ink, fontSize: 15, lineHeight: 19 },
  summary: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  listButton: {
    minHeight: 48, marginTop: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5,
    borderColor: colors.line, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  listButtonText: { color: colors.ink, fontSize: 15, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
