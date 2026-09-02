import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { WorkoutHistoryItem as TrackHistoryItem } from '../../../features/workouts/history/types/workout-history.types';

const TrackHistorySummary = ({ date, workout, theme }: { date: string; workout: TrackHistoryItem | null; theme: AppThemeColors }) => {
  const { height } = useWindowDimensions();
  if (!workout) return <View style={[styles.empty, { marginVertical: height * 0.025, borderColor: theme.border }]}><Text style={[styles.emptyText, { color: theme.textSecondary }]}>No workout recorded</Text></View>;

  const exercises = workout.exerciseTracked;
  const sets = exercises.reduce((total, item) => total + item.exerciseTracking.sets.length, 0);
  const split = exercises[0]?.exerciseTracking.exerciseAssignment.workoutSplitName ?? 'Workout';
  const metrics = [
    { icon: 'clock-outline' as const, label: `${Math.round(workout.durationMins)} min` },
    { icon: 'dumbbell' as const, label: `${exercises.length} exercises` },
    { icon: 'layers-outline' as const, label: `${sets} sets` },
  ];

  return (
    <View style={[styles.card, { marginVertical: height * 0.02, backgroundColor: theme.heroSurface }]}>
      <Text style={[styles.split, { color: theme.primary }]}>{split.toUpperCase()}</Text>
      <Text style={[styles.date, { color: theme.white }]}>{DateTime.fromISO(date).toFormat('cccc, MMM d')}</Text>
      <View style={styles.metrics}>
        {metrics.map((metric, index) => (
          <React.Fragment key={metric.label}>
            {index > 0 && <Text style={styles.separator}>·</Text>}
            <View style={styles.metric}><MaterialCommunityIcons name={metric.icon} size={18} color="#D8D3CD" /><Text style={styles.metricText}>{metric.label}</Text></View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 22, paddingHorizontal: 20, paddingVertical: 18 },
  split: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 1 },
  date: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title, marginTop: 5 },
  metrics: { flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'space-between' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricText: { color: '#D8D3CD', fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  separator: { color: '#706A64' },
  empty: { borderWidth: 1, borderRadius: 18, padding: 22, alignItems: 'center' },
  emptyText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
});

export default TrackHistorySummary;
