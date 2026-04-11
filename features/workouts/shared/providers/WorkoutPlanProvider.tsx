import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { keyWorkoutPlan } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../../hooks/use-update-global-loading.hook';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { extractWorkoutSplits } from '../../plan/utils/workout-plan.util';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';
import {
  WorkoutPlanProviderCachePayload,
  WorkoutPlanProviderValue,
} from './types/workout-plan-provider.types';
import {
  WorkoutPlan,
  WorkoutPlanForEdit,
} from '../../plan/types/workout-plan.types';

const WorkoutPlanContext = createContext<WorkoutPlanProviderValue | null>(null);
export const useWorkoutPlanContext = () => {
  const ctx = useContext(WorkoutPlanContext);
  if (!ctx) throw new Error('useWorkoutPlanContext must be used within a WorkoutPlanProvider');
  return ctx;
};

/**
 * Workout Plan Context
 * ----------------
 * Responsibilities:
 * - Fetch and hold the user's active workout plan
 * - Derive mapped splits + flat exercises
 * - Provide an editable copy (workoutForEdit)
 */

export const WorkoutPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  // Raw workout plan from API
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);

  // Derived data from workout
  const { workoutSplits, exercises } = useMemo(() => {
    return extractWorkoutSplits(workout); // must be null-safe
  }, [workout]);

  // Editable version for edit workout
  const [workoutForEdit, setWorkoutForEdit] = useState<WorkoutPlanForEdit | null>(null);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserWorkout(), []);

  // On data function
  const onDataFn = useCallback((data: GetWholeUserWorkoutPlanResponse | WorkoutPlanProviderCachePayload): void => {
    if (!data) return;
    setWorkout(data.workoutPlan); // Null if doesnt exist
    setWorkoutForEdit(data.workoutPlanForEditWorkout); // Null if doesnt exist
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({ workoutPlan: workout, workoutPlanForEditWorkout: workoutForEdit }),
    [workout, workoutForEdit],
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch<WorkoutPlanProviderCachePayload, GetWholeUserWorkoutPlanResponse>(
    user, // user prop
    keyWorkoutPlan, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Workout Context', // log
  );

  // Report workout plan loading to global loading
  useUpdateGlobalLoading('WorkoutPlan', cacheKnown ? loading : true);

  // Memoized context value
  const value = useMemo<WorkoutPlanProviderValue>(
    () => ({
      workout,
      setWorkout,
      workoutSplits, // [{name: A, id: 1, muscle_group:...}, {name: B, id: 2. muscle_group:...},....], exercises = {A: [exercises...], B: [exercises...]}}
      exercises, // { A: [...], B: [...], ... }
      workoutForEdit,
      setWorkoutForEdit,
      loading,
    }),
    [workout, workoutSplits, exercises, workoutForEdit, loading],
  );

  return <WorkoutPlanContext.Provider value={value}>{children}</WorkoutPlanContext.Provider>;
};

