/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import { userWithoutWorkoutProfile } from '../../../../tests/fixtures/userProfiles';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    }),
  },
  AxiosError: class AxiosError extends Error {},
}));

type VoidPromiseFn = () => Promise<void>;
type NullableStringPromiseFn = () => Promise<string | null>;
type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: NonNullable<typeof userWithoutWorkoutProfile.user>['id'];
};
type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  userId: NonNullable<typeof userWithoutWorkoutProfile.user>['id'];
};
const mockGetCachedUserId = jest.fn<() => string | null>();
const mockSetCachedUserId = jest.fn<(userId: string) => Promise<void>>();
const mockClearTanStackCache = jest.fn<VoidPromiseFn>();
const mockUseGoogleAuth = jest.fn<() => { signInWithGoogle: ReturnType<typeof jest.fn> }>();
const mockUseAppleAuth = jest.fn<() => { signInWithApple: ReturnType<typeof jest.fn> }>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockLoginUser = jest.fn<(identifier: string, password: string) => Promise<LoginResponse>>();
const mockLogoutUser = jest.fn<VoidPromiseFn>();
const mockRefreshAndRotateTokens = jest.fn<() => Promise<RefreshResponse>>();
const mockRegisterUser = jest.fn<(...args: any[]) => Promise<void>>();
const mockLoginOAuthWithAccessToken = jest.fn<() => Promise<void>>();
const mockClearRefreshToken = jest.fn<VoidPromiseFn>();
const mockGetRefreshToken = jest.fn<NullableStringPromiseFn>();
const mockSaveRefreshToken = jest.fn<(rt: string) => Promise<void>>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();
const mockShowErrorAlert = jest.fn<(title: string, message: string) => void>();

const loginUserMock = (identifier: string, password: string) => mockLoginUser(identifier, password);
const logoutUserMock = () => mockLogoutUser();
const refreshAndRotateTokensMock = () => mockRefreshAndRotateTokens();
const registerUserMock = (...args: any[]) => mockRegisterUser(...args);
const loginOAuthWithAccessTokenMock = () => mockLoginOAuthWithAccessToken();
const clearRefreshTokenMock = () => mockClearRefreshToken();
const getRefreshTokenMock = () => mockGetRefreshToken();
const saveRefreshTokenMock = (rt: string) => mockSaveRefreshToken(rt);
const connectSocketMock = (username: string) => mockConnectSocket(username);
const disconnectSocketMock = () => mockDisconnectSocket();
const setAccessTokenMock = (token: string | null) => mockSetAccessToken(token);
const setUsernameInHeaderMock = (username: string | null) => mockSetUsernameInHeader(username);
const showErrorAlertMock = (title: string, message: string) => mockShowErrorAlert(title, message);

jest.mock('react-native-notifier', () => ({
  Notifier: {
    showNotification: jest.fn(),
  },
  NotifierComponents: {
    Alert: 'Alert',
  },
}));

jest.mock('../../../../../infrastructure/query/query-client', () => ({
  clearTanStackCache: () => mockClearTanStackCache(),
}));

jest.mock('../../hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => mockUseGoogleAuth(),
}));

jest.mock('../../hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => mockUseAppleAuth(),
}));

jest.mock('../../../../../shared/hooks/use-network-status.hook', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../services/auth.service', () => ({
  logoutUser: logoutUserMock,
  refreshAndRotateTokens: refreshAndRotateTokensMock,
  loginOAuthWithAccessToken: loginOAuthWithAccessTokenMock,
}));

jest.mock('../../../login/services/login.service', () => ({
  loginUser: loginUserMock,
}));

jest.mock('../../../register/services/register.service', () => ({
  registerUser: registerUserMock,
}));

jest.mock('../../utils/token-storage.utils', () => ({
  clearAuthStorage: clearRefreshTokenMock,
  clearRefreshToken: clearRefreshTokenMock,
  getRefreshToken: getRefreshTokenMock,
  getUserId: mockGetCachedUserId,
  saveRefreshToken: saveRefreshTokenMock,
  saveUserId: (userId: string) => mockSetCachedUserId(userId),
}));

jest.mock('../../../../../infrastructure/socket', () => ({
  connectSocket: connectSocketMock,
  disconnectSocket: disconnectSocketMock,
}));

jest.mock('../../utils/auth.utils', () => ({
  __esModule: true,
  default: {
    setAccessToken: setAccessTokenMock,
    logout: null,
    setUsernameInHeader: setUsernameInHeaderMock,
  },
}));

jest.mock('../../../../../shared/alerts/error-alerts', () => ({
  showErrorAlert: showErrorAlertMock,
}));

import { AuthProvider, useAuth } from '../AuthProvider';
import GlobalAuth from '../../utils/auth.utils';

