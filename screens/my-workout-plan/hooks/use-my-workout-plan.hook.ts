import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import {
  deriveSelectedSplitDates,
  deriveSelectedSplitDetails,
  deriveWorkoutTargets,
  deriveWorkoutWeekDays,
  selectWorkoutSplit,
} from '../utils/my-workout-plan.utils';

import useDashboard from '../../../features/dashboard/use-dashboard.hook';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import { useWorkoutHistory } from '../../../features/workouts/history/hooks/use-workout-history.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { ExerciseInPlan, WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

export type MyWorkoutPlanReturn = ReturnType<typeof useMyWorkoutPlan>;

/**
 * Composes the workout-plan screen state from plan, history, and dashboard data.
 *
 * @returns The screen data and actions used to select, create, edit, or start a split.
 */
const useMyWorkoutPlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { data: workoutPlanData, loadingStates: workoutPlanLoadingStates } = useWorkoutPlan();
  const { data: workoutHistoryData, loadingStates: workoutHistoryLoadingStates } = useWorkoutHistory();
  const { data: exerciseHistoryData, loadingStates: exerciseHistoryLoadingStates } = useExerciseHistory();
  const { data: dashboardData, loadingStates: dashboardLoadingStates } = useDashboard();
  const { hasWorkoutPlan, workoutPlan, workoutSplits } = workoutPlanData;

  // States
  const [selectedSplitId, setSelectedSplitId] = useState<WorkoutSplit['id'] | null>(null);
  const [expandedExerciseToSplitId, setExpandedExerciseToSplitId] = useState<ExerciseInPlan['exerciseToSplitId'] | null>(null);

  // Intial set for split
  useEffect(() => {
    if (!workoutSplits.length) return setSelectedSplitId(null);
    if (!workoutSplits.some((split) => split.id === selectedSplitId)) setSelectedSplitId(workoutSplits[0].id);
  }, [selectedSplitId, workoutSplits]);

  // Derived
  const selectedSplit = useMemo<WorkoutSplit | null>(
    () => selectWorkoutSplit(workoutSplits, selectedSplitId),
    [selectedSplitId, workoutSplits],
  );
  const selectedSplitDetails = useMemo(() => deriveSelectedSplitDetails(selectedSplit), [selectedSplit]);

  const expandedExercisePerformance = exerciseHistoryData.getLastPerformanceForExercise(expandedExerciseToSplitId);

  const weekDays = useMemo(() => deriveWorkoutWeekDays(workoutHistoryData.workoutHistoryMap), [workoutHistoryData.workoutHistoryMap]);
  const selectedSplitDates = useMemo(
    () => deriveSelectedSplitDates(workoutHistoryData.workoutHistoryMap, selectedSplit),
    [workoutHistoryData.workoutHistoryMap, selectedSplit],
  );
  const targets = deriveWorkoutTargets(dashboardData);
  const isPending =
    workoutPlanLoadingStates.isPending ||
    dashboardLoadingStates.isPending ||
    workoutHistoryLoadingStates.isPending ||
    exerciseHistoryLoadingStates.isPending;

  return {
    data: {
      theme,
      isPending,
      hasWorkoutPlan,
      workoutPlan,
      workoutSplits,
      selectedSplit,
      expandedExerciseToSplitId,
      ...selectedSplitDetails,
      hasTrainedToday: workoutHistoryData.hasTrainedToday,
      ...targets,
      weekDays,
      lastCompletedDate: selectedSplitDates[0] ?? null,
      exercisePerformanceByAssignmentId: expandedExercisePerformance,
    },
    actions: {
      selectSplit: (split: WorkoutSplit) => setSelectedSplitId(split.id),
      setExpandedExerciseToSplitId,
      createPlan: () => navigation.navigate('CreateWorkout'),
      editPlan: () => navigation.navigate('CreateWorkout'),
      startWorkout: () => selectedSplit && navigation.navigate('StartWorkout', { workoutSplit: selectedSplit }),
    },
  };
};

export default useMyWorkoutPlan;
