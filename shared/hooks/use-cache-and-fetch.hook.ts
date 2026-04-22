import { useEffect, useMemo, useState } from 'react';
import { TTL_48H } from '../../infrastructure/cache/cache.utils';
import { AppUser } from '../../features/auth/shared/types/auth.types';
import useGetCache from './use-get-cache.hook';
import useUpdateCache from './use-update-cache.hook';

const useCacheAndFetch = <CachePaylodType, APIDataType>(
  user: AppUser | { id: AppUser['id'] | null } | null, // {id} only for auth context
  keyBuilderFn: (id: string, days?: number) => string,
  isValidatedByServerFlag: boolean,
  fetchFn: () => Promise<APIDataType>, // Async function
  onDataFn: (data: APIDataType | CachePaylodType) => void,
  cachedPayload: CachePaylodType | null,
  logLabel: string,
) => {
  // Stable cache key
  const cacheKey = useMemo(() => (user?.id ? keyBuilderFn(user.id) : null), [user?.id]);

  // Get cache
  // Triggers on key builded
  const { cached, hydrated: isCacheHydrated } = useGetCache<CachePaylodType>(cacheKey);

  // Flag for API data hydration to enable cache writing
  // Flag stays true until context is unmounting on logout (guard against initial refrence building)
  const [dataHydrated, setDataHydrated] = useState<boolean>(false);

  // Data fetched from cache / API
  const [data, setData] = useState<APIDataType | CachePaylodType | null>(null);

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  const [cacheKnown, setCacheKnown] = useState<boolean>(false);

  // Updates cache auto when cached payload refrence is builded again (on data change)
  useUpdateCache<CachePaylodType>(logLabel, cacheKey, cachedPayload, TTL_48H, dataHydrated);

  // Flow:
  // Load -> has cache? -> If yes procceed with cache | If no notify cache known (bacuse we already know cache stste - false) and now fetch

  // Load from cache
  // Functional only when there is a cache key and cache is hydrated (skip mounting phase)
  useEffect(() => {
    (async () => {
      if (isCacheHydrated && cacheKey) {
        try {
          // Check if cached
          if (cached) {
            // Printing to indicate
            console.log(`[${logLabel}]: Cached`);

            // Set data from cache
            setData(cached);

            // Setters
            onDataFn(cached);
            setLoading(false);
          } else {
            // If not cached => show loading incdication until data is fully fetched from API
            // Indicators: skelaton, loading spinner etc...
            setLoading(true);
          }
        } finally {
          setCacheKnown(true);
        }
      }
    })();
  }, [isCacheHydrated, cacheKey]);

  // Fetch from API => Triggers when server validates tokens (after refresh tokens endpoint completed with no errors)
  // Fire only after cache is known
  useEffect(() => {
    (async () => {
      if (isValidatedByServerFlag && cacheKnown) {
        if (!cacheKey) return;
        try {
          // Call API
          const dataFromAPI = await fetchFn();
          setData(dataFromAPI);

          // Setters
          onDataFn(dataFromAPI);
          setDataHydrated(true);
          // Store in cache (auto)
        } finally {
          setCacheKnown(true);
          setLoading(false);
        }
      }
    })();
  }, [isValidatedByServerFlag, cacheKey, cacheKnown]);

  return { data, loading, cacheKnown };
};

export default useCacheAndFetch;
