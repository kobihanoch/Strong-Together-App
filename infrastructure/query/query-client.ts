import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClientSave } from '@tanstack/query-persist-client-core';
import { QueryClient } from '@tanstack/react-query';
import { CACHE_VERSION } from '../cache/cache.constants';

export const START_WORKOUT_QUERY_SCOPE = 'start-workout';
const QUERY_CACHE_BUSTER = CACHE_VERSION ?? '0.0.0';

export const queryClient = new QueryClient();

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
});

export const queryPersistOptions = {
  persister: queryPersister,
  buster: QUERY_CACHE_BUSTER,
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

/** Clears every TanStack query except the future active-workout query. */
export const clearAllCacheWithoutStartWorkout = async (): Promise<void> => {
  const isStartWorkoutQuery = (query: { queryKey: readonly unknown[] }) => query.queryKey[0] === START_WORKOUT_QUERY_SCOPE;

  await queryClient.cancelQueries({ predicate: (query) => !isStartWorkoutQuery(query) });
  queryClient.removeQueries({ predicate: (query) => !isStartWorkoutQuery(query) });
  queryClient.getMutationCache().clear();

  const hasStartWorkoutQuery = queryClient.getQueryCache().getAll().some(isStartWorkoutQuery);
  if (hasStartWorkoutQuery) {
    await persistQueryClientSave({
      queryClient,
      persister: queryPersister,
      buster: QUERY_CACHE_BUSTER,
    });
  } else {
    await queryPersister.removeClient();
  }

  console.log('\x1b[96m[TanStack Query]: Cache deleted; active workout preserved.\x1b[0m');
};

/** Clears every TanStack query, including the future active-workout query. */
export const clearAllCacheWithStartWorkout = async (): Promise<void> => {
  await queryClient.cancelQueries();
  queryClient.clear();
  await queryPersister.removeClient();
  console.log('\x1b[96m[TanStack Query]: All cache deleted.\x1b[0m');
};
