import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserExerciseTracking } from '../services/workout-history.service';
import { WorkoutHistoryMap } from '../types/workout-history.types';
import { checkHasTrainedToday, checkHasVisibleHistory } from '../utils/workout-history-context.util';

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
  const queryClient = useQueryClient();
  const queryKey = ['workout-history', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<WorkoutHistoryMap> => await getUserExerciseTracking(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Update local
  const updateLocalExerciseTracking = (updater: WorkoutHistoryMap) => {
    if (userId) queryClient.setQueryData<WorkoutHistoryMap>(queryKey, updater);
  };

  // Main data
  const exerciseTrackingMaps = query.data;

  // Derived values
  const hasTrainedToday = checkHasTrainedToday(Intl.DateTimeFormat().resolvedOptions().timeZone, exerciseTrackingMaps);
  const hasVisibleHistory = checkHasVisibleHistory(exerciseTrackingMaps);

  return {
    data: { exerciseTrackingMaps, hasTrainedToday, hasVisibleHistory },
    loadingStates: { isPending: query.isPending, isLoading: query.isLoading, isFetching: query.isFetching },
    actions: {
      updateLocalExerciseTracking,
      refetch: query.refetch,
    },
  };
};
