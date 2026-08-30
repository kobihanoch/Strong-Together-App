import { WorkoutHistoryExerciseTrackingMaps } from '../types/workout-history.types';
import { useCallback, useMemo } from 'react';
import { keyTracking } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserExerciseTracking } from '../services/workout-history.service';
import { checkHasTrainedToday } from '../utils/workout-history-context.util';

/**
 * Provides the authenticated user's workout-history data using a cache-first,
 * server-revalidated flow. It also derives whether the user has trained today
 * and whether any history is available for display.
 *
 * @returns The workout-history maps, loading state, derived history indicators,
 * and helpers for fetching fresh data or updating both state and cache.
 */
const useWorkoutHistory = () => {
  const { user, isValidatedWithServer } = useAuth();
  const fetchFn = useCallback(async () => await getUserExerciseTracking(), []);
  const cacheKey = useMemo(() => (user?.id ? keyTracking(user.id) : null), [user?.id]);
  const {
    data: exerciseTrackingMaps,
    fetchAndCache,
    loading,
  } = useCacheAndFetch<WorkoutHistoryExerciseTrackingMaps>(cacheKey, isValidatedWithServer, fetchFn, 'Workout History');

  // Derived values
  const hasTrainedToday = (() => {
    const dates = Object.keys(exerciseTrackingMaps?.byDate ?? {});
    const latestWorkoutDate = dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null;
    return checkHasTrainedToday(latestWorkoutDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
  })();
  const hasVisibleHistory = Object.keys(exerciseTrackingMaps?.byDate ?? {}).length > 0;

  return {
    exerciseTrackingMaps: exerciseTrackingMaps === undefined ? null : exerciseTrackingMaps,
    fetchAndCache,
    hasTrainedToday,
    hasVisibleHistory,
    loading,
  };
};

export default useWorkoutHistory;
