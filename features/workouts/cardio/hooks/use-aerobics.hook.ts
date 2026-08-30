import { useCallback, useMemo } from 'react';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { getUserCardio } from '../../cardio/services/cardio.service';
import { CardioDailyMap, CardioDailyRecord, CardioWeeklyMap } from '../../cardio/types/cardio.types';
import { keyCardio } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import moment from 'moment';

/**
 * Provides the authenticated user's cached aerobics records and revalidates
 * them after the server session is ready. It also derives today's cardio record
 * and exposes a helper for checking whether a given week contains cardio data.
 *
 * @returns The daily and weekly aerobics maps, today's record, weekly-history
 * indicator, loading state, and a helper for fetching fresh data.
 */
const useAerobics = () => {
  const { user, isValidatedWithServer } = useAuth();
  const fetchFn = useCallback(async () => await getUserCardio(), []);
  const cacheKey = useMemo(() => (user?.id ? keyCardio(user.id) : null), [user?.id]);

  const {
    data: aerobicsMaps,
    fetchAndCache,
    loading,
  } = useCacheAndFetch<{ daily: CardioDailyMap; weekly: CardioWeeklyMap }>(cacheKey, isValidatedWithServer, fetchFn, 'Aerobics');

  const { daily: dailyCardioMap, weekly: weeklyCardioMap } = aerobicsMaps ?? {};

  const cardioForToday = useMemo(
    (): CardioDailyRecord | null | undefined =>
      dailyCardioMap === undefined ? undefined : dailyCardioMap[moment().format('YYYY-MM-DD')]?.[0] || null,
    [dailyCardioMap],
  );
  const hasDoneCardioInWeek = (stringDate: string) => (weeklyCardioMap ? !!weeklyCardioMap[stringDate] : false);

  return { dailyCardioMap, weeklyCardioMap, cardioForToday, hasDoneCardioInWeek, fetchAndCache, loading };
};

export default useAerobics;
