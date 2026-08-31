import { useEffect } from 'react';
import { cacheSetJSON } from '../../../../infrastructure/cache/cache.constants';
import { AppUser } from '../types/auth.types';

const usePersistUserIdCache = (userIdCache: AppUser['id'] | null | undefined) => {
  useEffect(() => {
    if (userIdCache !== undefined) cacheSetJSON<AppUser['id'] | null>('CACHE:USER_ID', userIdCache);
  }, [userIdCache]);

  return;
};

export default usePersistUserIdCache;
