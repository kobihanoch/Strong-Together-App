import { GetExerciseTrackingResponse } from '@strong-together/shared';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { keyTracking } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserExerciseTracking } from '../../history/services/workout-history.service';
import { WorkoutHistoryAnalyzedExerciseTrackingData, WorkoutHistoryExerciseTrackingMaps } from '../../history/types/workout-history.types';
import { checkHasTrainedToday, unpackFromExerciseTrackingData } from '../../history/utils/workout-history-context.util';
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

  // Raw
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState<WorkoutHistoryExerciseTrackingMaps | undefined>(undefined);
  // Raw - not for useage
  const [exerciseTrackingAnalysis, setExerciseTrackingAnalysis] = useState<
    GetExerciseTrackingResponse['exerciseTrackingAnalysis'] | undefined
  >(undefined);

  // Unpacked - derived from raw
  const analyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData | undefined = useMemo(
    () => unpackFromExerciseTrackingData(exerciseTrackingAnalysis),
    [exerciseTrackingAnalysis],
  );

  const hasTrainedToday = useMemo(
    (): boolean => checkHasTrainedToday(analyzedExerciseTrackingData?.lastWorkoutDate, Intl.DateTimeFormat().resolvedOptions().timeZone),
    [analyzedExerciseTrackingData?.lastWorkoutDate],
  );

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async (): Promise<GetExerciseTrackingResponse> => await getUserExerciseTracking(), []);

  // On data function
  const onDataFn = useCallback((data: GetExerciseTrackingResponse): void => {
    setExerciseTrackingMaps(data.exerciseTrackingMaps); // Empty maps if doen;t exist
    setExerciseTrackingAnalysis(data.exerciseTrackingAnalysis);
  }, []);

  // Cache payload
  const cachePayload: GetExerciseTrackingResponse | undefined = useMemo(
    () =>
      exerciseTrackingMaps === undefined || exerciseTrackingAnalysis === undefined
        ? undefined
        : {
            exerciseTrackingMaps,
            exerciseTrackingAnalysis,
          },
    [exerciseTrackingMaps, exerciseTrackingAnalysis],
  );

  // Hook usage
  const { loading } = useCacheAndFetch<GetExerciseTrackingResponse>(
    user, // user prop
    keyTracking, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Analysis Context', // log
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
    [exerciseTrackingMaps, analyzedExerciseTrackingData, hasTrainedToday, loading],
  );

  return <WorkoutHistoryContext.Provider value={value}>{children}</WorkoutHistoryContext.Provider>;
};
