import React, { SetStateAction, useCallback } from 'react';
import { clearTanStackCache } from '../../../infrastructure/query/query-client';
import { AppUser } from '../../user/types/user.types';
import GlobalAuth from '../utils/auth.utils';
import { clearAuthStorage } from '../utils/token-storage.utils';
import { AuthPhase } from '../types/auth.types';
import { useWorkoutSessionStore } from '../../workouts/session/hooks/use-workout-session-store.hook';
import { clearWorkoutSessionStorage } from '../../workouts/session/utils/workout-session-cache.utils';

type UseClearContextProps = {
  setAutheticationLoading: React.Dispatch<SetStateAction<boolean>>;
  setAppleLoading: React.Dispatch<SetStateAction<boolean>>;
  setGoogleLoading: React.Dispatch<SetStateAction<boolean>>;
  setIsWorkoutMode: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<AuthPhase>>;
  serverValidatingLockRef: React.MutableRefObject<boolean>;
  attemptedServerValidationRef: React.MutableRefObject<boolean>;
};

const useClearContext = ({
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
  const clearContext = useCallback(
    async () => {
      await clearAuthStorage();
      await clearTanStackCache();
      useWorkoutSessionStore.getState().resetWorkout();
      await clearWorkoutSessionStorage();
      GlobalAuth.setAccessToken(null);
      GlobalAuth.setUsernameInHeader(null);
      setAutheticationLoading(false);
      setAppleLoading(false);
      setGoogleLoading(false);
      setIsWorkoutMode(false);
      setUserIdCache(undefined);
      setIsValidatedWithServer(false);
      setAuthPhase('guest');
      serverValidatingLockRef.current = false;
      attemptedServerValidationRef.current = false;
    },
    [
      attemptedServerValidationRef,
      serverValidatingLockRef,
      setAppleLoading,
      setAuthPhase,
      setGoogleLoading,
      setIsValidatedWithServer,
      setIsWorkoutMode,
      setAutheticationLoading,
      setUserIdCache,
    ],
  );

  return { clearContext };
};

export default useClearContext;
