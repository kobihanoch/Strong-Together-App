import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import type { VideoAnalysisStatus } from './AnalyzeExerciseSheet';

const VideoAnalysisAction = ({ theme, status, onPress }: { theme: AppThemeColors; status: VideoAnalysisStatus; onPress: () => void }) => {
  const subtitle = status === 'processing' ? 'Processing · keep training' : status === 'completed' ? 'Results ready' : 'Upload a clip up to 30 seconds';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Analyze exercise video"
      onPress={onPress}
      style={({ pressed }) => [styles.row, { borderTopColor: theme.border, opacity: pressed ? 0.68 : 1 }]}
    >
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
        <MaterialCommunityIcons name={status === 'completed' ? 'check' : 'motion-play-outline'} size={20} color={theme.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Analyze movement</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={21} color={theme.textSecondary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { minHeight: 66, marginTop: 20, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  title: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  subtitle: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.caption },
});

export default VideoAnalysisAction;
