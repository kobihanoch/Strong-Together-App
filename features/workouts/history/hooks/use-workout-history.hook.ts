import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserExerciseTracking } from '../services/workout-history.service';
import { WorkoutHistoryExerciseTrackingMaps } from '../types/workout-history.types';
import { checkHasTrainedToday, checkHasVisibleHistory } from '../utils/workout-history-context.util';

export const useWorkoutHistory = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['workout-history', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<WorkoutHistoryExerciseTrackingMaps> => await getUserExerciseTracking(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Update local
  const updateLocalExerciseTracking = (updater: WorkoutHistoryExerciseTrackingMaps) => {
    if (userId) queryClient.setQueryData<WorkoutHistoryExerciseTrackingMaps>(queryKey, updater);
  };

  // Main data
  const exerciseTrackingMaps = query.data;

  // Derived values
  const hasTrainedToday = checkHasTrainedToday(Intl.DateTimeFormat().resolvedOptions().timeZone, exerciseTrackingMaps);
  const hasVisibleHistory = checkHasVisibleHistory(exerciseTrackingMaps);

  return {
    data: { exerciseTrackingMaps, hasTrainedToday, hasVisibleHistory },
    loadingStates: { isLoading: query.isLoading, isFetching: query.isFetching },
    actions: {
      updateLocalExerciseTracking,
      refetch: query.refetch,
    },
  };
};
