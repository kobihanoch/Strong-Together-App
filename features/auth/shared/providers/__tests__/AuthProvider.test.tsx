/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import { guestProfile, userWithoutWorkoutProfile } from '../../../../../../tests/fixtures/userProfiles';

jest.mock('axios', () => ({
  AxiosError: class AxiosError extends Error {},
}));

type VoidPromiseFn = () => Promise<void>;
type NullableStringPromiseFn = () => Promise<string | null>;
type CacheGetFn = <T>(key: string) => Promise<T | null>;
type CacheSetFn = <T>(key: string, value: T, ttl: number) => Promise<void>;
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
type UseCacheAndFetchResponse = { loading: boolean; cacheKnown: boolean };
type UseCacheAndFetchMockFn = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: unknown,
  cachedPayload: unknown,
  logLabel: string,
) => UseCacheAndFetchResponse;

const mockCacheGetJSON = jest.fn<CacheGetFn>();
const mockCacheSetJSON = jest.fn<CacheSetFn>();
const mockCacheDeleteAllCache = jest.fn<VoidPromiseFn>();
const mockCacheDeleteAllCacheWithoutStartWorkout = jest.fn<VoidPromiseFn>();
const mockHasBootstrapPayload = jest.fn<() => boolean>();
const mockResetBootstrap = jest.fn<() => void>();
const mockUseGoogleAuth = jest.fn<() => { signInWithGoogle: ReturnType<typeof jest.fn> }>();
const mockUseAppleAuth = jest.fn<() => { signInWithApple: ReturnType<typeof jest.fn> }>();
const mockUseCacheAndFetch = jest.fn<UseCacheAndFetchMockFn>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockUseUpdateGlobalLoading = jest.fn<(...args: any[]) => void>();
const mockLoginUser = jest.fn<(identifier: string, password: string) => Promise<LoginResponse>>();
const mockLogoutUser = jest.fn<VoidPromiseFn>();
const mockRefreshAndRotateTokens = jest.fn<() => Promise<RefreshResponse>>();
const mockRegisterUser = jest.fn<(...args: any[]) => Promise<void>>();
const mockLoginOAuthWithAccessToken = jest.fn<() => Promise<void>>();
const mockFetchSelfUserData = jest.fn<() => Promise<null>>();
const mockClearRefreshToken = jest.fn<VoidPromiseFn>();
const mockGetRefreshToken = jest.fn<NullableStringPromiseFn>();
const mockSaveRefreshToken = jest.fn<(rt: string) => Promise<void>>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();
const mockShowErrorAlert = jest.fn<(title: string, message: string) => void>();

const cacheDeleteAllCacheMock = () => mockCacheDeleteAllCache();
const cacheDeleteAllCacheWithoutStartWorkoutMock = () => mockCacheDeleteAllCacheWithoutStartWorkout();
const cacheGetJSONMock = <T,>(key: string) => mockCacheGetJSON(key) as Promise<T | null>;
const cacheSetJSONMock = <T,>(key: string, value: T, ttl: number) => mockCacheSetJSON(key, value, ttl) as Promise<void>;
const useCacheAndFetchMock = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: unknown,
  cachedPayload: unknown,
  logLabel: string,
) => mockUseCacheAndFetch(user, keyBuilderFn, isValidatedByServerFlag, fetchFn, onDataFn, cachedPayload, logLabel);
const useUpdateGlobalLoadingMock = (key: string, value: boolean) => mockUseUpdateGlobalLoading(key, value);
const loginUserMock = (identifier: string, password: string) => mockLoginUser(identifier, password);
const logoutUserMock = () => mockLogoutUser();
const refreshAndRotateTokensMock = () => mockRefreshAndRotateTokens();
const registerUserMock = (...args: any[]) => mockRegisterUser(...args);
const loginOAuthWithAccessTokenMock = () => mockLoginOAuthWithAccessToken();
const fetchSelfUserDataMock = () => mockFetchSelfUserData();
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

jest.mock('../../../../../../infrastructure/api/bootstrap-api', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../../../../infrastructure/cache/cache.utils', () => ({
  cacheDeleteAllCache: cacheDeleteAllCacheMock,
  cacheDeleteAllCacheWithoutStartWorkout: cacheDeleteAllCacheWithoutStartWorkoutMock,
  cacheGetJSON: cacheGetJSONMock,
  cacheSetJSON: cacheSetJSONMock,
  TTL_48H: 172800,
}));

jest.mock('../../../../../../infrastructure/cache/cache-keys.utils', () => ({
  keyAuth: (id: string) => `CACHE:AUTH:${id}:test-version`,
}));

jest.mock('../../hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => mockUseGoogleAuth(),
}));

jest.mock('../../hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => mockUseAppleAuth(),
}));

jest.mock('../../../../../../hooks/useCacheAndFetch', () => ({
  __esModule: true,
  default: useCacheAndFetchMock,
}));

jest.mock('../../../../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../../../../hooks/useUpdateGlobalLoading', () => ({
  __esModule: true,
  default: useUpdateGlobalLoadingMock,
}));

jest.mock('../../services/auth.service', () => ({
  loginUser: loginUserMock,
  logoutUser: logoutUserMock,
  refreshAndRotateTokens: refreshAndRotateTokensMock,
  registerUser: registerUserMock,
}));

