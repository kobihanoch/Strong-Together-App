import { GetAuthenticatedUserByIdResponse } from '@strong-together/shared';
import { useCallback } from 'react';
import { keyAuth } from '../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../shared/hooks/use-cache-and-fetch.hook';
import { fetchSelfUserData } from '../services/auth.service';
import { AppUser } from '../types/auth.types';

type UseAuthCacheHandlerProps = {
  userIdCache: AppUser['id'] | null | undefined;
  isValidatedWithServer: boolean;
  user: AppUser | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null | undefined>>;
};

const useAuthCacheHandler = ({ userIdCache, isValidatedWithServer, user, setUser }: UseAuthCacheHandlerProps) => {
  const fetchFn = useCallback(async () => await fetchSelfUserData(), []);

  const onDataFn = useCallback((u: GetAuthenticatedUserByIdResponse) => {
    setUser(u);
  }, [setUser]);

  const { loading: userDataLoading } = useCacheAndFetch<GetAuthenticatedUserByIdResponse>(
    { id: userIdCache },
    keyAuth,
    isValidatedWithServer,
    fetchFn,
    onDataFn,
    user,
    'Auth Context',
  );

  return { userDataLoading };
};

export default useAuthCacheHandler;
