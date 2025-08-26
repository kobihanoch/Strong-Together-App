import { useEffect } from "react";
import {
  cacheDeleteKey,
  cacheGetJSON,
  cacheSetJSON,
} from "../cache/cacheUtils";

const useUpdateCache = (key, value, TTL, enabled = true) => {
  useEffect(() => {
    (async () => {
      if (!enabled || !key) return;
      await cacheSetJSON(key, value, TTL);

      // Printing to indicate
      if (key.includes("TRACKING"))
        console.log("[Analysis Context]: Cache updated!");
      else if (key.includes("WORKOUTPLAN"))
        console.log("[Workout Context]: Cache updated!");
      else if (key.includes("WORKOUTPLAN"))
        console.log("[Workout Context]: Cache updated!");
      else if (key.includes("ANALYTICS"))
        console.log("[Analytics]: Cache updated!");
    })();
  }, [key, value, TTL]);
};

export default useUpdateCache;
