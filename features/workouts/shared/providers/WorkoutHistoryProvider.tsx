import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { keyTracking } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserExerciseTracking } from '../../history/services/workout-history.service';
import { WorkoutHistoryExerciseTrackingMaps } from '../../history/types/workout-history.types';
import { checkHasTrainedToday } from '../../history/utils/workout-history-context.util';

export interface WorkoutHistoryProviderValue {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  updateWorkoutHistory: (exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps) => Promise<void>;
  hasTrainedToday: boolean;
  hasVisibleHistory: boolean;
  loading: boolean;
  fetchLoading: boolean;
}

const WorkoutHistoryContext = createContext<WorkoutHistoryProviderValue | null>(null);

/**
 * Owns the authenticated user's workout-history state and persistent cache.
 *
 * The provider hydrates cached tracking maps, performs the initial server
 * revalidation, and shares derived history indicators with its descendants.
 *
 * @param props - Provider props containing descendant React nodes.
 * @returns A context provider containing the shared workout-history state.
 */
export const WorkoutHistoryProvider = (props: PropsWithChildren) => {
  const { user, isValidatedWithServer } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const fetchFn = useCallback(async () => await getUserExerciseTracking(), []);
  const cacheKey = useMemo(() => (user?.id ? keyTracking(user.id) : null), [user?.id]);
  const { data: exerciseTrackingMaps, updateAndCache, loading: fetchLoading } =
    useCacheAndFetch<WorkoutHistoryExerciseTrackingMaps>(
      cacheKey,
      isValidatedWithServer,
      fetchFn,
      'Workout History',
    );

  const updateWorkoutHistory = useCallback(
    async (updatedExerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps) => {
      setUpdateLoading(true);
      try {
        await updateAndCache(updatedExerciseTrackingMaps);
      } finally {
        setUpdateLoading(false);
      }
    },
    [updateAndCache],
  );

  const hasTrainedToday = useMemo(() => {
    const dates = Object.keys(exerciseTrackingMaps?.byDate ?? {});
    const latestWorkoutDate = dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null;
    return checkHasTrainedToday(latestWorkoutDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [exerciseTrackingMaps]);
  const hasVisibleHistory = Object.keys(exerciseTrackingMaps?.byDate ?? {}).length > 0;

  const value = useMemo<WorkoutHistoryProviderValue>(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps === undefined ? null : exerciseTrackingMaps,
      updateWorkoutHistory,
      hasTrainedToday,
      hasVisibleHistory,
      loading: updateLoading || fetchLoading,
      fetchLoading,
    }),
    [exerciseTrackingMaps, fetchLoading, hasTrainedToday, hasVisibleHistory, updateLoading, updateWorkoutHistory],
  );

  return <WorkoutHistoryContext.Provider value={value}>{props.children}</WorkoutHistoryContext.Provider>;
};

export const useWorkoutHistory = (): WorkoutHistoryProviderValue => {
  const context = useContext(WorkoutHistoryContext);
  if (!context) throw new Error('useWorkoutHistory must be used within a WorkoutHistoryProvider');
  return context;
};
