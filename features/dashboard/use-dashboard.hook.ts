import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/providers/AuthProvider';
import { getUserDashboardStats } from './services/dashboard.service';
import { HomeDashboardStats } from './types/dashboard.types';

/**
 * Loads the authenticated user's dashboard statistics.
 *
 * @returns Dashboard data, query loading states, and a manual refetch action.
 */
const useDashboard = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();

  const query = useQuery({
    queryKey: ['home-dashboard', userId],
    queryFn: async (): Promise<HomeDashboardStats> => await getUserDashboardStats(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Data
  const dashboardData = query.data;

  return {
    data: dashboardData,
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    },
    actions: {
      refetch: query.refetch,
    },
  };
};

export default useDashboard;
