import { CreateUserBody, LoginRequestBody } from '@strong-together/shared';
import React, { SetStateAction, useCallback, useEffect } from 'react';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import { showSuccessAlert } from '../../../../shared/alerts/success-alerts';
import { cacheDeleteAllCache } from '../../../../infrastructure/cache/cache.utils';
import { disconnectSocket } from '../../../../infrastructure/socket';
import { loginUser } from '../../login/services/login.service';
import { registerUser } from '../../register/services/register.service';
import { logoutUser } from '../services/auth.service';
import { AppUser } from '../types/auth.types';
import GlobalAuth from '../utils/auth.utils';
import { saveRefreshToken } from '../utils/token-storage.utils';
import { useAppleAuth } from './use-apple-auth.hook';
import { useGoogleAuth } from './use-google-auth.hook';
import { AxiosError } from 'axios';

type UseAuthActionsProps = {
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setAppleLoading: React.Dispatch<SetStateAction<boolean>>;
  setGoogleLoading: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  setUser: React.Dispatch<SetStateAction<AppUser | null | undefined>>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<'checking' | 'authed' | 'guest'>>;
  clearContext: () => Promise<void>;
};

const useAuthActions = ({
  setLoading,
  setAppleLoading,
  setGoogleLoading,
  setUserIdCache,
  setIsLoggedIn,
  setUser,
  setIsValidatedWithServer,
  setAuthPhase,
  clearContext,
}: UseAuthActionsProps) => {
  const completeAuthSession = useCallback(
    async (accessToken: string, refreshToken: string, userId: AppUser['id']) => {
      await saveRefreshToken(refreshToken);
      GlobalAuth.setAccessToken(accessToken);
      setUserIdCache(userId);
      setIsLoggedIn(true);
      setIsValidatedWithServer(true);
      setAuthPhase('authed');
      console.log('\x1b[32m[Auth Context]: Login succeeded!\x1b[0m');
    },
    [setAuthPhase, setIsLoggedIn, setIsValidatedWithServer, setUserIdCache],
  );

  const register = useCallback(
    async (
      email: CreateUserBody['email'],
      password: CreateUserBody['password'],
      username: CreateUserBody['username'],
      fullName: CreateUserBody['fullName'],
      gender: CreateUserBody['gender'],
    ): Promise<void> => {
      try {
        setLoading(true);
        await registerUser(email, password, username, fullName, gender);
        showSuccessAlert('Please verify your account', `An email has been sent to ${email}`);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(
    async (identifier: LoginRequestBody['identifier'], password: LoginRequestBody['password']): Promise<void> => {
      try {
        setLoading(true);
        const { accessToken: at, refreshToken: rt, user: u } = await loginUser(identifier, password);
        await completeAuthSession(at, rt, u);
      } finally {
        setLoading(false);
      }
    },
    [completeAuthSession],
  );

  const { signInWithGoogle } = useGoogleAuth();
  const handleGoogleAuth = useCallback(async (): Promise<void> => {
    setGoogleLoading(true);
    try {
      const { accessToken: at, refreshToken: rt, user: u } = await signInWithGoogle();
      await completeAuthSession(at, rt, u);
    } catch (e) {
      if (e instanceof Error) showErrorAlert('Error signing in with Google', e.message);
    } finally {
      setGoogleLoading(false);
    }
  }, [signInWithGoogle, completeAuthSession]);

  const { signInWithApple } = useAppleAuth();
  const handleAppleAuth = useCallback(async () => {
    setAppleLoading(true);
    try {
      const { accessToken: at, refreshToken: rt, user: u } = await signInWithApple();
      await completeAuthSession(at, rt, u);
    } catch (e) {
      if (e instanceof Error) showErrorAlert('Error signing in with Apple', e.message);
    } finally {
      setAppleLoading(false);
    }
  }, [signInWithApple, completeAuthSession]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUser(null);
      await cacheDeleteAllCache();
    } catch (err) {
      // Log but do not block local cleanup
      if (err instanceof AxiosError) console.log(err?.response?.data || err.message);
    } finally {
      try {
        disconnectSocket();
      } catch {}
      await clearContext();
    }
  }, [clearContext, setIsLoggedIn, setUser]);

  // Expose the real logout to axios interceptors via GlobalAuth.logout
  useEffect(() => {
    GlobalAuth.logout = logout;
    return () => {
      GlobalAuth.logout = null;
    };
  }, [logout]);

  return {
    register,
    login,
    handleAppleAuth,
    handleGoogleAuth,
    logout,
  };
};

export default useAuthActions;
