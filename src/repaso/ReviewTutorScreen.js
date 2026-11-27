import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';
import { initialMessages } from './reviewTutor';

export default function ReviewTutorScreen({ fonts, messages, videoTime, onSend, onOpenVideo, onOpenTests }) {
  const transcript = useRef(null);
  const [draft, setDraft] = useState('');
  const question = draft.trim();

  function sendQuestion() {
    if (!question) return;

    onSend(question);
    setDraft('');
  }

  return (
    <View style={styles.screen}>
      <View accessibilityRole="tablist" accessibilityLabel="Opciones de repaso" style={styles.segment}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: false }}
          onPress={onOpenTests}
          style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
        >
          <Text style={[styles.tabText, fonts.bold]}>Tests</Text>
        </Pressable>
        <View accessibilityRole="tab" accessibilityState={{ selected: true }} style={[styles.tab, styles.selectedTab]}>
          <Text style={[styles.tabText, styles.selectedTabText, fonts.bold]}>Tutor</Text>
        </View>
      </View>

      <ScrollView
        ref={transcript}
        style={styles.transcript}
        contentContainerStyle={styles.transcriptContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          if (messages.length > initialMessages.length) transcript.current?.scrollToEnd();
        }}
      >
        <View style={styles.messages} accessibilityLiveRegion="polite">
          {messages.map(({ author, text, video }, index) => {
            const student = author === 'student';

            return (
              <View key={index} style={[styles.bubble, student ? styles.studentBubble : styles.tutorBubble]}>
                <Text
                  accessibilityLabel={`${student ? 'Tú' : 'Tutor'}. ${text}`}
                  style={[styles.message, student && styles.studentMessage, fonts.regular]}
                >
                  {text}
                </Text>
                {video && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={onOpenVideo}
                    style={({ pressed }) => [styles.videoLink, pressed && styles.pressed]}
                  >
                    <HomeIcon name="play" size={16} color={colors.ink} filled={false} />
                    <Text style={[styles.videoLabel, fonts.bold]}>Ver {videoTime} en el vídeo</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Text style={[styles.privacy, fonts.regular]}>
        Los mensajes de la demo quedan en esta sesión.
      </Text>
      <View style={styles.composer}>
        <TextInput
          accessibilityLabel="Pregunta sobre el curso"
          placeholder="Pregunta sobre el curso"
          placeholderTextColor={colors.muted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={sendQuestion}
          returnKeyType="send"
          submitBehavior="submit"
          style={[styles.input, fonts.regular]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar pregunta"
          disabled={!question}
          hitSlop={4}
          onPress={sendQuestion}
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}
        >
          <HomeIcon name="send" size={18} color={colors.onGreen} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingBottom: 104 },
  segment: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 6, marginBottom: 12,
    padding: 4, borderRadius: 16, backgroundColor: colors.surface,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 39, padding: 8, borderRadius: 12 },
  selectedTab: { backgroundColor: colors.white, boxShadow: '0 1px 3px #0002' },
  tabText: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  selectedTabText: { color: colors.ink },
  transcript: { flex: 1 },
  transcriptContent: { paddingHorizontal: 20, paddingVertical: 12 },
  messages: { gap: 10 },
  bubble: { width: '84%', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18 },
  tutorBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface },
  studentBubble: { alignSelf: 'flex-end', backgroundColor: colors.ink },
  message: { color: colors.ink, fontSize: 15, lineHeight: 21 },
  studentMessage: { color: colors.white },
  videoLink: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99,
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line,
  },
  videoLabel: { flexShrink: 1, color: colors.ink, fontSize: 14, lineHeight: 18 },
  privacy: {
    marginHorizontal: 20, marginTop: 6, marginBottom: 14,
    color: colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center',
  },
  composer: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, paddingLeft: 15,
    paddingRight: 5, paddingVertical: 1.5, borderRadius: 99, borderWidth: 1.5, borderColor: colors.line,
    backgroundColor: colors.white,
  },
  input: { flex: 1, minHeight: 46, paddingHorizontal: 0, paddingVertical: 6, color: colors.ink, fontSize: 15 },
  send: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
