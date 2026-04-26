import { useCallback, useMemo, useState } from 'react';
import { keyAnalytics } from '../../../../infrastructure/cache/cache-keys.utils';
import { useWorkoutHistoryContext } from '../../shared/providers/WorkoutHistoryProvider';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { useWorkoutPlanContext } from '../../shared/providers/WorkoutPlanProvider';
import { getTrackingAnalytics } from '../services/analytics.service';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { GetAnalyticsResponse } from '@strong-together/shared';
import { Analytics1RM, AnalyticsGoals } from '../types/use-analytics.types';

const useAnalysticsLogic = () => {
  const { user, isValidatedWithServer } = useAuth();
  const { analyzedExerciseTrackingData } = useWorkoutHistoryContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = {} } = analyzedExerciseTrackingData ?? {};
  const { workout } = useWorkoutPlanContext();
  const [_1RM, set1RM] = useState<Analytics1RM | undefined>(undefined);
  const [adherence, setAdherence] = useState<AnalyticsGoals | undefined>(undefined);
  const hasData = useMemo(() => !!analyzedExerciseTrackingData, [analyzedExerciseTrackingData]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async (): Promise<GetAnalyticsResponse> => await getTrackingAnalytics(), []);

  // On data function
  const onDataFn = useCallback((data: GetAnalyticsResponse) => {
    set1RM(data._1RM);
    setAdherence(data.goals);
  }, []);

  // Cache payload
  const cachePayload: GetAnalyticsResponse | undefined = useMemo(
    () => (_1RM === undefined || adherence === undefined ? undefined : { _1RM: _1RM, goals: adherence }),
    [_1RM, adherence],
  );

  const validateFlag = useMemo(() => {
    return isValidatedWithServer && hasData;
  }, [isValidatedWithServer, hasData]);

  // Hook usage
  const { loading } = useCacheAndFetch<GetAnalyticsResponse>(
    user, // user prop
    keyAnalytics, // key builder
    validateFlag, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Analytics', // log
  );

  return {
    data: {
      overview: {
        workoutCount: workoutCount,
        splitsCounter: splitsCounter,
        workoutPlan: workout,
      },
      _1rms: {
        rm: _1RM === undefined ? {} : _1RM,
      },
      adherence: {
        adh: adherence === undefined ? {} : adherence,
      },
    },
    loading: hasData ? loading : false,
    hasData,
  };
};

export default useAnalysticsLogic;
