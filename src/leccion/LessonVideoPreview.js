import { StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';

export default function LessonVideoPreview({ lesson, fonts }) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});
