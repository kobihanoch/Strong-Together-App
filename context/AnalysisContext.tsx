import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { keyTracking } from '../cache/cacheUtils';
import useCacheAndFetch from '../hooks/useCacheAndFetch';
import useUpdateGlobalLoading from '../hooks/useUpdateGlobalLoading';
import { getUserExerciseTracking } from '../services/WorkoutService';
import { GetExerciseTrackingResponse } from '@strong-together/shared';
import { checkHasTrainedToday, unpackFromExerciseTrackingData } from '../utils/analysisContexUtils';
import { useAuth } from './AuthContext';
import {
  AnalysisContextAnalyzedExerciseTrackingData,
  AnalysisContextCachePayload,
  AnalysisContextExerciseTrackingMaps,
  AnalysisContextValue,
} from './types/analysisContextTypes.dto';

const AnalysisContext = createContext<AnalysisContextValue | null>(null);
export const useAnalysisContext = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error('useAnalysisContext must be used within a AnalysisProvider');
  }
  return ctx;
};

/**
 * Analysis Context
 * -----------------
 * Responsibilities:
 * - Fetch raw exerciseTracking data
 * - Derive analyzedExerciseTrackingData via `unpackFromExerciseTrackingData`
 * - Tell whether the user trained today (hasTrainedToday)
 * - Expose a loading flag
 * - Reset state when user logs out (user becomes null)
 */

export const AnalysisProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  // Raw and derived analysis state
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState<AnalysisContextExerciseTrackingMaps | null>(null);

  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState<AnalysisContextAnalyzedExerciseTrackingData | null>(null);

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
  const onDataFn = useCallback((data: GetExerciseTrackingResponse | AnalysisContextCachePayload): void => {
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
  const cachePayload: AnalysisContextCachePayload = useMemo(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps,
      exerciseTrackingAnalysisUnpacked: analyzedExerciseTrackingData,
    }),
    [exerciseTrackingMaps, analyzedExerciseTrackingData],
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch<AnalysisContextCachePayload, GetExerciseTrackingResponse>(
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
  const value = useMemo<AnalysisContextValue>(
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

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
