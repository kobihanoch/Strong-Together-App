import { useState, useEffect } from "react";
import { cacheGetJSON } from "../cache/cacheUtils";

const useGetCache = (key) => {
  const [cached, setCached] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // First render of key => not hydrated yet
    setHydrated(false);
    // Where there is a key => hydrated true
    if (key) {
      (async () => {
        const cache = await cacheGetJSON(key);
        setCached(cache);
        setHydrated(true);
      })();
    }
  }, [key]);

  return { cached, hydrated };
};

export default useGetCache;
