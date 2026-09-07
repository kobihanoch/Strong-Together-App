import { SetStateAction, useEffect } from 'react';
import { AppUser } from '../../../user/types/user.types';
import { getRefreshToken, getUserId } from '../../utils/token-storage.utils';

const useInitialCheck = ({
  attemptServerValidation,
  setUserIdCache,
  setAuthPhase,
  logout,
}: {
  attemptServerValidation: () => Promise<void>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setAuthPhase: React.Dispatch<SetStateAction<'checking' | 'authed' | 'guest'>>;
  logout: () => Promise<void>;
}) => {
  useEffect(() => {
    (async () => {
      setAuthPhase('checking');
      const [cacheUserId, existingRt] = await Promise.all([getUserId(), getRefreshToken()]);
      if (!existingRt || !cacheUserId) {
        console.log('\x1b[31m[Auth Context]: No latest user => Login is required\x1b[0m');
        return await logout();
      }
      setUserIdCache(cacheUserId); // User ID becomes valid to AuthProvider consumer (feature hooks)
      setAuthPhase('authed'); // App Stack is rendered
      await attemptServerValidation(); // After validation -> TanStack fetching
    })();
  }, [attemptServerValidation, setUserIdCache, setAuthPhase, logout]);

  return;
};

export default useInitialCheck;
