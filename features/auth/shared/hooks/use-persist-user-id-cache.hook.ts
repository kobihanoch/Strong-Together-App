import { useEffect } from 'react';
import { AppUser } from '../types/auth.types';
import { setCachedAuthSession } from '../../../../infrastructure/query/query-client';

const usePersistUserIdCache = (userIdCache: AppUser['id'] | null | undefined) => {
  useEffect(() => {
    if (userIdCache) void setCachedAuthSession({ userId: userIdCache });
  }, [userIdCache]);

  return;
};

export default usePersistUserIdCache;
