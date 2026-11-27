import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import HomeIcon from './HomeIcon';

export const resumeLesson = {
  course: 'React desde cero',
  title: '2.3 Listas y keys',
  nextNumber: '2.4',
  elapsed: '03:12',
  duration: '09:40',
  progress: 33,
  remaining: 'te quedan 6 minutos',
};

export const resumeLessonDetail = {
  title: resumeLesson.title,
  description: `${resumeLesson.course} · ${resumeLesson.elapsed} / ${resumeLesson.duration}`,
  message: 'La reproducción estará disponible cuando se incorpore el vídeo de esta lección.',
};

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
        onPress={() => onOpenLesson(resumeLessonDetail)}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.videoPreview}>
          <View style={styles.greenCircle} />
          <View style={styles.cyanCircle} />
          <View style={styles.playButton}>
            <HomeIcon name="play" color={colors.ink} />
          </View>
          <Text style={[styles.timestamp, fonts.semibold]}>
            {resumeLesson.elapsed} / {resumeLesson.duration}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${resumeLesson.progress}%` }]} />
          </View>
        </View>
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
  videoPreview: {
    aspectRatio: 16 / 9, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.graphite, borderRadius: 18, overflow: 'hidden',
  },
  greenCircle: {
    position: 'absolute', top: -60, right: -40, width: 180, height: 180,
    borderRadius: 90, backgroundColor: colors.green, opacity: 0.18,
  },
  cyanCircle: {
    position: 'absolute', bottom: -50, left: -30, width: 120, height: 120,
    borderRadius: 60, backgroundColor: colors.cyan, opacity: 0.15,
  },
  playButton: {
    width: 54, height: 54, borderRadius: 27, paddingLeft: 3,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
  },
  timestamp: { position: 'absolute', bottom: 14, left: 12, color: colors.white, fontSize: 13 },
  progressTrack: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: '#FFFFFF40' },
  progressFill: { height: '100%', backgroundColor: colors.green },
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
