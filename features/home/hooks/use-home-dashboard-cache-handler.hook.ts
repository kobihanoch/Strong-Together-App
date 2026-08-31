import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { getUserDashboardStats } from '../services/home-page.service';
import { HomeDashboardStats } from '../types/use-home-page.types';

/**
 * Provides the authenticated user's persisted home-dashboard server state.
 *
 * The query remains disabled until server authentication succeeds, then
 * revalidates cached dashboard statistics using the same conventions as the
 * other authenticated TanStack feature hooks.
 *
 * @returns Dashboard data, loading states, and query actions.
 */
const useHomeDashboardCacheHandler = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();

  const query = useQuery({
    queryKey: ['home-dashboard', userId],
    queryFn: async (): Promise<HomeDashboardStats> => await getUserDashboardStats(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    data: { dashboardStats: query.data },
    loadingStates: { isLoading: query.isLoading, isFetching: query.isFetching },
    actions: { refetch: query.refetch },
  };
};

export default useHomeDashboardCacheHandler;
