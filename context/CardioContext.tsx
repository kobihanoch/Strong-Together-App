import { AerobicsDailyRecord } from '@strong-together/shared';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { keyCardio } from '../cache/cacheUtils';
import { getUserCardio } from '../services/CardioService';
import useCacheAndFetch from '../hooks/useCacheAndFetch';
import useUpdateGlobalLoading from '../hooks/useUpdateGlobalLoading';
import moment from 'moment';
import {
  CardioContextCachePayload,
  CardioContextDailyMap,
  CardioContextValue,
  CardioContextWeeklyMap,
} from './types/cardioContextTypes.dto';
import { UserAerobicsResponse } from '@strong-together/shared';

const CardioContext = createContext<CardioContextValue | null>(null);

export const CardioProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const [dailyCardioMap, setDailyCardioMap] = useState<CardioContextDailyMap | null>(null);
  const [weeklyCardioMap, setWeeklyCardioMap] = useState<CardioContextWeeklyMap | null>(null);
  const cardioForToday = useMemo(
    (): AerobicsDailyRecord | null => dailyCardioMap?.[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioToday = useMemo((): boolean => !!cardioForToday, [dailyCardioMap]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserCardio(), []);

  // On data function
  const onDataFn = useCallback((data: UserAerobicsResponse | CardioContextCachePayload) => {
    setDailyCardioMap(data.daily);
    setWeeklyCardioMap(data.weekly);
  }, []);

  // Cache payload
  const cachePayload: CardioContextCachePayload = useMemo(
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

  const value = useMemo<CardioContextValue>(
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
