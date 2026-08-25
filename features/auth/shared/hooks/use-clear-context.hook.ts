import React, { SetStateAction, useCallback } from 'react';
import { cacheDeleteAllCacheWithoutStartWorkout } from '../../../../infrastructure/cache/cache.utils';
import { AppUser } from '../types/auth.types';
import GlobalAuth from '../utils/auth.utils';
import { clearRefreshToken } from '../utils/token-storage.utils';

type UseClearContextProps = {
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setAppleLoading: React.Dispatch<SetStateAction<boolean>>;
  setGoogleLoading: React.Dispatch<SetStateAction<boolean>>;
  setUser: React.Dispatch<SetStateAction<AppUser | null | undefined>>;
  setIsWorkoutMode: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<'checking' | 'authed' | 'guest'>>;
  serverValidatingLockRef: React.MutableRefObject<boolean>;
  attemptedServerValidationRef: React.MutableRefObject<boolean>;
};

const useClearContext = ({
  setIsLoggedIn,
  setLoading,
  setAppleLoading,
  setGoogleLoading,
  setUser,
  setIsWorkoutMode,
  setUserIdCache,
  setIsValidatedWithServer,
  setAuthPhase,
  serverValidatingLockRef,
  attemptedServerValidationRef,
}: UseClearContextProps) => {
  const clearContext = useCallback(async () => {
    await clearRefreshToken();
    await cacheDeleteAllCacheWithoutStartWorkout();
    GlobalAuth.setAccessToken(null);
    GlobalAuth.setUsernameInHeader(null);
    setIsLoggedIn(false);
    setLoading(false);
    setAppleLoading(false);
    setGoogleLoading(false);
    setUser(undefined);
    setIsWorkoutMode(false);
    setUserIdCache(undefined);
    setIsValidatedWithServer(false);
    setAuthPhase('guest');
    serverValidatingLockRef.current = false;
    attemptedServerValidationRef.current = false;
  }, [
    attemptedServerValidationRef,
    serverValidatingLockRef,
    setAppleLoading,
    setAuthPhase,
    setGoogleLoading,
    setIsLoggedIn,
    setIsValidatedWithServer,
    setIsWorkoutMode,
    setLoading,
    setUser,
    setUserIdCache,
  ]);

  return { clearContext };
};

export default useClearContext;
