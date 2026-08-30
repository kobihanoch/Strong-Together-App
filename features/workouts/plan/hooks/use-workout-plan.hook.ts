import { useCallback, useMemo } from 'react';
import { keyWorkoutPlan } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { WorkoutPlan, WorkoutSplit } from '../../shared/types/workout.types';

/**
 * Provides the authenticated user's cached workout plan and revalidates it
 * after the server session is ready. It also derives the plan's splits and
 * whether an active plan is available.
 *
 * @returns The workout plan, its derived splits, plan-availability indicator,
 * loading state, and a helper for fetching fresh data.
 */
const useWorkoutPlan = () => {
  const { user, isValidatedWithServer } = useAuth();
  const fetchFn = useCallback(async () => (await getUserWorkout())?.workoutPlan, []);
  const cacheKey = useMemo(() => (user?.id ? keyWorkoutPlan(user.id) : null), [user?.id]);

  const {
    data: workoutPlan,
    fetchAndCache,
    loading,
  } = useCacheAndFetch<WorkoutPlan>(cacheKey, isValidatedWithServer, fetchFn, 'Workout Plan');

  // Derived values
  const workoutSplits: WorkoutSplit[] = workoutPlan?.workoutSplits ?? [];
  const hasWorkoutPlan = !!workoutPlan;

  return { workoutPlan, workoutSplits, hasWorkoutPlan, fetchAndCache, loading };
};

export default useWorkoutPlan;
