import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppUser } from '../../features/auth/shared/types/auth.types';
import { cacheGetJSON, cacheSetJSON } from '../../infrastructure/cache/cache.utils';

const useCacheAndFetch = <APIDataType>(
  user: AppUser | { id: AppUser['id'] | null | undefined } | null, // {id} only for auth context
  keyBuilderFn: (id: string, days?: number) => string,
  isValidatedByServerFlag: boolean,
  fetchFn: () => Promise<APIDataType>, // Async function
  onDataFn: (data: APIDataType) => void,
  payloadToCache: APIDataType | null | undefined,
  logLabel: string,
) => {
  // Stable cache key
  // Whenever a user id is passed cache key is triggered
  const cacheKey = useMemo(() => (user?.id ? keyBuilderFn(user.id) : null), [user?.id]);

  const [loading, setLoading] = useState<boolean>(false);
  const [cachedPayload, setCachedPayload] = useState<APIDataType | null | undefined>(undefined);
  const [isPayloadFromAPI, setIsPayloadFromAPI] = useState<boolean>(false);

  const getCache = useCallback(async () => {
    if (!cacheKey) return;
    return await cacheGetJSON<APIDataType>(cacheKey);
  }, [cacheKey]);

  // --------------------- UPDATE CACHE ---------------------------------------------
  // Updates cache auto when cached payload refrence is builded again (on data change)
  useEffect(() => {
    (async () => {
      // Allow updating only when cache payload is known (not undefiened - may be null)
      if (!cacheKey || payloadToCache === undefined || !isPayloadFromAPI) return;
      // Update cache only when fresh data from API arrives
      await cacheSetJSON<APIDataType | null>(cacheKey, payloadToCache);

      // Reset API flag state
      setIsPayloadFromAPI(false);

      // Printing to indicate
      console.log(`[${logLabel}]: Cache updated`);
    })();
  }, [cacheKey, payloadToCache, isPayloadFromAPI]);

  // --------------------- SWR LOGIC ---------------------------------------------
  // Flow:
  // Load -> has cache? -> If yes procceed with cache | If no notify cache known (bacuse we already know cache stste - false) and now fetch

  // Load from cache
  // Functional only when there is a cache key and cache is hydrated (skip mounting phase)
  useEffect(() => {
    (async () => {
      // Only if cache key exists (user session is already initlized) and cached payload has already been through check (not undefined)
      if (cacheKey) {
        // Check if cached
        // Update cached state
        const cached = await getCache();
        setCachedPayload(cached);
        // Use cached payload only if not null (known and exists)
        if (cached) {
          // Printing to indicate
          console.log(`[${logLabel}]: Cached`);

          // Setters
          onDataFn(cached);
          setLoading(false);
        } else {
          // If not cached => show loading incdication until data is fully fetched from API
          // Indicators: skelaton, loading spinner etc...
          setLoading(true);
        }
      }
    })();
  }, [cacheKey]);

  // Fetch from API => Triggers when server validates tokens (after refresh tokens endpoint completed with no errors)
  // Fire only after cache is known
  useEffect(() => {
    (async () => {
      if (isValidatedByServerFlag && cachedPayload !== undefined) {
        if (!cacheKey) return;
        // Call API
        const dataFromAPI = await fetchFn();

        // Setters
        onDataFn(dataFromAPI);

        // Update API flag state
        setIsPayloadFromAPI(true);

        // Store in cache (auto after setters update)
        setLoading(false);
      }
    })();
  }, [isValidatedByServerFlag, cacheKey, cachedPayload]);

  return { loading };
};

export default useCacheAndFetch;
