import type { AppUser } from '../types/auth.types';
import { useCallback } from 'react';
import { keyAuth } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { fetchSelfUserData } from '../services/auth.service';

type UseAuthCacheHandlerProps = {
  userIdCache: AppUser['id'] | null | undefined;
  isValidatedWithServer: boolean;
};

const useAuthCacheHandler = ({ userIdCache, isValidatedWithServer }: UseAuthCacheHandlerProps) => {
  const fetchFn = useCallback(async () => await fetchSelfUserData(), []);
  const cacheKey = userIdCache ? keyAuth(userIdCache) : null;

  const { data: user, updateAndCache, loading } = useCacheAndFetch<AppUser>(cacheKey, isValidatedWithServer, fetchFn, 'Auth Provider');

  return { loading, user, updateAndCache };
};

export default useAuthCacheHandler;
