import { useCallback, useMemo } from 'react';
import { keyHomeDashboard } from '../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../auth/shared/types/auth.types';
import { getUserDashboardStats } from '../services/home-page.service';
import { HomeDashboardStats } from '../types/use-home-page.types';

type UseHomeDashboardCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useHomeDashboardCacheHandler = ({ user, isValidatedWithServer }: UseHomeDashboardCacheHandlerProps) => {
  // Fetch function
  const fetchFn = useCallback(async () => await getUserDashboardStats(), []);
  const cacheKey = useMemo(() => (user?.id ? keyHomeDashboard(user.id) : null), [user?.id]);

  const { data: dashboardStats, loading } = useCacheAndFetch<HomeDashboardStats>(
    cacheKey,
    isValidatedWithServer,
    fetchFn,
    'Home Dashboard',
  );

  return { dashboardStats, loading };
};

export default useHomeDashboardCacheHandler;
