import { useCallback, useState } from 'react';
import { queryClient } from '../../infrastructure/query/query-client-instance';

export const usePullToRefresh = (queryNames: readonly string[]) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all(
        queryNames.map((queryName) => queryClient.refetchQueries({ queryKey: [queryName], type: 'active' })),
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [queryNames]);

  return { isRefreshing, refresh };
};
