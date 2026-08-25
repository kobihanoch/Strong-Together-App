import React, { createContext, useContext, useMemo } from 'react';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import useWorkoutPlanCacheHandler from './hooks/use-workout-plan-cache-handler.hook';
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

  const { workout, setWorkout, loading } = useWorkoutPlanCacheHandler({
    user,
    isValidatedWithServer,
  });

  // Derived data from workout
  const workoutSplits = useMemo(() => workout?.workoutSplits ?? [], [workout]);

  // Report workout plan loading to global loading
  useUpdateGlobalLoading('WorkoutPlan', loading);

  // Memoized context value
  const value = useMemo<WorkoutPlanProviderValue>(
    () => ({
      workout: workout === undefined ? null : workout,
      setWorkout,
      workoutSplits: workoutSplits === undefined ? [] : workoutSplits,
      loading,
    }),
    [workout, setWorkout, workoutSplits, loading],
  );

  return <WorkoutPlanContext.Provider value={value}>{children}</WorkoutPlanContext.Provider>;
};
