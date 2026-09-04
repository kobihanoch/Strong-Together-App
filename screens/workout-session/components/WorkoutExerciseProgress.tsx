import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import ExerciseProgressChart from '../../track-history/components/ExerciseProgressChart';
import type { TrackHistoryPoint } from '../../track-history/utils/track-history.utils';

type Props = {
  theme: AppThemeColors;
  points: TrackHistoryPoint[];
  onViewAll: () => void;
};

const WorkoutExerciseProgress = ({ theme, points, onViewAll }: Props) => {
  const latest = points[points.length - 1];

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>EXERCISE HISTORY</Text>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Recent strength</Text>
          {latest && (
            <Text style={[styles.latest, { color: theme.textPrimary }]}>
              {latest.value}
              <Text style={styles.unit}> kg</Text>
            </Text>
          )}
        </View>
        {points.length > 0 && (
          <Pressable onPress={onViewAll} hitSlop={8} style={styles.historyAction}>
            <Text style={[styles.action, { color: theme.primary }]}>Full history →</Text>
          </Pressable>
        )}
      </View>

      {points.length ? (
        <ExerciseProgressChart points={points} theme={theme} />
      ) : (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>Your progress will appear after the first workout.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 28, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5 },
  header: { marginTop: 7, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  latest: { marginTop: 6, marginLeft: -2, fontFamily: fontFamilies.bold, fontSize: 32, lineHeight: 37 },
  unit: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  historyAction: { minHeight: 40, justifyContent: 'center' },
  action: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  empty: { paddingVertical: 18, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
});

export default WorkoutExerciseProgress;
