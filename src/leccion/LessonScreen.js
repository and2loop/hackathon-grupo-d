import { Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';
import LessonVideoPreview from './LessonVideoPreview';

export default function LessonScreen({ lesson, fonts, onOpenVideo, onOpenShorts, onOpenTest }) {
  const actions = [
    {
      label: 'Vídeo', icon: 'playOutline', summary: lesson.duration.replace(/^0/, ''), onPress: onOpenVideo,
    },
    { label: 'Shorts', icon: 'film', summary: `${lesson.clips} clips`, onPress: onOpenShorts },
    { label: 'Test', icon: 'review', summary: `${lesson.questions} preguntas`, onPress: onOpenTest },
  ];

  return (
    <View style={styles.content}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir el vídeo de la lección"
        onPress={onOpenVideo}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <LessonVideoPreview lesson={lesson} fonts={fonts} />
      </Pressable>

      <Text accessibilityRole="header" style={[styles.title, fonts.bold]}>{lesson.title}</Text>
      <Text style={[styles.meta, fonts.regular]}>{lesson.course}, módulo {lesson.moduleNumber}</Text>

      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable
            key={action.icon}
            accessibilityRole="button"
            accessibilityLabel={`${action.label}, ${action.summary}`}
            onPress={action.onPress}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <HomeIcon name={action.icon} color={colors.greenText} />
            <Text style={[styles.actionLabel, fonts.bold]}>{action.label}</Text>
            <Text style={[styles.actionSummary, fonts.regular]}>{action.summary}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.testCard}>
        <Text accessibilityRole="header" style={[styles.testTitle, fonts.bold]}>¿Ya sabes esto?</Text>
        <Text style={[styles.testDescription, fonts.regular]}>
          Haz el test antes de ver la lección. Si lo apruebas, pasas a la {lesson.nextNumber}.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenTest}
          style={({ pressed }) => [styles.testButton, pressed && styles.pressed]}
        >
          <Text style={[styles.testButtonLabel, fonts.bold]}>Hacer el test para saltarla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 10 },
  title: {
    color: colors.ink, fontSize: 22, lineHeight: 25, letterSpacing: -0.22, marginTop: 14, marginBottom: 2,
  },
  meta: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginVertical: 14 },
  action: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, paddingHorizontal: 6,
    backgroundColor: colors.surface, borderRadius: 18,
  },
  actionLabel: { color: colors.ink, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  actionSummary: { color: colors.muted, fontSize: 12.5, lineHeight: 18, textAlign: 'center' },
  testCard: { padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  testTitle: { color: colors.ink, fontSize: 17, lineHeight: 24 },
  testDescription: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 14 },
  testButton: {
    justifyContent: 'center', alignItems: 'center', minHeight: 48, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.line,
  },
  testButtonLabel: { color: colors.ink, fontSize: 15, lineHeight: 21, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