jest.mock('../../services/auth.service', () => ({
  loginOAuthWithAccessToken: loginOAuthWithAccessTokenMock,
}));

jest.mock('../../../../../authenticated-user/profile/services/user-update.service', () => ({
  fetchSelfUserData: fetchSelfUserDataMock,
}));

jest.mock('../../utils/token-storage.utils', () => ({
  clearRefreshToken: clearRefreshTokenMock,
  getRefreshToken: getRefreshTokenMock,
  saveRefreshToken: saveRefreshTokenMock,
}));

jest.mock('../../../../../../infrastructure/socket', () => ({
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

jest.mock('../../../../../../shared/errors/error-alerts', () => ({
  showErrorAlert: showErrorAlertMock,
}));

import { AuthProvider, useAuth } from '../AuthProvider';
import GlobalAuth from '../../utils/auth.utils';

const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockHasBootstrapPayload.mockReturnValue(false);
    mockUseGoogleAuth.mockReturnValue({
      signInWithGoogle: jest.fn(),
    });
    mockUseAppleAuth.mockReturnValue({
      signInWithApple: jest.fn(),
    });
    mockUseCacheAndFetch.mockReturnValue({
      loading: false,
      cacheKnown: true,
    });
    mockUseNetworkStatus.mockReturnValue(true);
    mockGetRefreshToken.mockResolvedValue(null);
    mockCacheGetJSON.mockResolvedValue(null);
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
    mockCacheDeleteAllCache.mockResolvedValue(undefined);
    mockCacheDeleteAllCacheWithoutStartWorkout.mockResolvedValue(undefined);
    mockCacheSetJSON.mockResolvedValue(undefined);
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockConnectSocket.mockResolvedValue(undefined);
    mockDisconnectSocket.mockReturnValue(undefined);
    mockFetchSelfUserData.mockResolvedValue(null);
    mockRegisterUser.mockResolvedValue(undefined);
    mockLoginOAuthWithAccessToken.mockResolvedValue(undefined);
  });

  it('falls back to the guest state when no stored session exists on boot', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBe(guestProfile.user);
    expect(result.current.userIdCache).toBe(null);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      { id: null },
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      null,
      'Auth Context',
    );
    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockCacheDeleteAllCacheWithoutStartWorkout).toHaveBeenCalledTimes(1);
    expect(mockResetBootstrap).toHaveBeenCalledTimes(1);
  });

  it('restores a stored session and validates it with the server on boot', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('authed');
    });

    await waitFor(() => {
      expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(true);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      { id: userWithoutWorkoutProfile.user!.id },
      expect.any(Function),
      true,
      expect.any(Function),
      expect.any(Function),
      null,
      'Auth Context',
    );
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(mockCacheSetJSON).toHaveBeenCalledWith('CACHE:USER_ID', userWithoutWorkoutProfile.user!.id, 172800);
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
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(true);
    expect(result.current.authPhase).toBe('authed');
    expect(result.current.loading).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      { id: userWithoutWorkoutProfile.user!.id },
      expect.any(Function),
      true,
      expect.any(Function),
      expect.any(Function),
      null,
      'Auth Context',
    );
    expect(mockCacheSetJSON).toHaveBeenCalledWith('CACHE:USER_ID', userWithoutWorkoutProfile.user!.id, 172800);
  });

  it('logs out by clearing local auth state even after the server call succeeds', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.authPhase).toBe('guest');
    });

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    expect(mockDisconnectSocket).toHaveBeenCalledTimes(1);
    expect(mockCacheDeleteAllCache).toHaveBeenCalledTimes(1);
    expect(mockClearRefreshToken).toHaveBeenCalled();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.userIdCache).toBeNull();
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      { id: null },
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      null,
      'Auth Context',
    );
  });

  it('clears auth state when GlobalAuth.logout is triggered from outside the context', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

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

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.userIdCache).toBeNull();
    expect(result.current.isValidatedWithServer).toBe(false);
  });

  it('stays authed on cached data when boot-time server validation fails because the network is offline', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

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

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockClearRefreshToken).not.toHaveBeenCalled();
    expect(mockCacheDeleteAllCacheWithoutStartWorkout).not.toHaveBeenCalled();
  });

  it('does not retry server validation while the device is still offline after the first failure', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

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

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockRefreshAndRotateTokens).toHaveBeenCalledTimes(1);
  });

  it('retries server validation once the device comes back online after an offline boot failure', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

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

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(mockSetAccessToken).toHaveBeenCalledWith('access-token');
    expect(mockCacheSetJSON).toHaveBeenCalledWith('CACHE:USER_ID', userWithoutWorkoutProfile.user!.id, 172800);
  });

  it('does not logout when boot-time validation reports upgrade required', async () => {
    mockGetRefreshToken.mockResolvedValue('existing-refresh-token');
    mockCacheGetJSON.mockResolvedValue(userWithoutWorkoutProfile.user!.id);

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

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.userIdCache).toBe(userWithoutWorkoutProfile.user!.id);
    expect(result.current.isValidatedWithServer).toBe(false);
    expect(mockClearRefreshToken).not.toHaveBeenCalled();
    expect(mockCacheDeleteAllCacheWithoutStartWorkout).not.toHaveBeenCalled();
  });
});
