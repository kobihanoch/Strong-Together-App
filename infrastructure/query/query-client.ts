import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { CACHE_VERSION } from '../cache/cache.constants';
import { queryClient } from './query-client-instance';

export { queryClient } from './query-client-instance';

const QUERY_CACHE_BUSTER = CACHE_VERSION ?? '0.0.0';
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
});

export const queryPersistOptions = {
  persister: queryPersister,
  buster: QUERY_CACHE_BUSTER,
  maxAge: Infinity,
};

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

/** Clears all in-memory and persisted TanStack Query data. */
export const clearTanStackCache = async (): Promise<void> => {
  await queryClient.cancelQueries();
  queryClient.clear();
  await queryPersister.removeClient();
  console.log('\x1b[96m[TanStack Query]: All cache deleted.\x1b[0m');
};
