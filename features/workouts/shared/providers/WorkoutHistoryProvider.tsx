import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { keyTracking } from '../../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../../hooks/useCacheAndFetch';
import useUpdateGlobalLoading from '../../../../../hooks/useUpdateGlobalLoading';
import { getUserExerciseTracking } from '../../history/services/workout-history.service';
import { GetExerciseTrackingResponse } from '@strong-together/shared';
import { checkHasTrainedToday, unpackFromExerciseTrackingData } from '../../history/utils/workout-history-context.util';
import { useAuth } from '../../../../guest-user/auth/shared/providers/AuthProvider';
import {
  WorkoutHistoryProviderCachePayload,
  WorkoutHistoryProviderValue,
} from './types/workout-history-provider.types';
import {
  WorkoutHistoryAnalyzedExerciseTrackingData,
  WorkoutHistoryExerciseTrackingMaps,
} from '../../history/types/workout-history.types';

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

  // Raw and derived analysis state
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState<WorkoutHistoryExerciseTrackingMaps | null>(null);

  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState<WorkoutHistoryAnalyzedExerciseTrackingData | null>(null);

  const hasTrainedToday = useMemo(
    (): boolean =>
      checkHasTrainedToday(
        analyzedExerciseTrackingData?.lastWorkoutDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    [analyzedExerciseTrackingData?.lastWorkoutDate],
  );

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async (): Promise<GetExerciseTrackingResponse> => await getUserExerciseTracking(), []);

  // On data function
  const onDataFn = useCallback((data: GetExerciseTrackingResponse | WorkoutHistoryProviderCachePayload): void => {
    if (!data) return;
    // Raw data from server - unpack
    // Data from cache - already unpacked
    setExerciseTrackingMaps(data.exerciseTrackingMaps); // Empty maps if doen;t exist
    // API data (packed)
    if ('exerciseTrackingAnalysis' in data) {
      setAnalyzedExerciseTrackingData(unpackFromExerciseTrackingData(data.exerciseTrackingAnalysis));
    }
    // Cached data (unpacked)
    else if ('exerciseTrackingAnalysisUnpacked' in data) {
      setAnalyzedExerciseTrackingData(data.exerciseTrackingAnalysisUnpacked);
    }
  }, []);

  // Cache payload
  const cachePayload: WorkoutHistoryProviderCachePayload = useMemo(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps,
      exerciseTrackingAnalysisUnpacked: analyzedExerciseTrackingData,
    }),
    [exerciseTrackingMaps, analyzedExerciseTrackingData],
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch<WorkoutHistoryProviderCachePayload, GetExerciseTrackingResponse>(
    user, // user prop
    keyTracking, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Analysis Context', // log
  );

  // Report analysis loading to global loading
  useUpdateGlobalLoading('Analysis', cacheKnown ? loading : true);

  // Memoized context value
  const value = useMemo<WorkoutHistoryProviderValue>(
    () => ({
      exerciseTrackingMaps,
      setExerciseTrackingMaps,
      analyzedExerciseTrackingData,
      setAnalyzedExerciseTrackingData,
      hasTrainedToday,
      loading,
    }),
    [exerciseTrackingMaps, analyzedExerciseTrackingData, hasTrainedToday, loading],
  );

  return <WorkoutHistoryContext.Provider value={value}>{children}</WorkoutHistoryContext.Provider>;
};
