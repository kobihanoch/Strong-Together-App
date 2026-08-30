import moment from 'moment';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { keyCardio } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserCardio } from '../../cardio/services/cardio.service';
import { CardioDailyMap, CardioDailyRecord, CardioWeeklyMap } from '../../cardio/types/cardio.types';

export interface CardioProviderValue {
  dailyCardioMap: CardioDailyMap | undefined;
  weeklyCardioMap: CardioWeeklyMap | undefined;
  cardioForToday: CardioDailyRecord | null | undefined;
  hasDoneCardioInWeek: (stringDate: string) => boolean;
  updateAerobics: (aerobicsMaps: AerobicsMaps) => Promise<void>;
  loading: boolean;
  fetchLoading: boolean;
}

type AerobicsMaps = { daily: CardioDailyMap; weekly: CardioWeeklyMap };

const CardioContext = createContext<CardioProviderValue | null>(null);

/**
 * Owns the authenticated user's aerobics state and persistent cache.
 *
 * Cached data is hydrated first and revalidated after authentication. Derived
 * daily and weekly values are shared by every descendant consumer.
 *
 * @param props - Provider props containing descendant React nodes.
 * @returns A context provider containing the shared aerobics state.
 */
export const CardioProvider = (props: PropsWithChildren) => {
  const { user, isValidatedWithServer } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const fetchFn = useCallback(async () => await getUserCardio(), []);
  const cacheKey = useMemo(() => (user?.id ? keyCardio(user.id) : null), [user?.id]);

  const { data: aerobicsMaps, updateAndCache, loading: fetchLoading } = useCacheAndFetch<AerobicsMaps>(
    cacheKey,
    isValidatedWithServer,
    fetchFn,
    'Aerobics',
  );

  const updateAerobics = useCallback(
    async (updatedAerobicsMaps: AerobicsMaps) => {
      setUpdateLoading(true);
      try {
        await updateAndCache(updatedAerobicsMaps);
      } finally {
        setUpdateLoading(false);
      }
    },
    [updateAndCache],
  );

  const { daily: dailyCardioMap, weekly: weeklyCardioMap } = aerobicsMaps ?? {};
  const cardioForToday = useMemo(
    (): CardioDailyRecord | null | undefined =>
      dailyCardioMap === undefined ? undefined : dailyCardioMap[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioInWeek = useCallback(
    (stringDate: string) => (weeklyCardioMap ? !!weeklyCardioMap[stringDate] : false),
    [weeklyCardioMap],
  );

  const value = useMemo<CardioProviderValue>(
    () => ({
      dailyCardioMap,
      weeklyCardioMap,
      cardioForToday,
      hasDoneCardioInWeek,
      updateAerobics,
      loading: updateLoading || fetchLoading,
      fetchLoading,
    }),
    [cardioForToday, dailyCardioMap, fetchLoading, hasDoneCardioInWeek, updateAerobics, updateLoading, weeklyCardioMap],
  );

  return <CardioContext.Provider value={value}>{props.children}</CardioContext.Provider>;
};

export const useAerobics = (): CardioProviderValue => {
  const context = useContext(CardioContext);
  if (!context) throw new Error('useAerobics must be used within a CardioProvider');
  return context;
};
