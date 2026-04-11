import { useState, useEffect } from 'react';
import { cacheGetJSON } from '../infrastructure/cache/cache.utils';

const useGetCache = <T>(key: string | null): { cached: T | null; hydrated: boolean } => {
  const [cached, setCached] = useState<T | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    // First render of key => not hydrated yet
    setHydrated(false);
    // Where there is a key => hydrated true
    if (key) {
      (async () => {
        const cache = await cacheGetJSON<T>(key);
        setCached(cache);
        setHydrated(true);
      })();
    }
  }, [key]);

  return { cached, hydrated };
};

export default useGetCache;
