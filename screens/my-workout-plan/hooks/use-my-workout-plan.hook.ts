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
import { useWorkoutHistory } from '../../../features/workouts/history/hooks/use-workout-history.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { createMockExercisePerformance } from '../mocks/exercise-performance.mock';

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
  const { data: historyData, loadingStates: historyLoadingStates } = useWorkoutHistory();
  const { data: dashboardData, loadingStates: dashboardLoadingStates } = useDashboard();

  const { hasWorkoutPlan, workoutPlan, workoutSplits } = workoutPlanData;

  const [selectedSplitId, setSelectedSplitId] = useState<number | null>(null);

  useEffect(() => {
    if (!workoutSplits.length) return setSelectedSplitId(null);
    if (!workoutSplits.some((split) => split.id === selectedSplitId)) setSelectedSplitId(workoutSplits[0].id);
  }, [selectedSplitId, workoutSplits]);

  const selectedSplit = useMemo<WorkoutSplit | null>(
    () => selectWorkoutSplit(workoutSplits, selectedSplitId),
    [selectedSplitId, workoutSplits],
  );
  const selectedSplitDetails = useMemo(() => deriveSelectedSplitDetails(selectedSplit), [selectedSplit]);

  // Need to change
  const exercisePerformance = useMemo(() => createMockExercisePerformance(workoutSplits), [workoutSplits]);
  const expandedExercisePerformance = selectedSplit ? exercisePerformance.byExerciseToSplitId : {};
  // -----------------

  const weekDays = useMemo(() => deriveWorkoutWeekDays(historyData.workoutHistoryMap), [historyData.workoutHistoryMap]);
  const selectedSplitDates = useMemo(
    () => deriveSelectedSplitDates(historyData.workoutHistoryMap, selectedSplit),
    [historyData.workoutHistoryMap, selectedSplit],
  );
  const targets = deriveWorkoutTargets(dashboardData);
  const isPending = workoutPlanLoadingStates.isPending || dashboardLoadingStates.isPending || historyLoadingStates.isPending;

  return {
    data: {
      theme,
      isPending,
      isLoading: isPending,
      hasWorkoutPlan,
      workoutPlan,
      workoutSplits,
      selectedSplit,
      ...selectedSplitDetails,
      hasTrainedToday: historyData.hasTrainedToday,
      ...targets,
      weekDays,
      lastCompletedDate: selectedSplitDates[0] ?? null,
      exercisePerformanceByAssignmentId: expandedExercisePerformance,
    },
    actions: {
      selectSplit: (split: WorkoutSplit) => setSelectedSplitId(split.id),
      createPlan: () => navigation.navigate('CreateWorkout'),
      editPlan: () => navigation.navigate('CreateWorkout'),
      startWorkout: () => selectedSplit && navigation.navigate('StartWorkout', { workoutSplit: selectedSplit }),
    },
  };
};

export default useMyWorkoutPlan;
