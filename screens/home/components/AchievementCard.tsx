import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type ProgressData = { exercise: string; value: string; reps: number; dateLabel: string };
const AchievementCard = ({ data, theme, onPress }: { data: ProgressData; theme: AppThemeColors; onPress: () => void }) => {
  const { height } = useWindowDimensions();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.section, { paddingVertical: Math.max(18, Math.min(height * 0.027, 24)) }, pressed && styles.pressed]}>
    <Text style={[styles.heading, { color: theme.textPrimary }]}>Latest progress</Text>
    <View style={styles.row}><View style={styles.copy}><Text style={[styles.exercise, { color: theme.textPrimary }]}>{data.exercise}</Text><View style={styles.detail}><Text style={[styles.value, { color: theme.textPrimary }]}>{data.value}{data.reps ? ` · ${data.reps} reps` : ''}</Text>{data.dateLabel ? <Text style={[styles.date, { color: theme.textSecondary }]}>{data.dateLabel}</Text> : null}</View></View><MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} /></View>
  </Pressable>;
};
const styles = StyleSheet.create({ section: {}, heading: { fontFamily: fontFamilies.bold, fontSize: fontSizes.body }, row: { minHeight: 54, marginTop: 7, flexDirection: 'row', alignItems: 'center' }, copy: { flex: 1 }, exercise: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall }, detail: { marginTop: 3, flexDirection: 'row', alignItems: 'baseline', gap: 18 }, value: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body }, date: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label }, pressed: { opacity: 0.72 } });
export default AchievementCard;
