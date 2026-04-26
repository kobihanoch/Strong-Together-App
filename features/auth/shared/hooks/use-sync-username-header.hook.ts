import { useEffect } from 'react';
import GlobalAuth from '../utils/auth.utils';
import { AppUser } from '../types/auth.types';

const useSyncUsernameHeader = (user: AppUser | null | undefined) => {
  useEffect(() => {
    GlobalAuth.setUsernameInHeader(user?.username ?? null);
  }, [user]);

  return;
};

export default useSyncUsernameHeader;
