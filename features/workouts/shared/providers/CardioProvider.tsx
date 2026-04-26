import { AerobicsDailyRecord, UserAerobicsResponse } from '@strong-together/shared';
import moment from 'moment';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { keyCardio } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserCardio } from '../../cardio/services/cardio.service';
import { CardioDailyMap, CardioWeeklyMap } from '../../cardio/types/cardio.types';
import { CardioProviderValue } from './types/cardio-provider.types';

const CardioContext = createContext<CardioProviderValue | null>(null);

export const CardioProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const [dailyCardioMap, setDailyCardioMap] = useState<CardioDailyMap | undefined>(undefined);
  const [weeklyCardioMap, setWeeklyCardioMap] = useState<CardioWeeklyMap | undefined>(undefined);
  const cardioForToday = useMemo(
    (): AerobicsDailyRecord | null | undefined =>
      dailyCardioMap === undefined ? undefined : dailyCardioMap?.[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioToday = useMemo((): boolean => !!cardioForToday, [dailyCardioMap]);

  // -------------------------- useCacheHandler props ------------------------------

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

  // Report analysis loading to global loading
  useUpdateGlobalLoading('Cardio', loading);

  const value = useMemo<CardioProviderValue>(
    () => ({
      dailyCardioMap: dailyCardioMap === undefined ? null : dailyCardioMap,
      weeklyCardioMap: weeklyCardioMap === undefined ? null : weeklyCardioMap,
      setDailyCardioMap,
      setWeeklyCardioMap,
      hasDoneCardioToday,
      cardioForToday: cardioForToday === undefined ? null : cardioForToday,
      loading,
    }),
    [dailyCardioMap, weeklyCardioMap, hasDoneCardioToday, cardioForToday, loading],
  );

  return <CardioContext.Provider value={value}>{children}</CardioContext.Provider>;
};

export const useCardioContext = () => {
  const context = useContext(CardioContext);
  if (!context) {
    throw new Error('useCardioContext must be used within a CardioProvider');
  }
  return context;
};
