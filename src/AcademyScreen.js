import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HomeIcon from './inicio/HomeIcon';
import HomeScreen, { resumeLesson, resumeLessonDetail } from './inicio/HomeScreen';
import ReviewTutorScreen from './repaso/ReviewTutorScreen';
import { initialMessages, replyToQuestion } from './repaso/reviewTutor';
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
  const [messages, setMessages] = useState(initialMessages);
  const reviewing = screen === 'Repaso';

  function scrollToTop() {
    scrollView.current?.scrollTo({ y: 0, animated: false });
  }

  function openNotifications() {
    setUnread(false);
    setDetail({
      title: 'Notificaciones',
      message: `Tienes una lección pendiente en ${resumeLesson.course}.`,
      actions: [{ label: 'Ver lección', onPress: () => setDetail(resumeLessonDetail) }],
    });
  }

  function openDestination(label) {
    if (label === 'Inicio' || label === 'Repaso') {
      scrollToTop();
      setScreen(label);
      return;
    }

    setDetail({ title: label, message: 'Esta sección se incorporará cuando esté disponible.' });
  }

  function sendQuestion(question) {
    const reply = replyToQuestion(question);
    setMessages((previous) => [...previous, { author: 'student', text: question }, reply]);
  }

  const topBar = (
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
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={reviewing}
      style={styles.screen}
    >
      {reviewing ? (
        <>
          {topBar}
          <ReviewTutorScreen
            fonts={fonts}
            messages={messages}
            videoTime={resumeLesson.elapsed}
            onSend={sendQuestion}
            onOpenVideo={() => setDetail(resumeLessonDetail)}
            onOpenTests={() => setDetail({
              title: 'Tests de repaso',
              message: 'Los tests de repaso se incorporarán cuando estén disponibles en esta versión.',
            })}
          />
        </>
      ) : (
        <ScrollView ref={scrollView} contentContainerStyle={styles.scrollContent}>
          {topBar}
          <HomeScreen fonts={fonts} onOpenDetail={setDetail} />
        </ScrollView>
      )}

      <View accessibilityRole="tablist" style={styles.dock}>
        {destinations.map(({ label, icon }) => {
          const active = label === screen;

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
                <Text style={[styles.modalMessage, fonts.regular]}>{detail.message}</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  scrollContent: { paddingBottom: 106 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48 },
  brand: { fontSize: 19, letterSpacing: -0.19, color: colors.ink },
  notification: {
    position: 'absolute', right: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute', right: 9, top: 8, width: 13, height: 13, borderRadius: 7,
    backgroundColor: colors.cyan, borderWidth: 2, borderColor: colors.white,
  },
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
