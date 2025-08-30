import { useEffect } from "react";
import { cacheSetJSON } from "../cache/cacheUtils";

const useUpdateCache = (key, value, TTL, enabled = false) => {
  useEffect(() => {
    (async () => {
      // Enabled flag is for data hydration => If data is hydrated from real API info than store cache
      if (!enabled || !key) return;
      await cacheSetJSON(key, value, TTL);

      // Printing to indicate
      if (key.includes("TRACKING"))
        console.log("[Analysis Context]: Cache updated");
      else if (key.includes("WORKOUTPLAN"))
        console.log("[Workout Context]: Cache updated");
      else if (key.includes("AUTH"))
        console.log("[Auth Context]: Cache updated");
      else if (key.includes("INBOX"))
        console.log("[Notifactions Context]: Cache updated");
      else if (key.includes("ANALYTICS"))
        console.log("[Analytics]: Cache updated");
    })();
  }, [key, value, TTL, enabled]);
};

export default useUpdateCache;
