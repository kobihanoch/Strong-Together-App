import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { getUserWorkoutHistory } from '../services/workout-history.service';
import { WorkoutHistoryMap } from '../types/workout-history.types';
import { checkHasVisibleHistory, checkHasTrainedToday } from '../utils/workout-history.utils';

/**
 * Provides the authenticated user's persisted workout-history server state.
 *
 * The hook revalidates tracking maps after authentication and derives the
 * current-day and visible-history indicators from the shared query cache.
 *
 * @returns Workout-history data, loading states, and cache-aware actions.
 */
export const useWorkoutHistory = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = ['workout-history', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<WorkoutHistoryMap> => await getUserWorkoutHistory(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Main data
  const workoutHistoryMap = query.data;

  // Derived values
  const hasTrainedToday = checkHasTrainedToday(Intl.DateTimeFormat().resolvedOptions().timeZone, workoutHistoryMap);
  const hasVisibleHistory = checkHasVisibleHistory(workoutHistoryMap);

  return {
    data: { workoutHistoryMap, hasTrainedToday, hasVisibleHistory },
    loadingStates: { isPending: query.isPending, isLoading: query.isLoading, isFetching: query.isFetching },
    actions: {
      refetch: query.refetch,
    },
  };
};
