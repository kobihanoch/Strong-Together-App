import { useEffect, useMemo, useState } from "react";
import { TTL_48H } from "../cache/cacheUtils";
import useGetCache from "./useGetCache";
import useUpdateCache from "./useUpdateCache";

const useCacheAndFetch = (
  user,
  keyBuilderFn,
  isValidatedByServerFlag,
  fetchFn,
  onDataFn,
  cachedPayload,
  logLabel
) => {
  // Stable cache key
  const cacheKey = useMemo(
    () => (user?.id ? keyBuilderFn(user.id) : null),
    [user?.id]
  );

  // Get cache
  // Triggers on key builded
  const { cached, hydrated: isCacheHydrated } = useGetCache(cacheKey);

  // Flag for API data hydration to enable cache writing
  // Flag stays true until context is unmounting on logout (guard against initial refrence building)
  const [dataHydrated, setDataHydrated] = useState(false);

  // Data fetched from cache / API
  const [data, setData] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  const [cacheKnown, setCacheKnown] = useState(false);

  // Updates cache auto when cached payload refrence is builded again (on data change)
  useUpdateCache(cacheKey, cachedPayload, TTL_48H, dataHydrated);

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
  useEffect(() => {
    (async () => {
      if (isValidatedByServerFlag) {
        try {
          // Call API
          const dataFromAPI = await fetchFn();
          setData(dataFromAPI);

          // Setters
          onDataFn(dataFromAPI);
          setDataHydrated(true);
          // Store in cache (auto)
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [isValidatedByServerFlag]);

  return { data, loading, cacheKnown };
};

export default useCacheAndFetch;
