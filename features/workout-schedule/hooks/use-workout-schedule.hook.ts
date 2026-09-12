import { ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/providers/AuthProvider';
import { dashboardQueryKeys } from '../../dashboard/query-keys';
import { workoutScheduleQueryKeys } from '../query-keys';
import { getUserWorkoutSchedule, replaceUserWorkoutSchedules } from '../services/workout-schedule.service';
import { WorkoutSchedules } from '../types/workout-schedule.types';
import { getNextScheduledWorkout } from '../utils/workout-schedule.utils';

type ModifiedWorkoutSchedules = ReplaceWorkoutSchedulesBody['schedules'];

/**
 * Loads and replaces the authenticated user's weekly workout schedule, deriving
 * whether a schedule exists and which workout is next for screen consumers.
 *
 * @returns Schedule data and derived values, loading states, and cache-invalidating update/refetch actions.
 */
export const useWorkoutSchedule = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = workoutScheduleQueryKeys.byUser(userId);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<WorkoutSchedules> => await getUserWorkoutSchedule(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Main data
  const workoutSchedules = query.data;

  // Derived values
  const hasScheduledWorkouts = (workoutSchedules?.schedules.length ?? 0) > 0;
  const nextScheduledWorkout = getNextScheduledWorkout(workoutSchedules?.schedules);

  // DB updating
  const updateSourceWorkoutSchedules = useMutation({
    mutationFn: async (editedWorkoutSchedules: ModifiedWorkoutSchedules) => {
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      await replaceUserWorkoutSchedules(editedWorkoutSchedules);
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
      ]);
    },
  });

  return {
    data: { workoutSchedules, hasScheduledWorkouts, nextScheduledWorkout },
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isUpdating: updateSourceWorkoutSchedules.isPending,
    },
    actions: {
      refetch: query.refetch,
      updateWorkoutSchedules: updateSourceWorkoutSchedules.mutateAsync,
    },
  };
};
