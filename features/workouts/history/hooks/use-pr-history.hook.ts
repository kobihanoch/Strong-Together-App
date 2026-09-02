import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { ExerciseInPlan } from '../../plan/types/workout-plan.types';
import { getUserPrHistory } from '../services/pr-history.service';
import { PrHistoryMap } from '../types/pr-history.types';
import { checkHasAnyPr } from '../utils/pr-history.utils';

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
export const usePrHistory = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = ['pr-history', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<PrHistoryMap> => await getUserPrHistory(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Main data
  const prHistoryMap = query.data;

  // Derived values
  const hasAnyPr = checkHasAnyPr(prHistoryMap);
  const getPrForExerciseId = useCallback(
    (exerciseId: ExerciseInPlan['exerciseId']) => prHistoryMap?.prs[exerciseId] ?? null,
    [prHistoryMap],
  );

  return {
    data: { prHistoryMap, hasAnyPr, getPrForExerciseId },
    loadingStates: { isPending: query.isPending, isLoading: query.isLoading, isFetching: query.isFetching },
    actions: {
      refetch: query.refetch,
    },
  };
};
