import { AddWorkoutBody } from '@strong-together/shared';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { keyWorkoutPlan } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { addWorkout } from '../../editor/services/workout-editor.service';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { WorkoutPlan, WorkoutSplit } from '../types/workout.types';

type ModifiedWorkoutPlan = AddWorkoutBody['workoutData'];

export interface WorkoutPlanProviderValue {
  loading: boolean;
  fetchLoading: boolean;
  workoutPlan: WorkoutPlan | null | undefined;
  workoutSplits: WorkoutSplit[];
  hasWorkoutPlan: boolean;
  updateWorkoutPlan: (editedPlan: ModifiedWorkoutPlan) => Promise<void>;
}

const WorkoutPlanContext = createContext<WorkoutPlanProviderValue | null>(null);

/**
 * Owns the authenticated user's workout-plan state and persistent cache.
 *
 * The provider hydrates cached data, performs the initial server revalidation,
 * and applies successful plan mutations to both shared state and storage.
 *
 * @param props - Provider props containing descendant React nodes.
 * @returns A context provider containing the shared workout-plan state.
 */
export const WorkoutPlanProvider = (props: PropsWithChildren) => {
  const { user, isValidatedWithServer } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchFn = useCallback(async () => (await getUserWorkout())?.workoutPlan, []);
  const cacheKey = useMemo(() => (user?.id ? keyWorkoutPlan(user.id) : null), [user?.id]);

  const {
    data: workoutPlan,
    updateAndCache,
    loading: fetchLoading,
  } = useCacheAndFetch<WorkoutPlan>(cacheKey, isValidatedWithServer, fetchFn, 'Workout Plan');

  const updateWorkoutPlan = useCallback(
    async (editedPlan: ModifiedWorkoutPlan) => {
      setUpdateLoading(true);

      try {
        const { workoutPlan: updatedWorkoutPlan } = await addWorkout(editedPlan);
        await updateAndCache(updatedWorkoutPlan);
      } finally {
        setUpdateLoading(false);
      }
    },
    [updateAndCache],
  );

  const value = useMemo<WorkoutPlanProviderValue>(
    () => ({
      workoutPlan,
      workoutSplits: workoutPlan?.workoutSplits ?? [],
      hasWorkoutPlan: !!workoutPlan,
      loading: updateLoading || fetchLoading,
      fetchLoading,
      updateWorkoutPlan,
    }),
    [fetchLoading, updateLoading, updateWorkoutPlan, workoutPlan],
  );

  return <WorkoutPlanContext.Provider value={value}>{props.children}</WorkoutPlanContext.Provider>;
};

export const useWorkoutPlan = (): WorkoutPlanProviderValue => {
  const context = useContext(WorkoutPlanContext);

  if (!context) {
    throw new Error('useWorkoutPlan must be used within a WorkoutPlanProvider');
  }

  return context;
};
