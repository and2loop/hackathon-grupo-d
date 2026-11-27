import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';
import { clips } from './clips';

const monospace = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, monospace' });

function ClipPage({ clip, fonts, height, active }) {
  const [before, after] = clip.code.split(clip.highlight);
  const compact = height < 500;

  return (
    <View
      aria-hidden={!active}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      style={[styles.page, { height, paddingTop: Math.min(56, height * 0.1) }]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.caption, compact && styles.compactCaption, { minHeight: Math.min(138, height * 0.2) }, fonts.bold]}
      >
        {clip.title}
      </Text>
      <View style={[styles.codeCard, compact && styles.compactCodeCard]}>
        <Text style={[styles.code, compact && styles.compactCode]}>
          {before}<Text style={styles.highlight}>{clip.highlight}</Text>{after}
        </Text>
      </View>
    </View>
  );
}

function ClipAction({ icon, label, fonts, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <View style={styles.actionIcon}>
        <HomeIcon name={icon} size={22} color={colors.white} />
      </View>
      <Text style={[styles.actionLabel, fonts.bold]}>{label}</Text>
    </Pressable>
  );
}

export default function ShortsScreen({ fonts, lesson, onOpenVideo, onAskTutor }) {
  const pager = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const activeClip = clips[activeIndex];

  function jumpToClip(index) {
    pager.current?.scrollTo({ y: index * pageHeight, animated: false });
    setActiveIndex(index);
  }

  function updateActiveClip({ nativeEvent }) {
    const index = Math.round(nativeEvent.contentOffset.y / pageHeight);
    setActiveIndex(Math.max(0, Math.min(index, clips.length - 1)));
  }

  return (
    <View style={styles.content}>
      <View pointerEvents="none" style={[styles.blob, styles.upperBlob]} />
      <View pointerEvents="none" style={[styles.blob, styles.lowerBlob]} />

      <View accessibilityRole="tablist" accessibilityLabel="Clips de la lección" style={styles.segments}>
        {clips.map((clip, index) => (
          <Pressable
            key={clip.start}
            accessibilityRole="tab"
            accessibilityLabel={`Clip ${index + 1} de ${clips.length}`}
            aria-selected={index === activeIndex}
            onPress={() => jumpToClip(index)}
            style={styles.segmentTarget}
          >
            <View style={[styles.segment, index <= activeIndex && styles.filledSegment]} />
          </Pressable>
        ))}
      </View>

      <View style={styles.pager} onLayout={({ nativeEvent }) => setPageHeight(nativeEvent.layout.height)}>
        {pageHeight > 0 && (
          <ScrollView
            ref={pager}
            pagingEnabled
            decelerationRate="fast"
            bounces={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={32}
            onScroll={updateActiveClip}
            onContentSizeChange={() => pager.current?.scrollTo({ y: activeIndex * pageHeight, animated: false })}
          >
            {clips.map((clip, index) => (
              <ClipPage key={clip.start} clip={clip} fonts={fonts} height={pageHeight} active={index === activeIndex} />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.rail} pointerEvents="box-none">
        <ClipAction icon="chat" label="Preguntar al tutor" fonts={fonts} onPress={() => onAskTutor(activeClip)} />
        <ClipAction icon="playOutline" label="Ver en el vídeo" fonts={fonts} onPress={() => onOpenVideo(activeClip)} />
      </View>

      <View style={styles.meta} pointerEvents="none">
        <Text style={[styles.course, fonts.bold]}>{lesson.course}</Text>
        <Text accessibilityLiveRegion="polite" style={[styles.lesson, fonts.regular]}>
          {lesson.title}, clip {activeIndex + 1} de {clips.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, overflow: 'hidden' },
  blob: { position: 'absolute', backgroundColor: colors.green, opacity: 0.14 },
  upperBlob: { top: 0, right: -70, width: 220, height: 220, borderRadius: 110 },
  lowerBlob: { top: '46%', left: -90, width: 300, height: 300, borderRadius: 150 },
  segments: { flexDirection: 'row', gap: 4, marginHorizontal: 20 },
  segmentTarget: { flex: 1, minHeight: 32, paddingTop: 6 },
  segment: { height: 3, borderRadius: 3, backgroundColor: '#FFFFFF44' },
  filledSegment: { backgroundColor: colors.white },
  pager: { flex: 1 },
  page: { paddingLeft: 20, paddingRight: 84 },
  caption: {
    color: colors.white, fontSize: 30, lineHeight: 32.4, letterSpacing: -0.6, marginBottom: 12,
  },
  compactCaption: { fontSize: 26, lineHeight: 28, marginBottom: 8 },
  codeCard: { borderRadius: 14, backgroundColor: '#00000059', paddingHorizontal: 16, paddingVertical: 14 },
  compactCodeCard: { paddingHorizontal: 12, paddingVertical: 10 },
  code: { color: '#E8EEEE', fontFamily: monospace, fontSize: 13.5, lineHeight: 22 },
  compactCode: { fontSize: 12, lineHeight: 18 },
  highlight: { color: colors.green },
  rail: { position: 'absolute', right: 14, bottom: 170, gap: 18 },
  action: { alignItems: 'center', gap: 5, width: 62 },
  actionIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFFFFF26',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { color: colors.white, fontSize: 11.5, lineHeight: 13.25, textAlign: 'center' },
  pressed: { opacity: 0.7 },
  meta: { position: 'absolute', bottom: 110, left: 20, right: 90 },
  course: { color: colors.white, fontSize: 15, lineHeight: 20 },
  lesson: { color: '#E8EEEE', fontSize: 14, lineHeight: 19 },
});
