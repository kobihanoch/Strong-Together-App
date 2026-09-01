import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { ExerciseInPlan } from '../../plan/types/workout-plan.types';
import { getUserExerciseHistory } from '../services/exercise-history.service';
import { ExerciseHistoryMap } from '../types/exercise-history.types';
import { checkHasVisibleHistory, getLastLogPerformance } from '../utils/exercise-history.utils';

/**
 * Loads the authenticated user's exercise-performance history.
 *
 * The query runs after server authentication and caches the history by user.
 * It also derives whether any visible history exists and provides a stable
 * lookup for the latest performance associated with an exercise-to-split ID.
 *
 * @returns Exercise-history data and derived lookups, query loading states,
 * and a manual refetch action.
 */
export const useExerciseHistory = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = ['exercise-history', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ExerciseHistoryMap | null> => (await getUserExerciseHistory()) ?? null,
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Main data
  const exerciseHistoryMap = query.data;

  // Derived values
  const hasVisibleHistory = checkHasVisibleHistory(exerciseHistoryMap);
  const getLastPerformanceForExercise = useCallback(
    (etsid: ExerciseInPlan['exerciseToSplitId']) => getLastLogPerformance(exerciseHistoryMap, etsid),
    [exerciseHistoryMap],
  );

  return {
    data: { exerciseHistoryMap, hasVisibleHistory, getLastPerformanceForExercise },
    loadingStates: { isPending: query.isPending, isLoading: query.isLoading, isFetching: query.isFetching },
    actions: {
      refetch: query.refetch,
    },
  };
};
