import { Pressable, StyleSheet, Text, View } from 'react-native';
import LessonVideoPreview from '../leccion/LessonVideoPreview';
import { resumeLesson } from '../leccion/lesson';
import { colors } from '../theme';
import HomeIcon from './HomeIcon';

const courses = [
  {
    title: 'Ciberseguridad para todos',
    description: '10 lecciones, nivel inicial',
    icon: 'shield',
    background: colors.cyan,
    foreground: colors.onCyan,
  },
  {
    title: 'Python para analizar datos',
    description: '12 lecciones, con test inicial',
    icon: 'chart',
    background: colors.ink,
    foreground: colors.white,
  },
];

export default function HomeScreen({ fonts, onOpenDetail, onOpenLesson }) {
  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={[styles.greeting, fonts.bold]}>
        Hola, Lucía
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Continuar ${resumeLesson.course}`}
        accessibilityHint={`${resumeLesson.title}, ${resumeLesson.remaining}`}
        onPress={onOpenLesson}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <LessonVideoPreview lesson={resumeLesson} fonts={fonts} />
        <Text style={[styles.lessonTitle, fonts.bold]}>Continuar {resumeLesson.course}</Text>
        <Text style={[styles.lessonMeta, fonts.regular]}>
          {resumeLesson.title}, {resumeLesson.remaining}
        </Text>
      </Pressable>

      <Text accessibilityRole="header" style={[styles.sectionTitle, fonts.bold]}>
        Novedades
      </Text>
      {courses.map((course) => (
        <Pressable
          key={course.title}
          accessibilityRole="button"
          onPress={() => onOpenDetail({
            title: course.title,
            description: course.description,
            message: 'El contenido del curso estará disponible cuando se incorpore al catálogo.',
          })}
          style={({ pressed }) => [styles.courseRow, pressed && styles.pressed]}
        >
          <View style={[styles.courseIcon, { backgroundColor: course.background }]}>
            <HomeIcon name={course.icon} size={24} color={course.foreground} />
          </View>
          <View style={styles.courseText}>
            <Text style={[styles.courseTitle, fonts.semibold]}>{course.title}</Text>
            <Text style={[styles.courseMeta, fonts.regular]}>{course.description}</Text>
          </View>
          <HomeIcon name="chevron" size={18} color={colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  greeting: { color: colors.ink, fontSize: 28, lineHeight: 31, letterSpacing: -0.56, marginTop: 8, marginBottom: 14 },
  lessonTitle: { color: colors.ink, fontSize: 19, lineHeight: 22, letterSpacing: -0.19, marginTop: 14, marginBottom: 2 },
  lessonMeta: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: colors.ink, fontSize: 18, lineHeight: 25, letterSpacing: -0.18, marginTop: 24, marginBottom: 10 },
  courseRow: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  courseIcon: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  courseText: { flex: 1 },
  courseTitle: { fontSize: 15, lineHeight: 21, color: colors.ink },
  courseMeta: { fontSize: 13, lineHeight: 18, marginTop: 2, color: colors.muted },
  pressed: { opacity: 0.7 },
});
