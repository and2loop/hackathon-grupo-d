import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HomeIcon from './HomeIcon';

const colors = {
  white: '#FFFFFF',
  ink: '#16191A',
  muted: '#5F6768',
  line: '#E2E6E6',
  graphite: '#1F2222',
  green: '#39FE90',
  onGreen: '#10231A',
  cyan: '#1CF9FC',
  onCyan: '#0B2A2B',
};

const lesson = {
  course: 'React desde cero',
  title: '2.3 Listas y keys',
  elapsed: '03:12',
  duration: '09:40',
  progress: 33,
  remaining: 'te quedan 6 minutos',
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

const destinations = [
  { label: 'Inicio', icon: 'home' },
  { label: 'Cursos', icon: 'book' },
  { label: 'Repaso', icon: 'review' },
  { label: 'Perfil', icon: 'user' },
];

const onest = {
  regular: { fontFamily: 'Onest_400Regular' },
  semibold: { fontFamily: 'Onest_600SemiBold' },
  bold: { fontFamily: 'Onest_700Bold' },
  extraBold: { fontFamily: 'Onest_800ExtraBold' },
};

const system = {
  regular: { fontWeight: '400' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

export default function HomeScreen({ useOnest }) {
  const scrollView = useRef(null);
  const [detail, setDetail] = useState(null);
  const [unread, setUnread] = useState(true);
  const fonts = useOnest ? onest : system;

  function openLesson() {
    setDetail({
      title: lesson.title,
      description: `${lesson.course} · ${lesson.elapsed} / ${lesson.duration}`,
      message: 'La reproducción estará disponible cuando se incorpore el vídeo de esta lección.',
    });
  }

  function openNotifications() {
    setUnread(false);
    setDetail({
      title: 'Notificaciones',
      message: `Tienes una lección pendiente en ${lesson.course}.`,
      action: { label: 'Ver lección', onPress: openLesson },
    });
  }

  function openDestination(label) {
    if (label === 'Inicio') {
      scrollView.current?.scrollTo({ y: 0 });
      return;
    }

    setDetail({ title: label, message: 'Esta sección se incorporará cuando esté disponible.' });
  }

  return (
    <View style={styles.screen}>
      <ScrollView ref={scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Text style={[styles.brand, fonts.regular]} accessibilityLabel="480 Academy">
            <Text style={fonts.extraBold}>480</Text>Academy
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
            accessibilityHint={unread ? 'Tienes una notificación pendiente' : undefined}
            onPress={openNotifications}
            style={({ pressed }) => [styles.notification, pressed && styles.pressed]}
          >
            <HomeIcon name="bell" color={colors.ink} />
            {unread && <View style={styles.notificationDot} />}
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text accessibilityRole="header" style={[styles.greeting, fonts.bold]}>
            Hola, Lucía
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Continuar ${lesson.course}`}
            accessibilityHint={`${lesson.title}, ${lesson.remaining}`}
            onPress={openLesson}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <View style={styles.videoPreview}>
              <View style={styles.greenCircle} />
              <View style={styles.cyanCircle} />
              <View style={styles.playButton}>
                <HomeIcon name="play" color={colors.ink} />
              </View>
              <Text style={[styles.timestamp, fonts.semibold]}>
                {lesson.elapsed} / {lesson.duration}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
              </View>
            </View>
            <Text style={[styles.lessonTitle, fonts.bold]}>Continuar {lesson.course}</Text>
            <Text style={[styles.lessonMeta, fonts.regular]}>
              {lesson.title}, {lesson.remaining}
            </Text>
          </Pressable>

          <Text accessibilityRole="header" style={[styles.sectionTitle, fonts.bold]}>
            Novedades
          </Text>
          {courses.map((course) => (
            <Pressable
              key={course.title}
              accessibilityRole="button"
              onPress={() => setDetail({
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
      </ScrollView>

      <View accessibilityRole="tablist" style={styles.dock}>
        {destinations.map(({ label, icon }) => {
          const active = label === 'Inicio';

          return (
            <Pressable
              key={icon}
              accessibilityRole="tab"
              accessibilityLabel={label}
              aria-selected={active}
              onPress={() => openDestination(label)}
              style={({ pressed }) => [styles.dockItem, pressed && styles.pressed]}
            >
              <View style={active && styles.activeIcon}>
                <HomeIcon name={icon} size={active ? 24 : 22} color={active ? colors.onGreen : colors.muted} />
              </View>
            </Pressable>
          );
        })}
      </View>

      {detail && (
        <Modal transparent animationType="fade" onRequestClose={() => setDetail(null)}>
          <View style={styles.modalBackdrop}>
            <View accessibilityViewIsModal style={styles.modalPanel}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text accessibilityRole="header" style={[styles.modalTitle, fonts.bold]}>
                  {detail.title}
                </Text>
                {detail.description && (
                  <Text style={[styles.lessonMeta, fonts.regular]}>{detail.description}</Text>
                )}
                <Text style={[styles.modalMessage, fonts.regular]}>{detail.message}</Text>
                {detail.action && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={detail.action.onPress}
                    style={({ pressed }) => [styles.modalAction, pressed && styles.pressed]}
                  >
                    <Text style={[styles.modalActionText, fonts.bold]}>{detail.action.label}</Text>
                  </Pressable>
                )}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDetail(null)}
                  style={({ pressed }) => [styles.modalClose, pressed && styles.pressed]}
                >
                  <Text style={[styles.courseTitle, fonts.bold]}>Cerrar</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  scrollContent: { paddingBottom: 106 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48 },
  brand: { fontSize: 19, letterSpacing: -0.19, color: colors.ink },
  notification: { position: 'absolute', right: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  notificationDot: {
    position: 'absolute', right: 9, top: 8, width: 13, height: 13, borderRadius: 7,
    backgroundColor: colors.cyan, borderWidth: 2, borderColor: colors.white,
  },
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
  dock: {
    position: 'absolute', bottom: 22, alignSelf: 'center', flexDirection: 'row', gap: 4,
    padding: 6, borderRadius: 99, backgroundColor: colors.white,
    boxShadow: '0 6px 24px #16191A26, 0 0 0 1px #16191A0D',
  },
  dockItem: { alignItems: 'center', justifyContent: 'center', width: 56, height: 52 },
  activeIcon: { alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 21, backgroundColor: colors.green },
  pressed: { opacity: 0.7 },
  modalBackdrop: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#16191A66' },
  modalPanel: { width: '100%', maxWidth: 400, maxHeight: '100%', borderRadius: 18, backgroundColor: colors.white },
  modalContent: { padding: 20, gap: 10 },
  modalTitle: { color: colors.ink, fontSize: 22, lineHeight: 28 },
  modalMessage: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  modalAction: { backgroundColor: colors.green, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modalActionText: { color: colors.onGreen, fontSize: 15 },
  modalClose: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
