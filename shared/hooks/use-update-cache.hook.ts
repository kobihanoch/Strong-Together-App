import { useEffect } from 'react';
import { cacheSetJSON } from '../../infrastructure/cache/cache.utils';

const useUpdateCache = <CachePayloadType>(
  logLabel: string,
  key: string | null,
  value: CachePayloadType | null,
  TTL: number,
  enabled: boolean = false,
): void => {
  useEffect(() => {
    (async () => {
      // Enabled flag is for data hydration => If data is hydrated from real API info than store cache
      if (!enabled || !key || !value) return;
      await cacheSetJSON(key, value, TTL);

      // Printing to indicate
      console.log(`[${logLabel}]: Cache updated`);
    })();
  }, [key, value, TTL, enabled]);
};

export default useUpdateCache;
