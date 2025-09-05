import { useEffect } from "react";
import { cacheSetJSON } from "../cache/cacheUtils";

const useUpdateCache = (logLabel, key, value, TTL, enabled = false) => {
  useEffect(() => {
    (async () => {
      // Enabled flag is for data hydration => If data is hydrated from real API info than store cache
      if (!enabled || !key) return;
      await cacheSetJSON(key, value, TTL);

      // Printing to indicate
      console.log(`[${logLabel}]: Cache updated`);
    })();
  }, [key, value, TTL, enabled]);
};

export default useUpdateCache;
