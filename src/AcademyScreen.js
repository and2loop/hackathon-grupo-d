import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CoursesScreen from './cursos/CoursesScreen';
import HomeIcon from './inicio/HomeIcon';
import HomeScreen from './inicio/HomeScreen';
import LessonScreen from './leccion/LessonScreen';
import { resumeLesson } from './leccion/lesson';
import ProfileScreen from './perfil/ProfileScreen';
import ShortsScreen from './shorts/ShortsScreen';
import LessonTestScreen from './test-leccion/LessonTestScreen';
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
  const [lessonPage, setLessonPage] = useState(null);
  const [detail, setDetail] = useState(null);
  const [unread, setUnread] = useState(true);
  const showShorts = lessonPage === 'shorts';
  const headerColor = showShorts ? colors.white : colors.ink;

  const scrollToTop = useCallback(() => {
    scrollView.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const goBack = useCallback(() => {
    scrollToTop();
    setLessonPage(lessonPage === 'lesson' ? null : 'lesson');
  }, [lessonPage, scrollToTop]);

  useEffect(() => {
    if (!lessonPage || Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [lessonPage, goBack]);

  function openLessonPage(page) {
    scrollToTop();
    setDetail(null);
    setLessonPage(page);
  }

  function openVideo() {
    setDetail({
      title: 'Vídeo de la lección',
      description: resumeLesson.title,
      message: 'El vídeo de esta lección aún no está disponible. Puedes repasar los ejemplos en Shorts.',
      actions: [{ label: 'Abrir Shorts', onPress: () => openLessonPage('shorts') }],
    });
  }

  function reviewVideoPart({ topic, timestamp, explanation }) {
    setDetail({
      title: `Repaso · ${timestamp}`,
      description: topic,
      message: `${explanation}\n\nEl vídeo de esta lección aún no está disponible.`,
    });
  }

  function continueCourse() {
    setDetail({
      title: `Lección ${resumeLesson.nextNumber}`,
      description: resumeLesson.course,
      message: 'Has aprobado el test. La siguiente lección aún no está disponible en la demo.',
    });
  }

  function openNotifications() {
    setUnread(false);
    setDetail({
      title: 'Notificaciones',
      message: `Tienes una lección pendiente en ${resumeLesson.course}.`,
      actions: [{ label: 'Ver lección', onPress: () => openLessonPage('lesson') }],
    });
  }

  function openDestination(label) {
    if (label === 'Inicio' || label === 'Cursos' || label === 'Perfil') {
      scrollToTop();
      setLessonPage(null);
      setScreen(label);
      return;
    }

    setDetail({ title: label, message: 'Esta sección se incorporará cuando esté disponible.' });
  }

  const header = (
    <View style={styles.topBar}>
      {lessonPage && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={lessonPage === 'lesson' ? `Volver a ${screen}` : 'Volver a la lección'}
          onPress={goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
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
        style={({ pressed }) => [styles.notification, pressed && styles.pressed]}
      >
        <HomeIcon name="bell" color={headerColor} />
        {unread && <View style={[styles.notificationDot, showShorts && styles.darkNotificationDot]} />}
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.screen, showShorts && styles.shortsSurface]}>
      {showShorts ? (
        <>
          {header}
          <ShortsScreen
            fonts={fonts}
            lesson={resumeLesson}
            onOpenVideo={(clip) => reviewVideoPart({
              topic: clip.title, timestamp: clip.start, explanation: clip.explanation,
            })}
            onReviewClip={(clip) => setDetail({
              title: 'Repaso del clip', description: clip.title, message: clip.explanation,
            })}
          />
        </>
      ) : (
        <ScrollView ref={scrollView} contentContainerStyle={styles.scrollContent}>
          {header}
          {lessonPage === 'lesson' && (
            <LessonScreen
              lesson={resumeLesson}
              fonts={fonts}
              onOpenVideo={openVideo}
              onOpenShorts={() => openLessonPage('shorts')}
              onOpenTest={() => openLessonPage('test')}
            />
          )}
          {lessonPage === 'test' && (
            <LessonTestScreen
              lessonTitle={resumeLesson.title}
              nextLessonNumber={resumeLesson.nextNumber}
              fonts={fonts}
              onReview={reviewVideoPart}
              onClose={goBack}
              onContinue={continueCourse}
              onScrollToTop={scrollToTop}
            />
          )}
          {!lessonPage && screen === 'Cursos' && (
            <CoursesScreen
              fonts={fonts}
              onOpenDetail={setDetail}
              onOpenLesson={() => openLessonPage('lesson')}
              onOpenShorts={() => openLessonPage('shorts')}
              onScrollToTop={scrollToTop}
            />
          )}
          {!lessonPage && screen === 'Inicio' && (
            <HomeScreen fonts={fonts} onOpenDetail={setDetail} onOpenLesson={() => openLessonPage('lesson')} />
          )}
          {!lessonPage && screen === 'Perfil' && (
            <ProfileScreen fonts={fonts} onOpenDetail={setDetail} onOpenNotifications={openNotifications} />
          )}
        </ScrollView>
      )}

      <View accessibilityRole="tablist" style={styles.dock}>
        {destinations.map(({ label, icon }) => {
          const active = label === (lessonPage ? 'Cursos' : screen);

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  shortsSurface: { backgroundColor: colors.graphite },
  scrollContent: { paddingBottom: 106 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48 },
  brand: { fontSize: 19, letterSpacing: -0.19, color: colors.ink },
  back: {
    position: 'absolute', left: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  notification: {
    position: 'absolute', right: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
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
