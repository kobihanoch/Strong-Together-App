import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
});

/** Logs the query keys whose data was restored from persisted storage. */
export const logRestoredQueryCache = (): void => {
  const cachedQueryKeys = queryClient
    .getQueryCache()
    .getAll()
    .filter((query) => query.state.data !== undefined)
    .map((query) => JSON.stringify(query.queryKey));

  if (cachedQueryKeys.length > 0) {
    console.log(`[TanStack Query]: Restored cached data for ${cachedQueryKeys.join(', ')}`);
  }
};

/** Clears both the in-memory query cache and its persisted snapshot. */
export const clearQueryCache = async (): Promise<void> => {
  await queryClient.cancelQueries();
  queryClient.clear();
  await queryPersister.removeClient();
  console.log('\x1b[96m[Cache]: All user cache deleted.\x1b[0m');
};
