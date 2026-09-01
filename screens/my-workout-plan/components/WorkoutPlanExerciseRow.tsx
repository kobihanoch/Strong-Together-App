import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { formatDate } from '../../../shared/utils/shared-utils';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';
import type { ExercisePerformanceEntry } from '../types/my-workout-plan.types';

type PlanData = MyWorkoutPlanReturn['data'];
type Exercise = NonNullable<PlanData['selectedSplit']>['exercises'][number];

type Props = {
  exercise: Exercise;
  index: number;
  expanded: boolean;
  performance?: ExercisePerformanceEntry;
  theme: PlanData['theme'];
  onToggle: () => void;
};

const WorkoutPlanExerciseRow = ({ exercise, index, expanded, performance, theme, onToggle }: Props) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const common = createSharedComponentStyles(theme);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={onToggle}
      style={({ pressed }) => [common.card, styles.card, { borderColor: theme.border, opacity: pressed ? 0.84 : 1 }]}
    >
      <View style={styles.summaryRow}>
        <Text style={[styles.order, { color: theme.textSecondary }]}>{String(index + 1).padStart(2, '0')}</Text>
        <View style={styles.exerciseCopy}>
          <Text numberOfLines={1} style={[styles.name, { color: theme.textPrimary }]}>
            {exercise.name}
          </Text>
          <Text numberOfLines={1} style={[styles.muscle, { color: theme.textSecondary }]}>
            {exercise.targetMuscle}
          </Text>
        </View>
        <View style={styles.prescription}>
          <Text style={[styles.sets, { color: theme.textPrimary }]}>{exercise.sets.length} sets</Text>
          <Text style={[styles.reps, { color: theme.textSecondary }]}>{exercise.sets.map((set) => set.reps).join(' · ')}</Text>
        </View>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={fontSizes.title} color={theme.textSecondary} />
      </View>

      {expanded && (
        <View style={[styles.expanded, { borderTopColor: theme.border }]}>
          <View style={styles.performanceHeader}>
            <Text style={[styles.performanceLabel, { color: theme.textSecondary }]}>LAST PERFORMANCE</Text>
            {performance && (
              <Text style={[styles.performanceDate, { color: theme.textSecondary }]}>{formatDate(performance.workoutDate)}</Text>
            )}
          </View>
          {performance ? (
            <View style={styles.performanceSets}>
              {performance.exerciseTracking.sets.map((set, setIndex) => (
                <View key={`${set.setIndex}-${setIndex}`} style={[styles.performanceSet, { backgroundColor: theme.surfaceMuted }]}>
                  <Text style={[styles.setLabel, { color: theme.textSecondary }]}>SET {setIndex + 1}</Text>
                  <Text style={[styles.setValue, { color: theme.textPrimary }]}>
                    {set.weight} kg × {set.reps}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyPerformance, { color: theme.textSecondary }]}>No previous performance yet</Text>
          )}
          {performance?.exerciseTracking.notes ? (
            <Text style={[styles.notes, { color: theme.textSecondary }]}>{performance.exerciseTracking.notes}</Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

const createStyles = (width: number, height: number) =>
  StyleSheet.create({
    card: { padding: 0, borderWidth: 1, borderRadius: Math.max(16, Math.min(width * 0.048, 20)), overflow: 'hidden' },
    summaryRow: {
      minHeight: Math.max(72, Math.min(height * 0.096, 84)),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Math.max(12, width * 0.035),
      paddingVertical: Math.max(10, height * 0.014),
    },
    order: { width: Math.max(38, width * 0.105), fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
    exerciseCopy: { flex: 1, minWidth: 0, paddingRight: Math.max(6, width * 0.02) },
    name: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    muscle: { marginTop: Math.max(2, height * 0.004), fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    prescription: { alignItems: 'flex-end', maxWidth: '38%', flexShrink: 1, marginRight: Math.max(6, width * 0.02) },
    sets: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
    reps: {
      marginTop: Math.max(2, height * 0.004),
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.label,
      textAlign: 'right',
      flexWrap: 'wrap',
    },
    expanded: { borderTopWidth: StyleSheet.hairlineWidth, padding: Math.max(12, width * 0.035) },
    performanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    performanceLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1 },
    performanceDate: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    performanceSets: { flexDirection: 'row', flexWrap: 'wrap', gap: Math.max(6, width * 0.018), marginTop: Math.max(8, height * 0.012) },
    performanceSet: {
      minWidth: Math.max(84, width * 0.235),
      flexGrow: 1,
      borderRadius: Math.max(9, width * 0.028),
      paddingHorizontal: Math.max(8, width * 0.025),
      paddingVertical: Math.max(7, height * 0.011),
    },
    setLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
    setValue: { marginTop: Math.max(2, height * 0.004), fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    emptyPerformance: { marginTop: Math.max(8, height * 0.012), fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
    notes: { marginTop: Math.max(8, height * 0.012), fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  });

export default WorkoutPlanExerciseRow;
