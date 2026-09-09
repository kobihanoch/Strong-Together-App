import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReplaceWorkoutPlanBody } from '@strong-together/shared';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { addWorkout } from '../../plan/services/workout-plan.service';
import { WorkoutPlan } from '../types/workout-plan.types';
import { useAuth } from '../../../auth/providers/AuthProvider';

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
      await addWorkout(editedPlan);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

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
      refetch: query.refetch,
    },
  };
};
