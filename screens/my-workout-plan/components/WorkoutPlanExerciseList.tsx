import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ExerciseInPlan } from '../../../features/workouts/plan/types/workout-plan.types';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';
import WorkoutPlanExerciseRow from './WorkoutPlanExerciseRow';

type PlanData = MyWorkoutPlanReturn['data'];
type Props = {
  theme: PlanData['theme'];
  split: NonNullable<PlanData['selectedSplit']>;
  performanceByAssignmentId: PlanData['exercisePerformanceByAssignmentId'];
  onExerciseExpand: React.Dispatch<React.SetStateAction<ExerciseInPlan['exerciseToSplitId'] | null>>;
  expandedExerciseId: ExerciseInPlan['exerciseToSplitId'] | null;
};

const WorkoutPlanExerciseList = ({ theme, split, performanceByAssignmentId, onExerciseExpand, expandedExerciseId }: Props) => {
  const { height } = useWindowDimensions();
  return (
    <View>
      <View style={[styles.header, { marginTop: Math.max(18, Math.min(height * 0.027, 24)), marginBottom: Math.max(8, height * 0.012) }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Exercises</Text>
        <Text style={[styles.total, { color: theme.textSecondary }]}>{split.exercises.length} total</Text>
      </View>
      <View style={[styles.list, { gap: Math.max(7, Math.min(height * 0.011, 10)) }]}>
        {split.exercises.map((exercise, index) => {
          const expanded = expandedExerciseId === exercise.exerciseToSplitId;
          return (
            <WorkoutPlanExerciseRow
              key={exercise.exerciseToSplitId}
              exercise={exercise}
              index={index}
              expanded={expanded}
              performance={performanceByAssignmentId}
              theme={theme}
              onToggle={onExerciseExpand}
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
