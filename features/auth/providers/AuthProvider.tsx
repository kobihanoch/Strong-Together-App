import { AxiosError } from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { clearTanStackCache } from '../../../infrastructure/query/query-client';
import { disconnectSocket } from '../../../infrastructure/socket';
import { AppUser } from '../../user/types/user.types';
import { useWorkoutSessionStore } from '../../workouts/session/hooks/use-workout-session-store.hook';
import { clearWorkoutSessionStorage } from '../../workouts/session/utils/workout-session-cache.utils';
import { cancelWorkoutSessionReminder } from '../../workouts/session/utils/workout-session-reminder.utils';
import { onForceLogout } from '../events/auth-events.event';
import useInitialCheck from '../hooks/auth-provider-effects/use-initial-check.hook';
import useRetryServerValidationWhenOnline from '../hooks/auth-provider-effects/use-retry-server-validation-when-online.hook';
import { logoutUser, refreshAndRotateTokens } from '../services/auth.service';
import { setAccessToken, setUsernameInHeader } from '../utils/auth.utils';
import { clearAuthStorage, saveRefreshToken, saveUserId } from '../utils/token-storage.utils';

interface AuthProviderValue {
  authPhase: 'checking' | 'authed' | 'guest';
  userIdCache: AppUser['id'] | null;
  isValidatedWithServer: boolean;
  completeAuthSession: (accessToken: string, refreshToken: string, userId: AppUser['id']) => Promise<void>;
}

const AuthContext = createContext<AuthProviderValue | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

/**
 * Owns the application authentication and session lifecycle.
 *
 * The provider restores cached sessions, validates them with the server,
 * exposes the application's authentication actions and loading states.
 *
 * @param children - Descendant React nodes that can consume authentication state.
 * @returns A context provider containing the shared authentication state.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userIdCache, setUserIdCache] = useState<AppUser['id'] | null | undefined>(undefined); // --- Cached session identifier ---
  const [authPhase, setAuthPhase] = useState<'checking' | 'authed' | 'guest'>('checking'); // --- Startup phase for smooth auth-stack/app-stack routing ---
  const [isValidatedWithServer, setIsValidatedWithServer] = useState(false); // --- Unlocks API revalidation for cache-backed providers ---

  // --- Guards server validation attempts ---
  const serverValidatingLockRef = useRef<boolean>(false);
  const attemptedServerValidationRef = useRef<boolean>(false);
  const logoutPromiseRef = useRef<Promise<void> | null>(null);

  // Functions ---------------------------------------------------------------------
  const completeAuthSession = useCallback(
    async (accessToken: string, refreshToken: string, userId: AppUser['id']) => {
      await Promise.all([saveRefreshToken(refreshToken), saveUserId(userId)]);
      setAccessToken(accessToken);
      setUserIdCache(userId);
      setIsValidatedWithServer(true);
      setAuthPhase('authed');
      console.log('\x1b[32m[Auth Context]: Login succeeded!\x1b[0m');
    },
    [setAuthPhase, setIsValidatedWithServer, setUserIdCache],
  );

  const logout = useCallback((): Promise<void> => {
    if (logoutPromiseRef.current) return logoutPromiseRef.current;

    const logoutPromise = (async () => {
      try {
        await logoutUser();
      } finally {
        disconnectSocket();
        await clearAuthStorage();
        await clearTanStackCache();
        await cancelWorkoutSessionReminder();
        await clearWorkoutSessionStorage();
        useWorkoutSessionStore.getState().resetWorkout();
        setAccessToken(null);
        setUsernameInHeader(null);
        setUserIdCache(undefined);
        setIsValidatedWithServer(false);
        setAuthPhase('guest');
        serverValidatingLockRef.current = false;
        attemptedServerValidationRef.current = false;
      }
    })().finally(() => {
      logoutPromiseRef.current = null;
    });

    logoutPromiseRef.current = logoutPromise;
    return logoutPromise;
  }, []);

  const attemptServerValidation = useCallback(async (): Promise<void> => {
    try {
      // Avoid duplicate refresh attempts during unstable network transitions
      if (serverValidatingLockRef.current) return;
      serverValidatingLockRef.current = true;
      const { accessToken: at, refreshToken: rt, userId } = await refreshAndRotateTokens();
      await Promise.all([saveRefreshToken(rt), saveUserId(userId)]);
      setAccessToken(at);
      console.log('\x1b[32m[Auth Context]: Validation with server completed.\x1b[0m');
      setIsValidatedWithServer(true);
      setUserIdCache(userId);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.isUpgradeRequired) {
          console.log('\x1b[31m[Auth Context]: Upgrade required. Modal is up.\x1b[0m');
          setIsValidatedWithServer(false);
          return;
        }
        if (e.isNetworkError) {
          console.log('\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m');
          setIsValidatedWithServer(false);
          return;
        }
        if (e.isServerError) {
          console.log('\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m');
          setIsValidatedWithServer(false);
          return;
        }
      }
      console.log('\x1b[31m[Auth Context]: Validation with server failed => Logging out\x1b[0m');
      await logout();
    } finally {
      attemptedServerValidationRef.current = true;
      serverValidatingLockRef.current = false;
    }
  }, [attemptedServerValidationRef, logout, serverValidatingLockRef, setIsValidatedWithServer, setUserIdCache]);

  // Side Effects -----------------------------------------------------------------------------------
  // Restore cached session on app start, then validate it in the background
  useInitialCheck({ logout, attemptServerValidation, setUserIdCache, setAuthPhase });
  // Retry server validation when a boot-time offline/server failure recovers
  useRetryServerValidationWhenOnline(isValidatedWithServer, attemptServerValidation, attemptedServerValidationRef);
  // Logout event listener
  useEffect(() => {
    return onForceLogout(logout);
  }, [logout]);

  // Memoized context value
  const value = useMemo<AuthProviderValue>(
    () => ({
      authPhase,
      userIdCache: userIdCache ?? null,
      isValidatedWithServer,
      completeAuthSession,
    }),
    [userIdCache, isValidatedWithServer, authPhase, completeAuthSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
