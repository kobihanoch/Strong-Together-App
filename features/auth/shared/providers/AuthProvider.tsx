import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import useUpdateGlobalLoading from '../../../../shared/hooks/use-update-global-loading.hook';
import useAuthActions from '../hooks/use-auth-actions.hook';
import useAuthCacheHandler from '../hooks/use-auth-cache-handler.hook';
import useAuthSocketInitialization from '../hooks/use-auth-socket-initialization';
import useClearContext from '../hooks/use-clear-context.hook';
import useInitialCheck from '../hooks/use-initial-check.hook';
import usePersistUserIdCache from '../hooks/use-persist-user-id-cache.hook';
import useRetryServerValidationWhenOnline from '../hooks/use-retry-server-validation-when-online.hook';
import useServerValidation from '../hooks/use-server-validation.hook';
import useSyncUsernameHeader from '../hooks/use-sync-username-header.hook';
import { AppUser } from '../types/auth.types';
import { AuthProviderValue } from './types/auth-context.types';

const AuthContext = createContext<AuthProviderValue | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

/**
 * Auth Context
 * -------------
 * Responsibilities:
 * - Hold authentication & session state (user, isLoggedIn, loading flags)
 * - Expose auth actions (register, login, logout)
 * - Orchestrate session bootstrap, server validation, auth cache hydration, and socket setup
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // --- Cached session identifier ---
  const [userIdCache, setUserIdCache] = useState<AppUser['id'] | null | undefined>(undefined);
  usePersistUserIdCache(userIdCache);

  // --- Auth & session state ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // UI loading for login/register
  const [appleLoading, setAppleLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [isWorkoutMode, setIsWorkoutMode] = useState<boolean>(false); // For start workout

  // --- Startup phase for smooth auth-stack/app-stack routing ---
  const [authPhase, setAuthPhase] = useState<'checking' | 'authed' | 'guest'>('checking');

  // --- Unlocks API revalidation for cache-backed providers ---
  const [isValidatedWithServer, setIsValidatedWithServer] = useState(false);

  // --- Guards server validation attempts ---
  const serverValidatingLockRef = useRef<boolean>(false);
  const attemptedServerValidationRef = useRef<boolean>(false);

  const { userDataLoading } = useAuthCacheHandler({ userIdCache, isValidatedWithServer, user, setUser });

  // Report auth startup/user-data loading to the global loading coordinator
  useUpdateGlobalLoading('Auth', authPhase === 'checking' || userDataLoading);

  // Clear context method
  const { clearContext } = useClearContext({
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
  });

  // Attempt server validation method
  const { attemptServerValidation } = useServerValidation({
    clearContext,
    setIsValidatedWithServer,
    setUserIdCache,
    serverValidatingLockRef,
    attemptedServerValidationRef,
  });

  // Restore cached session on app start, then validate it in the background
  useInitialCheck({ clearContext, attemptServerValidation, setUserIdCache, setIsLoggedIn, setAuthPhase });

  // Connect socket only after the session is server-validated and user data is known
  useAuthSocketInitialization(user?.username, isValidatedWithServer);

  // Retry server validation when a boot-time offline/server failure recovers
  useRetryServerValidationWhenOnline(isValidatedWithServer, attemptServerValidation, attemptedServerValidationRef);

  // Keep username header aligned with current auth user
  useSyncUsernameHeader(user);

  const { register, login, handleAppleAuth, handleGoogleAuth, logout } = useAuthActions({
    setLoading,
    setAppleLoading,
    setGoogleLoading,
    setUserIdCache,
    setIsLoggedIn,
    setUser,
    setIsValidatedWithServer,
    setAuthPhase,
    clearContext,
  });

  // Memoized context value
  const value = useMemo<AuthProviderValue>(
    () => ({
      // state
      authPhase,
      isLoggedIn,
      user: user ?? null,
      setUser,
      userIdCache: userIdCache ?? null,
      loading,
      userDataLoading,
      // actions
      register,
      login,
      googleLoading,
      appleLoading,
      handleAppleAuth,
      handleGoogleAuth,
      logout,
      isWorkoutMode,
      setIsWorkoutMode,
      isValidatedWithServer,
    }),
    [
      isLoggedIn,
      user,
      setUser,
      userIdCache,
      loading,
      googleLoading,
      appleLoading,
      userDataLoading,
      register,
      login,
      handleAppleAuth,
      handleGoogleAuth,
      logout,
      isWorkoutMode,
      setIsWorkoutMode,
      isValidatedWithServer,
      authPhase,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
