import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import HomeIcon from '../inicio/HomeIcon';
import { colors } from '../theme';

const student = {
  initials: 'LF',
  name: 'Lucía Ferrer',
  membership: 'Alumna desde septiembre',
};

const stats = [
  { value: '3', label: 'cursos' },
  { value: '34', label: 'lecciones' },
  { value: '82 %', label: 'aciertos' },
];

const options = [
  {
    icon: 'certificate',
    title: 'Certificados',
    message: 'El perfil de muestra todavía no tiene certificados.',
  },
  {
    icon: 'shield',
    title: 'Mis datos y privacidad',
    subtitle: 'Qué recibe el tutor y cómo borrarlo',
    description: 'El tutor previsto para la app usa tu identificador de alumno, tus mensajes y tu progreso para ayudarte a repasar. Tu nombre y tu correo quedan en la plataforma. La IA que prepara los vídeos, los shorts y los tests solo recibe contenido de los cursos.',
    message: 'La demo usa datos de ejemplo y no guarda conversaciones del tutor. La opción de borrado estará disponible cuando se integre el tutor.',
  },
  { icon: 'notification', title: 'Notificaciones' },
  {
    icon: 'settings',
    title: 'Ajustes de la cuenta',
    description: student.name,
    message: 'La cuenta de demostración es de solo lectura.',
  },
];

export default function ProfileScreen({ fonts, onOpenDetail, onOpenNotifications }) {
  const { width } = useWindowDimensions();
  const compact = width < 360;

  return (
    <View style={styles.content}>
      <View style={styles.identity}>
        <View aria-hidden style={styles.avatar}>
          <Text style={[styles.initials, fonts.extraBold]}>{student.initials}</Text>
        </View>
        <View style={styles.identityText}>
          <Text accessibilityRole="header" style={[styles.name, fonts.bold]}>{student.name}</Text>
          <Text style={[styles.secondaryText, fonts.regular]}>{student.membership}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map(({ value, label }) => (
          <View
            key={label}
            accessible
            accessibilityLabel={`${value} ${label}`}
            style={[styles.statCard, compact && styles.compactStatCard]}
          >
            <Text style={[styles.statValue, fonts.bold]}>{value}</Text>
            <Text style={[styles.secondaryText, fonts.regular]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.options}>
        {options.map(({ icon, title, subtitle, description, message }) => (
          <Pressable
            key={icon}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityHint={subtitle}
            onPress={icon === 'notification'
              ? onOpenNotifications
              : () => onOpenDetail({ title, description, message })}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <HomeIcon name={icon} color={colors.ink} />
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, fonts.semibold]}>{title}</Text>
              {subtitle && <Text style={[styles.optionSubtitle, fonts.regular]}>{subtitle}</Text>}
            </View>
            <HomeIcon name="chevron" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 8, paddingBottom: 24 },
  identityText: { flex: 1 },
  avatar: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.green,
  },
  initials: { color: colors.onGreen, fontSize: 22, lineHeight: 31 },
  name: { color: colors.ink, fontSize: 22, lineHeight: 28 },
  secondaryText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  stats: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 18,
    backgroundColor: colors.surface,
  },
  compactStatCard: { paddingHorizontal: 8 },
  statValue: { color: colors.ink, fontSize: 24, lineHeight: 34, letterSpacing: -0.48 },
  options: { marginTop: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  pressed: { opacity: 0.7 },
  optionText: { flex: 1 },
  optionTitle: { color: colors.ink, fontSize: 15, lineHeight: 21 },
  optionSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 2 },
});
