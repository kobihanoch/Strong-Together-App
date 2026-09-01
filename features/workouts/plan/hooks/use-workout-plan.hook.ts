import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReplaceWorkoutPlanBody } from '@strong-together/shared';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { addWorkout } from '../../editor/services/workout-editor.service';
import { WorkoutPlan } from '../types/workout-plan.types';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';

type ModifiedWorkoutPlan = ReplaceWorkoutPlanBody['workoutData'];

/**
 * Provides the authenticated user's persisted workout-plan server state.
 *
 * The query revalidates after server authentication, while the mutation and
 * local updater keep the shared TanStack cache synchronized for all consumers.
 *
 * @returns Workout-plan data, loading states, and cache-aware actions.
 */
export const useWorkoutPlan = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['workout-plan', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,

    queryFn: async (): Promise<WorkoutPlan | null> => (await getUserWorkout()).workoutPlan ?? null,
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // DB updating
  const updateSourceWorkoutPlan = useMutation({
    mutationFn: async (editedPlan: ModifiedWorkoutPlan) => {
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      const { workoutPlan } = await addWorkout(editedPlan);
      return workoutPlan;
    },

    onSuccess: (updatedWorkoutPlan) => {
      queryClient.setQueryData<WorkoutPlan | null>(queryKey, updatedWorkoutPlan);
    },
  });

  // Update local

  const updateLocalWorkoutPlan = (updater: WorkoutPlan | null | ((prev: WorkoutPlan | null | undefined) => WorkoutPlan | null)) => {
    if (userId) queryClient.setQueryData<WorkoutPlan | null>(queryKey, updater);
  };

  // Main data
  const workoutPlan = query.data;

  // Derived values
  const workoutSplits = workoutPlan?.workoutSplits ?? [];
  const hasWorkoutPlan = Boolean(workoutPlan);

  return {
    data: { workoutPlan, workoutSplits, hasWorkoutPlan },
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    },
    actions: {
      updateWorkoutPlan: updateSourceWorkoutPlan.mutateAsync,
      updateLocalWorkoutPlan,
      refetch: query.refetch,
    },
  };
};
