import { useEffect, useRef, useState } from 'react';
import { BackHandler, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoursesScreen from './cursos/CoursesScreen';
import HomeIcon from './inicio/HomeIcon';
import HomeScreen, { resumeLesson, resumeLessonDetail } from './inicio/HomeScreen';
import ShortsScreen from './shorts/ShortsScreen';
import { colors } from './theme';

const destinations = [
  { label: 'Inicio', icon: 'home' },
  { label: 'Cursos', icon: 'book' },
  { label: 'Repaso', icon: 'review' },
  { label: 'Perfil', icon: 'user' },
];

export default function AcademyScreen({ fonts }) {
  const scrollView = useRef(null);
  const [screen, setScreen] = useState('Inicio');
  const [detail, setDetail] = useState(null);
  const [unread, setUnread] = useState(true);
  const [showShorts, setShowShorts] = useState(false);
  const headerColor = showShorts ? colors.white : colors.ink;

  useEffect(() => {
    if (!showShorts) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowShorts(false);
      return true;
    });
    return () => subscription.remove();
  }, [showShorts]);

  function scrollToTop() {
    scrollView.current?.scrollTo({ y: 0, animated: false });
  }

  function openNotifications() {
    setUnread(false);
    setDetail({
      title: 'Notificaciones',
      message: `Tienes una lección pendiente en ${resumeLesson.course}.`,
      actions: [{ label: 'Ver lección', onPress: () => openHomeDetail(resumeLessonDetail) }],
    });
  }

  function openDestination(label) {
    if (label === 'Inicio' || label === 'Cursos') {
      setShowShorts(false);
      scrollToTop();
      setScreen(label);
      return;
    }

    setDetail({ title: label, message: 'Esta sección se incorporará cuando esté disponible.' });
  }

  function openShorts(course, lesson) {
    if (course !== resumeLesson.course || lesson !== resumeLesson.title) {
      setDetail({
        title: lesson,
        description: course,
        message: 'Los shorts de esta lección estarán disponibles cuando se incorporen al catálogo.',
      });
      return;
    }

    setDetail(null);
    setShowShorts(true);
  }

  function openHomeDetail(nextDetail) {
    if (nextDetail === resumeLessonDetail) {
      setDetail({
        ...nextDetail,
        actions: [{ label: 'Ver en shorts', onPress: () => openShorts(resumeLesson.course, resumeLesson.title) }],
      });
      return;
    }

    setDetail(nextDetail);
  }

  function openClipVideo(clip) {
    setDetail({
      ...resumeLessonDetail,
      description: `${resumeLesson.course} · ${clip.start} / ${resumeLesson.duration}`,
    });
  }

  function askClipTutor(clip) {
    setDetail({
      title: 'Tutor de repaso',
      description: clip.title,
      message: clip.explanation,
      actions: [{ label: `Ver ${clip.start} en el vídeo`, onPress: () => openClipVideo(clip) }],
    });
  }

  const header = (
    <View style={styles.topBar}>
      {showShorts && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => setShowShorts(false)}
          style={({ pressed }) => [styles.headerButton, styles.back, pressed && styles.pressed]}
        >
          <HomeIcon name="back" color={headerColor} />
        </Pressable>
      )}
      <Text style={[styles.brand, { color: headerColor }, fonts.regular]} accessibilityLabel="480 Academy">
        <Text style={fonts.extraBold}>480</Text>Academy
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notificaciones"
        accessibilityHint={unread ? 'Tienes una notificación pendiente' : undefined}
        onPress={openNotifications}
        style={({ pressed }) => [styles.headerButton, styles.notification, pressed && styles.pressed]}
      >
        <HomeIcon name="bell" color={headerColor} />
        {unread && <View style={[styles.notificationDot, showShorts && styles.darkNotificationDot]} />}
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, showShorts && styles.darkSurface]}>
      <StatusBar barStyle={showShorts ? 'light-content' : 'dark-content'} />
      <ScrollView ref={scrollView} style={showShorts && styles.hidden} contentContainerStyle={styles.scrollContent}>
        {!showShorts && header}

        {screen === 'Cursos' ? (
          <CoursesScreen fonts={fonts} onOpenDetail={setDetail} onOpenShorts={openShorts} onScrollToTop={scrollToTop} />
        ) : (
          <HomeScreen fonts={fonts} onOpenDetail={openHomeDetail} />
        )}
      </ScrollView>

      {showShorts && (
        <View style={styles.shortsSurface}>
          {header}
          <ShortsScreen fonts={fonts} lesson={resumeLesson} onOpenVideo={openClipVideo} onAskTutor={askClipTutor} />
        </View>
      )}

      <View accessibilityRole="tablist" style={styles.dock}>
        {destinations.map(({ label, icon }) => {
          const active = label === (showShorts ? 'Cursos' : screen);

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
                  <Text style={[styles.modalDescription, fonts.regular]}>{detail.description}</Text>
                )}
                {detail.message && (
                  <Text style={[styles.modalMessage, fonts.regular]}>{detail.message}</Text>
                )}
                {detail.actions?.map(({ label, onPress }) => (
                  <Pressable
                    key={label}
                    accessibilityRole="button"
                    onPress={onPress}
                    style={({ pressed }) => [styles.modalAction, pressed && styles.pressed]}
                  >
                    <Text style={[styles.modalActionText, fonts.bold]}>{label}</Text>
                  </Pressable>
                ))}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDetail(null)}
                  style={({ pressed }) => [styles.modalClose, pressed && styles.pressed]}
                >
                  <Text style={[styles.modalCloseText, fonts.bold]}>Cerrar</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: colors.white },
  darkSurface: { backgroundColor: colors.graphite },
  hidden: { display: 'none' },
  shortsSurface: { flex: 1 },
  scrollContent: { paddingBottom: 106 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48 },
  brand: { fontSize: 19, letterSpacing: -0.19 },
  headerButton: {
    position: 'absolute', width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  back: { left: 12 },
  notification: { right: 12 },
  notificationDot: {
    position: 'absolute', right: 9, top: 8, width: 13, height: 13, borderRadius: 7,
    backgroundColor: colors.cyan, borderWidth: 2, borderColor: colors.white,
  },
  darkNotificationDot: { borderColor: colors.graphite },
  dock: {
    position: 'absolute', bottom: 22, alignSelf: 'center', flexDirection: 'row', gap: 4,
    padding: 6, borderRadius: 99, backgroundColor: colors.white,
    boxShadow: '0 6px 24px #16191A26, 0 0 0 1px #16191A0D',
  },
  dockItem: { alignItems: 'center', justifyContent: 'center', width: 56, height: 52 },
  activeIcon: {
    alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.green,
  },
  pressed: { opacity: 0.7 },
  modalBackdrop: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#16191A66' },
  modalPanel: { width: '100%', maxWidth: 400, maxHeight: '100%', borderRadius: 18, backgroundColor: colors.white },
  modalContent: { padding: 20, gap: 10 },
  modalTitle: { color: colors.ink, fontSize: 22, lineHeight: 28 },
  modalDescription: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  modalMessage: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  modalAction: {
    backgroundColor: colors.green, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  modalActionText: { color: colors.onGreen, fontSize: 15 },
  modalClose: {
    minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseText: { color: colors.ink, fontSize: 15, lineHeight: 21 },
});
