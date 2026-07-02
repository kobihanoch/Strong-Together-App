import { createContext, useContext, useMemo } from 'react';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { WorkoutHistoryAnalyzedExerciseTrackingData } from '../../history/types/workout-history.types';
import { checkHasTrainedToday, unpackFromExerciseTrackingData } from '../../history/utils/workout-history-context.util';
import useWorkoutHistoryCacheHandler from './hooks/use-workout-history-cache-handler.hook';
import { WorkoutHistoryProviderValue } from './types/workout-history-provider.types';

const WorkoutHistoryContext = createContext<WorkoutHistoryProviderValue | null>(null);
export const useWorkoutHistoryContext = () => {
  const ctx = useContext(WorkoutHistoryContext);
  if (!ctx) {
    throw new Error('useWorkoutHistoryContext must be used within a WorkoutHistoryProvider');
  }
  return ctx;
};

/**
 * Workout History Context Context
 * -----------------
 * Responsibilities:
 * - Fetch raw exerciseTracking data
 * - Derive analyzedExerciseTrackingData via `unpackFromExerciseTrackingData`
 * - Tell whether the user trained today (hasTrainedToday)
 * - Expose a loading flag
 * - Reset state when user logs out (user becomes null)
 */

export const WorkoutHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const { exerciseTrackingMaps, setExerciseTrackingMaps, exerciseTrackingAnalysis, setExerciseTrackingAnalysis, loading } =
    useWorkoutHistoryCacheHandler({ user, isValidatedWithServer });

  // Unpacked - derived from raw
  const analyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData | undefined = useMemo(
    () => unpackFromExerciseTrackingData(exerciseTrackingAnalysis),
    [exerciseTrackingAnalysis],
  );

  const hasTrainedToday = useMemo(
    (): boolean => checkHasTrainedToday(analyzedExerciseTrackingData?.lastWorkoutDate, Intl.DateTimeFormat().resolvedOptions().timeZone),
    [analyzedExerciseTrackingData?.lastWorkoutDate],
  );

  // Report analysis loading to global loading
  useUpdateGlobalLoading('Analysis', loading);

  // Memoized context value
  const value = useMemo<WorkoutHistoryProviderValue>(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps === undefined ? null : exerciseTrackingMaps,
      setExerciseTrackingMaps,
      analyzedExerciseTrackingData: analyzedExerciseTrackingData === undefined ? null : analyzedExerciseTrackingData,
      setExerciseTrackingAnalysis,
      hasTrainedToday,
      loading,
    }),
    [
      exerciseTrackingMaps,
      setExerciseTrackingMaps,
      analyzedExerciseTrackingData,
      setExerciseTrackingAnalysis,
      hasTrainedToday,
      loading,
    ],
  );

  return <WorkoutHistoryContext.Provider value={value}>{children}</WorkoutHistoryContext.Provider>;
};
