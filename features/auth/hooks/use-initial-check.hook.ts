import { SetStateAction, useEffect } from 'react';
import { AppUser } from '../../user/types/user.types';
import { getRefreshToken, getUserId } from '../utils/token-storage.utils';
import { AuthPhase } from '../types/auth.types';

const useInitialCheck = ({
  clearContext,
  attemptServerValidation,
  setUserIdCache,
  setAuthPhase,
  logout,
}: {
  clearContext: () => Promise<void>;
  attemptServerValidation: () => Promise<void>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setAuthPhase: React.Dispatch<SetStateAction<AuthPhase>>;
  logout: () => Promise<void>;
}) => {
  useEffect(() => {
    (async () => {
      // If a prev session => get user id and store it in state
      // At this point an auth key is building and automatically trying to fetch user data from cache
      // Auto start belows useEffect
      setAuthPhase('checking');
      const [cacheUserId, existingRt] = await Promise.all([getUserId(), getRefreshToken()]);
      if (!existingRt || !cacheUserId) {
        // No refresh token -> no session => stay logged out and auto renavifate to auth stack
        console.log('\x1b[31m[Auth Context]: No latest user => Login is required\x1b[0m');
        if (existingRt) {
          await logout();
        } else {
          await clearContext();
        }
        return;
      }
      // Triggers SWR hook logic chain
      // Builds cache key for every feautre - shows data from cache
      setUserIdCache(cacheUserId);
      setAuthPhase('authed');

      // Try to validate with server
      // After success - fetch from server (TanStack)
      await attemptServerValidation();
    })();
  }, [clearContext, attemptServerValidation, setUserIdCache, setAuthPhase, logout]);

  return;
};

export default useInitialCheck;