const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGoogleAuth.mockReturnValue({
      signInWithGoogle: jest.fn(),
    });
    mockUseAppleAuth.mockReturnValue({
      signInWithApple: jest.fn(),
    });
    mockUseNetworkStatus.mockReturnValue(true);
    mockGetRefreshToken.mockResolvedValue(null);
    mockGetCachedUserId.mockReturnValue(null);
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: userWithoutWorkoutProfile.user!.id,
    });
    mockLoginUser.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: userWithoutWorkoutProfile.user!.id,
    });
    mockLogoutUser.mockResolvedValue(undefined);
    mockClearRefreshToken.mockResolvedValue(undefined);
    mockClearTanStackCache.mockResolvedValue(undefined);
    mockSetCachedUserId.mockResolvedValue(undefined);
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockConnectSocket.mockResolvedValue(undefined);
    mockDisconnectSocket.mockReturnValue(undefined);
    mockRegisterUser.mockResolvedValue(undefined);
    mockLoginOAuthWithAccessToken.mockResolvedValue(undefined);
  });

  it('falls back to the guest state when no stored session exists on boot', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    expect(result.current.userIdCache).toBe(null);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockClearTanStackCache).toHaveBeenCalledTimes(1);
  });

  it('restores a stored session and validates it with the server on boot', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(true);
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(mockSetCachedUserId).toHaveBeenCalledWith(userWithoutWorkoutProfile.user!.id);
  });

  it('logs in with credentials and stores the session metadata for downstream contexts', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    await act(async () => {
      await result.current.login('johnny', 'Secret123');
    });

    expect(mockLoginUser).toHaveBeenCalledWith('johnny', 'Secret123');
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(true);
    expect(result.current.authPhase).toBe('authed');
    expect(result.current.autheticationLoading).toBe(false);
    expect(mockSetCachedUserId).toHaveBeenCalledWith(userWithoutWorkoutProfile.user!.id);
  });

  it('logs out by clearing local auth state even after the server call succeeds', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    expect(mockDisconnectSocket).toHaveBeenCalledTimes(1);
    expect(mockClearTanStackCache).toHaveBeenCalledTimes(1);
    expect(mockClearRefreshToken).toHaveBeenCalled();
    expect(result.current.userIdCache).toBeNull();
    expect(result.current.isValidatedWithServer).toBe(false);
  });

  it('clears auth state when GlobalAuth.logout is triggered from outside the context', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await act(async () => {
      await GlobalAuth.logout?.();
    });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    expect(result.current.userIdCache).toBeNull();
    expect(result.current.isValidatedWithServer).toBe(false);
  });

  it('stays authed on cached data when boot-time server validation fails because the network is offline', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const networkError = new AxiosError('offline');
    (networkError as AxiosError & { isNetworkError: boolean }).isNetworkError = true;
    mockRefreshAndRotateTokens.mockRejectedValue(networkError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockClearRefreshToken).not.toHaveBeenCalled();
    expect(mockClearTanStackCache).not.toHaveBeenCalled();
  });

  it('does not retry server validation while the device is still offline after the first failure', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const isOnline = false;
    mockUseNetworkStatus.mockImplementation(() => isOnline);

    const networkError = new AxiosError('offline');
    (networkError as AxiosError & { isNetworkError: boolean }).isNetworkError = true;
    mockRefreshAndRotateTokens.mockRejectedValue(networkError);

    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    act(() => {
      rerender(undefined);
    });

    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
  });

  it('retries server validation once the device comes back online after an offline boot failure', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    let isOnline = false;
    mockUseNetworkStatus.mockImplementation(() => isOnline);

    const networkError = new AxiosError('offline');
    (networkError as AxiosError & { isNetworkError: boolean }).isNetworkError = true;
    mockRefreshAndRotateTokens.mockRejectedValueOnce(networkError).mockResolvedValueOnce({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: userWithoutWorkoutProfile.user!.id,
    });

    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    act(() => {
      isOnline = true;
      rerender(undefined);
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(result.current.isValidatedWithServer).toBe(true);
    });

    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(mockSetCachedUserId).toHaveBeenCalledWith(userWithoutWorkoutProfile.user!.id);
  });

  it('does not logout when boot-time validation reports upgrade required', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockGetCachedUserId.mockReturnValue(userWithoutWorkoutProfile.user!.id);

    const upgradeError = new AxiosError('upgrade required');
    (upgradeError as AxiosError & { isUpgradeRequired: boolean }).isUpgradeRequired = true;
    mockRefreshAndRotateTokens.mockRejectedValue(upgradeError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockClearRefreshToken).not.toHaveBeenCalled();
    expect(mockClearTanStackCache).not.toHaveBeenCalled();
  });
});
