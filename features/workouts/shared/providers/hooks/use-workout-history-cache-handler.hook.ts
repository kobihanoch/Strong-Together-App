import type { GetExerciseTrackingResponse } from '@strong-together/shared';
import { useCallback, useMemo, useState } from 'react';
import { keyTracking } from '../../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../../../auth/shared/types/auth.types';
import { getUserExerciseTracking } from '../../../history/services/workout-history.service';
import { WorkoutHistoryExerciseTrackingMaps } from '../../../history/types/workout-history.types';

type UseWorkoutHistoryCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useWorkoutHistoryCacheHandler = ({ user, isValidatedWithServer }: UseWorkoutHistoryCacheHandlerProps) => {
  // Raw
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState<WorkoutHistoryExerciseTrackingMaps | undefined>(undefined);
  // Raw - not for useage
  const [exerciseTrackingAnalysis, setExerciseTrackingAnalysis] = useState<
    GetExerciseTrackingResponse['exerciseTrackingAnalysis'] | undefined
  >(undefined);

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

  return { exerciseTrackingMaps, setExerciseTrackingMaps, exerciseTrackingAnalysis, setExerciseTrackingAnalysis, loading };
};

export default useWorkoutHistoryCacheHandler;
