import { createContext, useContext, useMemo } from 'react';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { checkHasTrainedToday } from '../../history/utils/workout-history-context.util';
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
 * - Tell whether the user trained today (hasTrainedToday)
 * - Expose a loading flag
 * - Reset state when user logs out (user becomes null)
 */

export const WorkoutHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const { exerciseTrackingMaps, setExerciseTrackingMaps, loading } = useWorkoutHistoryCacheHandler({ user, isValidatedWithServer });

  const hasTrainedToday = useMemo((): boolean => {
    const dates = Object.keys(exerciseTrackingMaps?.byDate ?? {});
    const latestWorkoutDate = dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null;
    return checkHasTrainedToday(latestWorkoutDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [exerciseTrackingMaps?.byDate]);

  // Report analysis loading to global loading
  useUpdateGlobalLoading('Analysis', loading);

  // Memoized context value
  const value = useMemo<WorkoutHistoryProviderValue>(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps === undefined ? null : exerciseTrackingMaps,
      setExerciseTrackingMaps,
      hasTrainedToday,
      loading,
    }),
    [exerciseTrackingMaps, setExerciseTrackingMaps, hasTrainedToday, loading],
  );

  return <WorkoutHistoryContext.Provider value={value}>{children}</WorkoutHistoryContext.Provider>;
};
