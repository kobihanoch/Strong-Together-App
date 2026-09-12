import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { prHistoryQueryKeys } from '../query-keys';
import { ExerciseInPlan } from '../../plan/types/workout-plan.types';
import { getUserPrHistory } from '../services/pr-history.service';
import { PrHistoryMap } from '../types/pr-history.types';
import { checkHasAnyPr } from '../utils/pr-history.utils';

/**
 * Loads personal records after server authentication and exposes a stable
 * exercise-ID lookup alongside the derived indication that any PR exists.
 *
 * @returns PR data, derived lookup helpers, query loading states, and a manual refetch action.
 */
export const usePrHistory = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = prHistoryQueryKeys.byUser(userId);

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
