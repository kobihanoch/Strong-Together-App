import { AxiosError } from 'axios';
import React, { SetStateAction, useCallback } from 'react';
import { refreshAndRotateTokens } from '../services/auth.service';
import { AppUser } from '../types/auth.types';
import GlobalAuth from '../utils/auth.utils';
import { saveRefreshToken } from '../utils/token-storage.utils';

type UseServerValidationProps = {
  clearContext: () => Promise<void>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  serverValidatingLockRef: React.MutableRefObject<boolean>;
  attemptedServerValidationRef: React.MutableRefObject<boolean>;
};

const useServerValidation = ({
  clearContext,
  setIsValidatedWithServer,
  setUserIdCache,
  serverValidatingLockRef,
  attemptedServerValidationRef,
}: UseServerValidationProps) => {
  const attemptServerValidation = useCallback(async (): Promise<void> => {
    try {
      // Avoid duplicate refresh attempts during unstable network transitions
      if (serverValidatingLockRef.current) return;
      serverValidatingLockRef.current = true;
      const { accessToken: at, refreshToken: rt, userId } = await refreshAndRotateTokens();
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);
      setIsValidatedWithServer(true);
      console.log('\x1b[32m[Auth Context]: Validation with server completed => Fetching data from API\x1b[0m');
      setUserIdCache(userId);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.isUpgradeRequired) {
          console.log('\x1b[31m[Auth Context]: Upgrade required. Modal is up.\x1b[0m');
          setIsValidatedWithServer(false);
          return;
        }
        if (e.isNetworkError) {
          console.log(
            '\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m',
          );
          setIsValidatedWithServer(false);
          return;
        }
        if (e.isServerError) {
          console.log(
            '\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m',
          );
          setIsValidatedWithServer(false);
          return;
        }
      }
      console.log('\x1b[31m[Auth Context]: Validation with server failed => Logging out\x1b[0m');
      await clearContext();
    } finally {
      attemptedServerValidationRef.current = true;
      serverValidatingLockRef.current = false;
    }
  }, [
    attemptedServerValidationRef,
    clearContext,
    serverValidatingLockRef,
    setIsValidatedWithServer,
    setUserIdCache,
  ]);

  return { attemptServerValidation };
};

export default useServerValidation;
