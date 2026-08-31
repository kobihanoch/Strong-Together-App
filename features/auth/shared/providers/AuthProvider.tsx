import { CreateUserBody, LoginRequestBody } from '@strong-together/shared';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import useAuthActions from '../hooks/use-auth-actions.hook';
import useClearContext from '../hooks/use-clear-context.hook';
import useInitialCheck from '../hooks/use-initial-check.hook';
import usePersistUserIdCache from '../hooks/use-persist-user-id-cache.hook';
import useRetryServerValidationWhenOnline from '../hooks/use-retry-server-validation-when-online.hook';
import useServerValidation from '../hooks/use-server-validation.hook';
import { AppUser } from '../types/auth.types';

interface AuthProviderValue {
  authPhase: 'checking' | 'authed' | 'guest';
  isLoggedIn: boolean;
  userIdCache: AppUser['id'] | null;
  autheticationLoading: boolean;
  loading: boolean;
  googleLoading: boolean;
  appleLoading: boolean;
  isWorkoutMode: boolean;
  setIsWorkoutMode: React.Dispatch<React.SetStateAction<boolean>>;
  isValidatedWithServer: boolean;
  register: (
    email: CreateUserBody['email'],
    password: CreateUserBody['password'],
    username: CreateUserBody['username'],
    fullName: CreateUserBody['fullName'],
    gender: CreateUserBody['gender'],
  ) => Promise<void>;
  login: (identifier: LoginRequestBody['identifier'], password: LoginRequestBody['password']) => Promise<void>;
  handleAppleAuth: () => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  logout: () => Promise<void>;
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
  // --- Cached session identifier ---
  const [userIdCache, setUserIdCache] = useState<AppUser['id'] | null | undefined>(undefined);
  usePersistUserIdCache(userIdCache);

  // --- Auth & session state ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [autheticationLoading, setAutheticationLoading] = useState<boolean>(false); // UI loading for login/register
  const [appleLoading, setAppleLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [isWorkoutMode, setIsWorkoutMode] = useState<boolean>(false); // For start workout

  // --- Startup phase for smooth auth-stack/app-stack routing ---
  const [authPhase, setAuthPhase] = useState<'checking' | 'authed' | 'guest'>('checking');

  // --- Unlocks API revalidation for cache-backed providers ---
  const [isValidatedWithServer, setIsValidatedWithServer] = useState(false);

  // --- Guards server validation attempts ---
  const serverValidatingLockRef = useRef<boolean>(false);
  const attemptedServerValidationRef = useRef<boolean>(false);

  // Clear context method
  const { clearContext } = useClearContext({
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
  });

  const { register, login, handleAppleAuth, handleGoogleAuth, logout } = useAuthActions({
    setAutheticationLoading,
    setAppleLoading,
    setGoogleLoading,
    setUserIdCache,
    setIsLoggedIn,
    setIsValidatedWithServer,
    setAuthPhase,
    clearContext,
  });

  // Attempt server validation method
  const { attemptServerValidation } = useServerValidation({
    clearContext,
    setIsValidatedWithServer,
    setUserIdCache,
    logout,
    serverValidatingLockRef,
    attemptedServerValidationRef,
  });

  // Restore cached session on app start, then validate it in the background
  useInitialCheck({ clearContext, attemptServerValidation, setUserIdCache, setIsLoggedIn, setAuthPhase });

  // Retry server validation when a boot-time offline/server failure recovers
  useRetryServerValidationWhenOnline(isValidatedWithServer, attemptServerValidation, attemptedServerValidationRef);

  // Memoized context value
  const value = useMemo<AuthProviderValue>(
    () => ({
      // state
      authPhase,
      isLoggedIn,
      userIdCache: userIdCache ?? null,
      autheticationLoading,
      loading: autheticationLoading,
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
      userIdCache,
      autheticationLoading,
      googleLoading,
      appleLoading,
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
