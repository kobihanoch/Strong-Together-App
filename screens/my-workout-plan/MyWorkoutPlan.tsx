import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoWorkoutPlan from './components/NoWorkoutPlan';
import WorkoutPlanExerciseList from './components/WorkoutPlanExerciseList';
import WorkoutPlanHeader from './components/WorkoutPlanHeader';
import WorkoutPlanSkeleton from './components/WorkoutPlanSkeleton';
import WorkoutPlanSummary from './components/WorkoutPlanSummary';
import WorkoutSplitSelector from './components/WorkoutSplitSelector';
import useMyWorkoutPlan from './hooks/use-my-workout-plan.hook';

const MyWorkoutPlan = () => {
  const { data, actions } = useMyWorkoutPlan();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(14, Math.min(width * 0.045, 22));

  const split = data.selectedSplit;
  if (data.isPending) return <WorkoutPlanSkeleton />;
  if (!data.hasWorkoutPlan) return <NoWorkoutPlan onCreatePress={actions.createPlan} />;
  if (!split) return <WorkoutPlanSkeleton />;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(10, Math.min(height * 0.015, 14)),
          paddingHorizontal: gutter,
          paddingBottom: Math.max(24, Math.min(height * 0.04, 34)),
        }}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutPlanHeader theme={data.theme} />
        <WorkoutPlanSummary data={data} split={split} onStart={actions.startWorkout} onEdit={actions.editPlan} />
        <WorkoutSplitSelector theme={data.theme} splits={data.workoutSplits} selectedSplit={split} onSelect={actions.selectSplit} />
        <WorkoutPlanExerciseList
          theme={data.theme}
          onExerciseExpand={actions.setExpandedExerciseToSplitId}
          split={split}
          performanceByAssignmentId={data.exercisePerformanceByAssignmentId}
          expandedExerciseId={data.expandedExerciseToSplitId}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});

export default MyWorkoutPlan;
