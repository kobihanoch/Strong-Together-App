import type { GetExerciseTrackingStatsResponse } from '@strong-together/shared';
import { useCallback, useMemo, useState } from 'react';
import { keyHomeDashboard } from '../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../auth/shared/types/auth.types';
import { getUserDashboardStats } from '../services/home-page.service';
import { DashboardStats } from '../types/use-home-page.types';

type UseHomePageCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useHomePageCacheHandler = ({ user, isValidatedWithServer }: UseHomePageCacheHandlerProps) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | undefined>(undefined);

  // Fetch function
  const fetchFn = useCallback(async () => await getUserDashboardStats(), []);

  // On data function
  const onDataFn = useCallback((data: GetExerciseTrackingStatsResponse) => {
    setDashboardStats(data);
  }, []);

  // Cache payload
  const cachePayload: GetExerciseTrackingStatsResponse | undefined = useMemo(
    () => (dashboardStats === undefined ? undefined : dashboardStats),
    [dashboardStats],
  );

  // Hook usage
  const { loading } = useCacheAndFetch<GetExerciseTrackingStatsResponse>(
    user, // user prop
    keyHomeDashboard, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Home Page', // log
  );

  return { dashboardStats, loading };
};

export default useHomePageCacheHandler;
