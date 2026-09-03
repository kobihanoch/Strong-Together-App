import { AxiosError } from 'axios';
import React, { SetStateAction, useCallback, useEffect } from 'react';
import { disconnectSocket } from '../../../infrastructure/socket';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { showSuccessAlert } from '../../../shared/alerts/success-alerts';
import { loginUser } from '../services/login.service';
import { registerUser } from '../services/register.service';
import { logoutUser } from '../services/auth.service';
import type { LoginCredentials, RegistrationInput } from '../types/auth.types';
import { AppUser } from '../../user/types/user.types';
import GlobalAuth from '../utils/auth.utils';
import { saveRefreshToken, saveUserId } from '../utils/token-storage.utils';
import { useAppleAuth } from './use-apple-auth.hook';
import { useGoogleAuth } from './use-google-auth.hook';

type UseAuthActionsProps = {
  setAutheticationLoading: React.Dispatch<SetStateAction<boolean>>;
  setAppleLoading: React.Dispatch<SetStateAction<boolean>>;
  setGoogleLoading: React.Dispatch<SetStateAction<boolean>>;
  setUserIdCache: React.Dispatch<SetStateAction<AppUser['id'] | null | undefined>>;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  setIsValidatedWithServer: React.Dispatch<SetStateAction<boolean>>;
  setAuthPhase: React.Dispatch<SetStateAction<'checking' | 'authed' | 'guest'>>;
  clearContext: () => Promise<void>;
};

const useAuthActions = ({
  setAutheticationLoading,
  setAppleLoading,
  setGoogleLoading,
  setUserIdCache,
  setIsLoggedIn,
  setIsValidatedWithServer,
  setAuthPhase,
  clearContext,
}: UseAuthActionsProps) => {
  const completeAuthSession = useCallback(
    async (accessToken: string, refreshToken: string, userId: AppUser['id']) => {
      await Promise.all([saveRefreshToken(refreshToken), saveUserId(userId)]);
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
      email: RegistrationInput['email'],
      password: RegistrationInput['password'],
      username: RegistrationInput['username'],
      fullName: RegistrationInput['fullName'],
      gender: RegistrationInput['gender'],
    ): Promise<void> => {
      try {
        setAutheticationLoading(true);
        await registerUser(email, password, username, fullName, gender);
        showSuccessAlert('Please verify your account', `An email has been sent to ${email}`);
      } finally {
        setAutheticationLoading(false);
      }
    },
    [setAutheticationLoading],
  );

  const login = useCallback(
    async (identifier: LoginCredentials['identifier'], password: LoginCredentials['password']): Promise<void> => {
      try {
        setAutheticationLoading(true);
        const { accessToken: at, refreshToken: rt, user: u } = await loginUser(identifier, password);
        await completeAuthSession(at, rt, u);
      } finally {
        setAutheticationLoading(false);
      }
    },
    [completeAuthSession, setAutheticationLoading],
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
  }, [setGoogleLoading, signInWithGoogle, completeAuthSession]);

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
  }, [setAppleLoading, signInWithApple, completeAuthSession]);

  const logout = useCallback(
    async (): Promise<void> => {
      try {
        await logoutUser();
        setIsLoggedIn(false);
      } catch (err) {
        // Log but do not block local cleanup
        if (err instanceof AxiosError) console.log(err?.response?.data || err.message);
      } finally {
        try {
          disconnectSocket();
        } catch {}
        // Clears with start workout
        await clearContext();
      }
    },
    [clearContext, setIsLoggedIn],
  );

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
