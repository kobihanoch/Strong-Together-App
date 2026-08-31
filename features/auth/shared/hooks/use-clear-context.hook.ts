import React, { SetStateAction, useCallback } from 'react';
import { clearAllCacheWithoutStartWorkout } from '../../../../infrastructure/query/query-client';
import { AppUser } from '../types/auth.types';
import GlobalAuth from '../utils/auth.utils';
import { clearRefreshToken } from '../utils/token-storage.utils';

type UseClearContextProps = {
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  setAutheticationLoading: React.Dispatch<SetStateAction<boolean>>;
  setAppleLoading: React.Dispatch<SetStateAction<boolean>>;
  setGoogleLoading: React.Dispatch<SetStateAction<boolean>>;
  setIsWorkoutMode: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<'checking' | 'authed' | 'guest'>>;
  serverValidatingLockRef: React.MutableRefObject<boolean>;
  attemptedServerValidationRef: React.MutableRefObject<boolean>;
};

const useClearContext = ({
  setIsLoggedIn,
  setAutheticationLoading,
  setAppleLoading,
  setGoogleLoading,
  setIsWorkoutMode,
  setUserIdCache,
  setIsValidatedWithServer,
  setAuthPhase,
  serverValidatingLockRef,
  attemptedServerValidationRef,
}: UseClearContextProps) => {
  const clearContext = useCallback(async (skipCacheCleanup: boolean = false) => {
    await clearRefreshToken();
    if (!skipCacheCleanup) await clearAllCacheWithoutStartWorkout();
    GlobalAuth.setAccessToken(null);
    GlobalAuth.setUsernameInHeader(null);
    setIsLoggedIn(false);
    setAutheticationLoading(false);
    setAppleLoading(false);
    setGoogleLoading(false);
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
    setAutheticationLoading,
    setUserIdCache,
  ]);

  return { clearContext };
};

export default useClearContext;
