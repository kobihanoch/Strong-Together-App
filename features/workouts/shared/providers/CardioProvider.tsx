import { AerobicsDailyRecord } from '@strong-together/shared';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { keyCardio } from '../../../../infrastructure/cache/cache-keys.utils';
import { getUserCardio } from '../../cardio/services/cardio.service';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import moment from 'moment';
import {
  CardioProviderCachePayload,
  CardioProviderValue,
} from './types/cardio-provider.types';
import { CardioDailyMap, CardioWeeklyMap } from '../../cardio/types/cardio.types';
import { UserAerobicsResponse } from '@strong-together/shared';

const CardioContext = createContext<CardioProviderValue | null>(null);

export const CardioProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const [dailyCardioMap, setDailyCardioMap] = useState<CardioDailyMap | null>(null);
  const [weeklyCardioMap, setWeeklyCardioMap] = useState<CardioWeeklyMap | null>(null);
  const cardioForToday = useMemo(
    (): AerobicsDailyRecord | null => dailyCardioMap?.[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioToday = useMemo((): boolean => !!cardioForToday, [dailyCardioMap]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserCardio(), []);

  // On data function
  const onDataFn = useCallback((data: UserAerobicsResponse | CardioProviderCachePayload) => {
    setDailyCardioMap(data.daily);
    setWeeklyCardioMap(data.weekly);
  }, []);

  // Cache payload
  const cachePayload: CardioProviderCachePayload = useMemo(
    () => ({
      daily: dailyCardioMap,
      weekly: weeklyCardioMap,
    }),
    [dailyCardioMap, weeklyCardioMap],
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch(
    user, // user prop
    keyCardio, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Cardio Context', // log
  );

  // Report analysis loading to global loading
  useUpdateGlobalLoading('Cardio', cacheKnown ? loading : true);

  const value = useMemo<CardioProviderValue>(
    () => ({
      dailyCardioMap,
      weeklyCardioMap,
      setDailyCardioMap,
      setWeeklyCardioMap,
      hasDoneCardioToday,
      cardioForToday,
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

