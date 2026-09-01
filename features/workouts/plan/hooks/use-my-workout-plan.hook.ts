import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../../shared/providers/AppThemeProvider';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserDashboardStats } from '../../../home/services/home-page.service';
import { useWorkoutHistory } from '../../history/hooks/use-workout-history.hook';
import { createMockExercisePerformance } from '../mocks/exercise-performance.mock';
import type { WorkoutSplit } from '../types/workout-plan.types';
import {
  deriveSelectedSplitDates,
  deriveSelectedSplitDetails,
  deriveWorkoutTargets,
  deriveWorkoutWeekDays,
  selectWorkoutSplit,
} from '../utils/my-workout-plan.utils';
import { useWorkoutPlan } from './use-workout-plan.hook';

export type MyWorkoutPlanReturn = ReturnType<typeof useMyWorkoutPlan>;

const useMyWorkoutPlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const {
    data: { workoutPlan, workoutSplits, hasWorkoutPlan },
    loadingStates: workoutPlanLoadingStates,
  } = useWorkoutPlan();
  const { data: historyData, loadingStates: historyLoadingStates } = useWorkoutHistory();

  const statisticsQuery = useQuery({
    queryKey: ['home-dashboard', userId],
    queryFn: getUserDashboardStats,
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
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
  const targets = deriveWorkoutTargets(statisticsQuery.data);
  const isPending = workoutPlanLoadingStates.isPending || statisticsQuery.isPending || historyLoadingStates.isPending;

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
