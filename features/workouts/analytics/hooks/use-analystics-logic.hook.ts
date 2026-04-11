import { useCallback, useMemo, useState } from 'react';
import { keyAnalytics } from '../../../../infrastructure/cache/cache-keys.utils';
import { useWorkoutHistoryContext } from '../../shared/providers/WorkoutHistoryProvider';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { useWorkoutPlanContext } from '../../shared/providers/WorkoutPlanProvider';
import { getTrackingAnalytics } from '../services/analytics.service';
import useCacheAndFetch from '../../../../hooks/use-cache-and-fetch.hook';
import { GetAnalyticsResponse } from '@strong-together/shared';
import { Analytics1RM, AnalyticsCachePayload, AnalyticsGoals } from '../types/use-analytics.types';

const useAnalysticsLogic = () => {
  const { user, isValidatedWithServer } = useAuth();
  const { analyzedExerciseTrackingData } = useWorkoutHistoryContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = {} } = analyzedExerciseTrackingData ?? {};
  const { workout } = useWorkoutPlanContext();
  const [_1RM, set1RM] = useState<Analytics1RM>({});
  const [adherence, setAdherence] = useState<AnalyticsGoals>({});
  const hasData = useMemo(() => !!analyzedExerciseTrackingData, [analyzedExerciseTrackingData]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async (): Promise<GetAnalyticsResponse> => await getTrackingAnalytics(), []);

  // On data function
  const onDataFn = useCallback((data: GetAnalyticsResponse | AnalyticsCachePayload) => {
    if (!data) return;
    set1RM(data._1RM);
    setAdherence(data.goals);
  }, []);

  // Cache payload
  const cachePayload = useMemo(() => ({ _1RM: _1RM, goals: adherence }), [_1RM, adherence]);

  const validateFlag = useMemo(() => {
    return isValidatedWithServer && hasData;
  }, [isValidatedWithServer, hasData]);

  // Hook usage
  const { loading } = useCacheAndFetch<AnalyticsCachePayload, GetAnalyticsResponse>(
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
        rm: _1RM,
      },
      adherence: {
        adh: adherence,
      },
    },
    loading: hasData ? loading : false,
    hasData,
  };
};

export default useAnalysticsLogic;
