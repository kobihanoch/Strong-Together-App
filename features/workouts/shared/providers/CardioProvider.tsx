import type { CardioDailyRecord } from '../../cardio/types/cardio.types';
import moment from 'moment';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import useCardioCacheHandler from './hooks/use-cardio-cache-handler.hook';
import { CardioProviderValue } from '../../cardio/types/cardio.types';

const CardioContext = createContext<CardioProviderValue | null>(null);

export const CardioProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  const { dailyCardioMap, setDailyCardioMap, weeklyCardioMap, setWeeklyCardioMap, loading } = useCardioCacheHandler({
    user,
    isValidatedWithServer,
  });

  const cardioForToday = useMemo(
    (): CardioDailyRecord | null | undefined =>
      dailyCardioMap === undefined ? undefined : dailyCardioMap?.[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioToday = useMemo((): boolean => !!cardioForToday, [cardioForToday]);

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
    [dailyCardioMap, weeklyCardioMap, setDailyCardioMap, setWeeklyCardioMap, hasDoneCardioToday, cardioForToday, loading],
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
