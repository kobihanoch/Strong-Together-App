import type { UserAerobicsResponse } from '@strong-together/shared';
import { useCallback, useMemo, useState } from 'react';
import { keyCardio } from '../../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../../../auth/shared/types/auth.types';
import { getUserCardio } from '../../../cardio/services/cardio.service';
import { CardioDailyMap, CardioWeeklyMap } from '../../../cardio/types/cardio.types';

type UseCardioCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useCardioCacheHandler = ({ user, isValidatedWithServer }: UseCardioCacheHandlerProps) => {
  const [dailyCardioMap, setDailyCardioMap] = useState<CardioDailyMap | undefined>(undefined);
  const [weeklyCardioMap, setWeeklyCardioMap] = useState<CardioWeeklyMap | undefined>(undefined);

  // Fetch function
  const fetchFn = useCallback(async () => await getUserCardio(), []);

  // On data function
  const onDataFn = useCallback((data: UserAerobicsResponse) => {
    setDailyCardioMap(data.daily);
    setWeeklyCardioMap(data.weekly);
  }, []);

  // Cache payload
  const cachePayload: UserAerobicsResponse | undefined = useMemo(
    () =>
      dailyCardioMap === undefined || weeklyCardioMap === undefined
        ? undefined
        : {
            daily: dailyCardioMap,
            weekly: weeklyCardioMap,
          },
    [dailyCardioMap, weeklyCardioMap],
  );

  // Hook usage
  const { loading } = useCacheAndFetch<UserAerobicsResponse>(
    user, // user prop
    keyCardio, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Cardio Context', // log
  );

  return { dailyCardioMap, setDailyCardioMap, weeklyCardioMap, setWeeklyCardioMap, loading };
};

export default useCardioCacheHandler;
