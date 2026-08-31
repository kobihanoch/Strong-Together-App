import { useCallback, useEffect, useState } from 'react';
import { cacheGetJSON, cacheSetJSON } from '../../infrastructure/cache/cache.constants';

/**
 * Hydrates data from a local cache and revalidates it against the server once
 * the server session is ready. It also exposes helpers for fetching fresh data
 * or updating both the local state and cache manually.
 *
 * @template APIDataType The shape of the cached and fetched data.
 * @param cacheKey Storage key for the data, or `null` when data loading is disabled.
 * @param isValidatedByServerFlag Whether the server session is ready for revalidation.
 * @param fetchFn Stable asynchronous function that retrieves fresh data from the API.
 * @param logLabel Label used for cache-related diagnostic logging.
 * @returns The current data and loading state, plus state/cache update helpers.
 */
const useCacheAndFetch = <APIDataType>(
  cacheKey: string | null,
  isValidatedByServerFlag: boolean,
  fetchFn: () => Promise<APIDataType | null>,
  logLabel: string,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<APIDataType | null | undefined>(undefined);
  const [cacheHydrated, setCacheHydrated] = useState<boolean>(false);

  const fetchAndCache = useCallback(async () => {
    if (!cacheKey) return;
    try {
      setLoading(true);
      const dataFromAPI = await fetchFn();
      setData(dataFromAPI);
      await cacheSetJSON<APIDataType | null>(cacheKey, dataFromAPI);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn]);

  const updateAndCache = useCallback(
    async (updater: APIDataType | null | undefined | ((prev: APIDataType | null | undefined) => APIDataType | null | undefined)) => {
      if (!cacheKey) return;
      try {
        let nextData: APIDataType | null | undefined;
        setData((prev) => {
          nextData =
            typeof updater === 'function'
              ? (updater as (prev: APIDataType | null | undefined) => APIDataType | null | undefined)(prev)
              : updater;
          return nextData;
        });
        await cacheSetJSON<APIDataType | null | undefined>(cacheKey, nextData!);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey],
  );

  // --------------------- SWR LOGIC ---------------------------------------------

  // Flow:
  // Load -> has cache? -> If yes procceed with cache | If no notify cache known (bacuse we already know cache stste - false) and now fetch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cacheKey) {
        setData(undefined);
        setLoading(false);
        setCacheHydrated(false);
        return;
      }

      // Only if cache key exists (user session is already initlized) and cached payload has already been through check (not undefined)
      setCacheHydrated(false);
      if (cacheKey !== undefined) {
        const cached = await cacheGetJSON<APIDataType>(cacheKey);
        if (cancelled) return;

        if (cached) {
          console.log(`[${logLabel}]: Cached`);
          setData(cached);
          setLoading(false);
        } else {
          // If not cached => show loading incdication until data is fully fetched from API
          // Indicators: skelaton, loading spinner etc...
          setLoading(true);
        }
        setCacheHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, logLabel]);

  // Fetch from API => Triggers when server validates tokens (after refresh tokens endpoint completed with no errors)
  // Fire only after cache is known
  useEffect(() => {
    (async () => {
      if (isValidatedByServerFlag && cacheHydrated) {
        if (!cacheKey) return;
        // Call API
        await fetchAndCache();
      }
    })();
  }, [isValidatedByServerFlag, cacheKey, cacheHydrated, fetchAndCache]);

  return { loading, data, updateAndCache };
};

export default useCacheAndFetch;
