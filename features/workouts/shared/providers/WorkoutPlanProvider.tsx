import { GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { keyWorkoutPlan } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserWorkout } from '../../plan/services/workout-plan.service';
import { WorkoutPlan, WorkoutPlanForEdit } from '../../plan/types/workout-plan.types';
import { extractWorkoutSplits } from '../../plan/utils/workout-plan.util';
import { WorkoutPlanProviderValue } from './types/workout-plan-provider.types';

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
  const [workout, setWorkout] = useState<WorkoutPlan | undefined | null>(undefined);

  // Derived data from workout
  const { workoutSplits, exercises } = useMemo(() => {
    const extracted = extractWorkoutSplits(workout); // must be null-safe
    if (extracted === undefined) return { workoutSplits: undefined, exercises: undefined };
    return extracted;
  }, [workout]);

  // Editable version for edit workout
  const [workoutForEdit, setWorkoutForEdit] = useState<WorkoutPlanForEdit | undefined | null>(undefined);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserWorkout(), []);

  // On data function
  const onDataFn = useCallback((data: GetWholeUserWorkoutPlanResponse): void => {
    setWorkout(data.workoutPlan); // Null if doesnt exist
    setWorkoutForEdit(data.workoutPlanForEditWorkout); // Null if doesnt exist
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () =>
      workout === undefined || workoutForEdit === undefined
        ? undefined
        : { workoutPlan: workout, workoutPlanForEditWorkout: workoutForEdit },
    [workout, workoutForEdit],
  );

  // Hook usage
  const { loading } = useCacheAndFetch<GetWholeUserWorkoutPlanResponse>(
    user, // user prop
    keyWorkoutPlan, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Workout Context', // log
  );

  // Report workout plan loading to global loading
  useUpdateGlobalLoading('WorkoutPlan', loading);

  // Memoized context value
  const value = useMemo<WorkoutPlanProviderValue>(
    () => ({
      workout: workout === undefined ? null : workout,
      setWorkout,
      workoutSplits: workoutSplits === undefined ? [] : workoutSplits, // [{name: A, id: 1, muscle_group:...}, {name: B, id: 2. muscle_group:...},....], exercises = {A: [exercises...], B: [exercises...]}}
      exercises: exercises === undefined ? {} : exercises, // { A: [...], B: [...], ... }
      workoutForEdit,
      setWorkoutForEdit,
      loading,
    }),
    [workout, workoutSplits, exercises, workoutForEdit, loading],
  );

  return <WorkoutPlanContext.Provider value={value}>{children}</WorkoutPlanContext.Provider>;
};
