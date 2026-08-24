/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import { userWithWorkoutAndHistoryProfile, userWithoutWorkoutProfile } from '../../../../tests/fixtures/userProfiles';
import { getDaysSince } from '../../../home/utils/home-page.utils';

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

const mockCacheGetJSON = jest.fn<(key: string) => Promise<unknown>>();
const mockCacheSetJSON = jest.fn<(key: string, value: unknown, ttl: number) => Promise<void>>();
const mockCacheDeleteAllCache = jest.fn<() => Promise<void>>();
const mockCacheDeleteAllCacheWithoutStartWorkout = jest.fn<() => Promise<void>>();
const mockGetRefreshToken = jest.fn<() => Promise<string | null>>();
const mockSaveRefreshToken = jest.fn<(token: string) => Promise<void>>();
const mockClearRefreshToken = jest.fn<() => Promise<void>>();
const mockRefreshAndRotateTokens =
  jest.fn<() => Promise<{ accessToken: string; refreshToken: string; userId: string }>>();
const mockFetchSelfUserData = jest.fn<() => Promise<typeof userWithWorkoutAndHistoryProfile.user>>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockHasBootstrapPayload = jest.fn<() => boolean>();
const mockResetBootstrap = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: 'test-version',
    },
  },
}));

jest.mock('../../../../infrastructure/cache/cache.utils', () => {
  const actual = jest.requireActual('../../../../infrastructure/cache/cache.utils') as Record<string, unknown>;
  return {
    ...actual,
    cacheGetJSON: (key: string) => mockCacheGetJSON(key),
    cacheSetJSON: (key: string, value: unknown, ttl: number) => mockCacheSetJSON(key, value, ttl),
    cacheDeleteAllCache: () => mockCacheDeleteAllCache(),
    cacheDeleteAllCacheWithoutStartWorkout: () => mockCacheDeleteAllCacheWithoutStartWorkout(),
  };
});

jest.mock('../../../auth/shared/utils/token-storage.utils', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../auth/shared/services/auth.service', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../services/user-update.service', () => ({
  fetchSelfUserData: () => mockFetchSelfUserData(),
}));

jest.mock('../../../../infrastructure/socket', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../../../shared/hooks/use-network-status.hook', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../auth/shared/hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../auth/shared/hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../../infrastructure/api/api-config/bootstrap', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../auth/shared/utils/auth.utils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

import { AuthProvider, useAuth } from '../../../auth/shared/providers/AuthProvider';
import { GlobalAppLoadingProvider } from '../../../../shared/providers/GlobalAppLoadingProvider';
import useProfilePageLogic from '../use-profile-page-logic.hook';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>{children}</AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedProfileLogic = () => {
  const auth = useAuth();
  const profile = useProfilePageLogic();
  return { auth, profile };
};

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const createNetworkAxiosError = (): AxiosError & { isNetworkError: boolean } => {
  const err = new AxiosError('offline') as AxiosError & { isNetworkError: boolean };
  err.isNetworkError = true;
  return err;
};

const setupCacheForScenario = ({
  userId,
  auth,
}: {
  userId: string | null;
  auth?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    return null;
  });
};

describe('useProfilePageLogic integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetworkStatus.mockReturnValue(true);
    mockHasBootstrapPayload.mockReturnValue(false);
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockClearRefreshToken.mockResolvedValue(undefined);
    mockCacheSetJSON.mockResolvedValue(undefined);
    mockCacheDeleteAllCache.mockResolvedValue(undefined);
    mockCacheDeleteAllCacheWithoutStartWorkout.mockResolvedValue(undefined);
    mockConnectSocket.mockResolvedValue(undefined);
    mockDisconnectSocket.mockReturnValue(undefined);
  });

  it('starts with safe empty profile data while auth is still hydrating and user is null', async () => {
    setupCacheForScenario({ userId: 'user-1' });
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'rotated-refresh-token',
      userId: 'user-1',
    });

    const userDeferred = createDeferred<typeof userWithWorkoutAndHistoryProfile.user>();
    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);

    const { result } = renderHook(() => useIntegratedProfileLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user).toBeNull();
    });

    expect(result.current.profile.data).toEqual({
      username: '',
      email: '',
      fullName: '',
      gender: '',
      daysOnline: '',
    });
  });

  it('hydrates the signed-in user from auth context and derives daysOnline from the profile created date', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutAndHistoryProfile.user,
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedProfileLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.profile.data).toEqual({
      username: userWithWorkoutAndHistoryProfile.user!.username,
      email: userWithWorkoutAndHistoryProfile.user!.email,
      fullName: userWithWorkoutAndHistoryProfile.user!.name,
      gender: userWithWorkoutAndHistoryProfile.user!.gender,
      daysOnline: getDaysSince(userWithWorkoutAndHistoryProfile.user!.created_at.split('T')[0]),
    });
  });

  it('reflects setUser updates coming from the auth context through the profile hook consumer', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedProfileLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.profile.data.username).toBe('johnny');
    });

    await act(async () => {
      result.current.profile.setUser((prev: typeof userWithoutWorkoutProfile.user | undefined) =>
        prev
          ? {
              ...prev,
              username: 'jane',
              email: 'jane@example.com',
              name: 'Jane Smith',
              gender: 'Female',
            }
          : prev,
      );
    });

    expect(result.current.profile.data).toEqual({
      username: 'jane',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      gender: 'Female',
      daysOnline: getDaysSince(userWithoutWorkoutProfile.user!.created_at.split('T')[0]),
    });
  });
});
