import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';
import WorkoutPlanExerciseRow from './WorkoutPlanExerciseRow';

type PlanData = MyWorkoutPlanReturn['data'];
type Props = {
  theme: PlanData['theme'];
  split: NonNullable<PlanData['selectedSplit']>;
  performanceByAssignmentId: PlanData['exercisePerformanceByAssignmentId'];
};

const WorkoutPlanExerciseList = ({ theme, split, performanceByAssignmentId }: Props) => {
  const { height } = useWindowDimensions();
  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);
  return (
    <View>
      <View style={[styles.header, { marginTop: Math.max(18, Math.min(height * 0.027, 24)), marginBottom: Math.max(8, height * 0.012) }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Exercises</Text>
        <Text style={[styles.total, { color: theme.textSecondary }]}>{split.exercises.length} total</Text>
      </View>
      <View style={[styles.list, { gap: Math.max(7, Math.min(height * 0.011, 10)) }]}>
        {split.exercises.map((exercise, index) => {
          const expanded = expandedExerciseId === exercise.exerciseToSplitId;
          const performance = performanceByAssignmentId[String(exercise.exerciseToSplitId)]?.exerciseTracked[0];
          return (
            <WorkoutPlanExerciseRow
              key={exercise.exerciseToSplitId}
              exercise={exercise}
              index={index}
              expanded={expanded}
              performance={performance}
              theme={theme}
              onToggle={() => setExpandedExerciseId(expanded ? null : exercise.exerciseToSplitId)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  title: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
  total: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  list: {},
});

export default WorkoutPlanExerciseList;
