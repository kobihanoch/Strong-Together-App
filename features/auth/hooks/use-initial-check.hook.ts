import { SetStateAction, useEffect } from 'react';
import { AppUser } from '../../user/types/user.types';
import { getCachedAuthSession } from '../../../infrastructure/query/query-client';
import { getRefreshToken } from '../utils/token-storage.utils';

const useInitialCheck = ({
  clearContext,
  attemptServerValidation,
  setUserIdCache,
  setIsLoggedIn,
  setAuthPhase,
  logout,
}: {
  clearContext: (skipCacheCleanup: boolean) => Promise<void>;
  attemptServerValidation: () => Promise<void>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<'authed' | 'guest' | 'checking'>>;
  logout: (skipCacheCleanup: boolean) => Promise<void>;
}) => {
  useEffect(() => {
    (async () => {
      // If a prev session => get user id and store it in state
      // At this point an auth key is building and automatically trying to fetch user data from cache
      // Auto start belows useEffect
      setAuthPhase('checking');
      const cacheUserId = getCachedAuthSession()?.userId;
      const existingRt = await getRefreshToken();
      if (!existingRt || !cacheUserId) {
        // No refresh token -> no session => stay logged out and auto renavifate to auth stack
        console.log('\x1b[31m[Auth Context]: No latest user => Login is required\x1b[0m');
        if (existingRt) {
          await logout(false);
        } else {
          await clearContext(false);
        }
        return;
      }
      // Triggers SWR hook logic chain
      // Builds cache key for every feautre - shows data from cache
      setUserIdCache(cacheUserId);
      setIsLoggedIn(true);
      setAuthPhase('authed');

      // Try to validate with server
      // After success - fetch from server (TanStack)
      await attemptServerValidation();
    })();
  }, [clearContext, attemptServerValidation, setUserIdCache, setIsLoggedIn, setAuthPhase, logout]);

  return;
};

export default useInitialCheck;
