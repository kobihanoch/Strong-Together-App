/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import moment from 'moment-timezone';
import { userWithWorkoutAndHistoryProfile, userWithoutWorkoutProfile } from '../../../tests/fixtures/userProfiles';

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
const mockGetUserExerciseTracking = jest.fn<() => Promise<any>>();
const mockGetUserCardio = jest.fn<() => Promise<any>>();
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

jest.mock('../../../cache/cacheUtils', () => {
  const actual = jest.requireActual('../../../cache/cacheUtils') as Record<string, unknown>;
  return {
    ...actual,
    cacheGetJSON: (key: string) => mockCacheGetJSON(key),
    cacheSetJSON: (key: string, value: unknown, ttl: number) => mockCacheSetJSON(key, value, ttl),
    cacheDeleteAllCache: () => mockCacheDeleteAllCache(),
    cacheDeleteAllCacheWithoutStartWorkout: () => mockCacheDeleteAllCacheWithoutStartWorkout(),
  };
});

jest.mock('../../../utils/tokenStore', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../services/AuthService', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../../services/UserService', () => ({
  fetchSelfUserData: () => mockFetchSelfUserData(),
}));

jest.mock('../../../services/WorkoutService', () => ({
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
}));

jest.mock('../../../services/CardioService', () => ({
  getUserCardio: () => mockGetUserCardio(),
}));

jest.mock('../../../webSockets/socketConfig', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../hooks/oAuth/useGoogleAuth', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../hooks/oAuth/useAppleAuth', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../api/bootstrapApi', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../utils/authUtils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

import { AnalysisProvider, useAnalysisContext } from '../../../context/AnalysisContext';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import { CardioProvider, useCardioContext } from '../../../context/CardioContext';
import { GlobalAppLoadingProvider } from '../../../context/GlobalAppLoadingContext';
import useStatisticsPageLogic from '../useStatisticsPageLogic';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <AnalysisProvider>
        <CardioProvider>{children}</CardioProvider>
      </AnalysisProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedStatisticsLogic = () => {
  const auth = useAuth();
  const analysis = useAnalysisContext();
  const cardio = useCardioContext();
  const statistics = useStatisticsPageLogic();
  return { auth, analysis, cardio, statistics };
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

const createNetworkAxiosError = (): AxiosError => {
  const err = new AxiosError('offline');
  (err as AxiosError & { isNetworkError: boolean }).isNetworkError = true;
  return err;
};

const createPackedTrackingResponse = () => ({
  exerciseTrackingMaps: userWithWorkoutAndHistoryProfile.exerciseTrackingMaps!,
  exerciseTrackingAnalysis: {
    unique_days: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.workoutCount,
    most_frequent_split: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.mostFrequentSplit.splitName,
    most_frequent_split_days: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.mostFrequentSplit.times,
    lastWorkoutDate: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.lastWorkoutDate,
    splitDaysByName: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.splitDaysByName,
    prs: {
      pr_max: {
        exercise: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxExercise!,
        weight: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxWeight,
        reps: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxReps,
        workout_time_utc: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxDate,
      },
    },
  },
});

const createCardioCachePayload = (selectedDate: string) => {
  const baseDailyRecord = userWithWorkoutAndHistoryProfile.cardioDailyMap?.['2026-03-27']?.[0];
  const baseWeeklyRecord = userWithWorkoutAndHistoryProfile.cardioWeeklyMap?.['2026-03-23']?.records?.[0];

  return {
    daily: {
      [selectedDate]: baseDailyRecord ? [{ ...baseDailyRecord }] : [],
    },
    weekly: {
      [moment.tz(selectedDate, 'YYYY-MM-DD', 'UTC').startOf('week').format('YYYY-MM-DD')]: {
        records: baseWeeklyRecord
          ? [
              {
                ...baseWeeklyRecord,
                workout_time_utc: `${selectedDate}T06:00:00.000Z`,
              },
            ]
          : [],
        total_duration_mins: baseDailyRecord?.duration_mins ?? 0,
        total_duration_sec: baseDailyRecord?.duration_sec ?? 0,
      },
    },
  };
};

const setupCacheForScenario = ({
  userId,
  auth,
  analysis,
  cardio,
}: {
  userId: string | null;
  auth?: unknown;
  analysis?: unknown;
  cardio?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:TRACKING:')) return analysis ?? null;
    if (key.startsWith('CACHE:CARDIO:')) return cardio ?? null;
    return null;
  });
};

describe('useStatisticsPageLogic integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'UTC' }),
        }) as Intl.DateTimeFormat,
    );
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts with todays selected date and empty derived statistics while auth is still hydrating', async () => {
    setupCacheForScenario({ userId: 'user-1' });
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'rotated-refresh-token',
      userId: 'user-1',
    });

    const userDeferred = createDeferred<typeof userWithWorkoutAndHistoryProfile.user>();
    const trackingDeferred = createDeferred<ReturnType<typeof createPackedTrackingResponse>>();
    const cardioDeferred = createDeferred<ReturnType<typeof createCardioCachePayload>>();

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserExerciseTracking.mockReturnValue(trackingDeferred.promise);
    mockGetUserCardio.mockReturnValue(cardioDeferred.promise);

    const { result } = renderHook(() => useIntegratedStatisticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.statistics.selectedDate).toBe(moment.tz('UTC').format('YYYY-MM-DD'));
    });

    expect(result.current.auth.user).toBeNull();
    expect(result.current.statistics.exerciseTrackingWithDateKey).toBeNull();
    expect(result.current.statistics.exerciseTrackingByDate).toBeUndefined();
    expect(result.current.statistics.exerciseTrackingByDatePrev).toEqual([]);
    expect(result.current.statistics.cardioByDate).toBeUndefined();
    expect(result.current.statistics.cardioForWeek).toBeUndefined();
  });

  it('hydrates empty analysis and cardio maps for a signed-in user without workout history or cardio', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      analysis: {
        exerciseTrackingMaps: userWithoutWorkoutProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithoutWorkoutProfile.analyzedExerciseTrackingData,
      },
      cardio: {
        daily: userWithoutWorkoutProfile.cardioDailyMap,
        weekly: userWithoutWorkoutProfile.cardioWeeklyMap,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedStatisticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.statistics.exerciseTrackingWithDateKey).toEqual({});
    expect(result.current.statistics.exerciseTrackingWithETSIdKey).toEqual({});
    expect(result.current.statistics.exerciseTrackingByDate).toBeUndefined();
    expect(result.current.statistics.exerciseTrackingByDatePrev).toEqual([]);
    expect(result.current.statistics.cardioByDate).toBeUndefined();
    expect(result.current.statistics.cardioForWeek).toBeUndefined();
  });

  it('accepts hydrated tracking maps from the analysis context and exposes them through the statistics hook', async () => {
    const today = moment.tz('UTC').format('YYYY-MM-DD');
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      analysis: {
        exerciseTrackingMaps: userWithoutWorkoutProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithoutWorkoutProfile.analyzedExerciseTrackingData,
      },
      cardio: {
        daily: userWithoutWorkoutProfile.cardioDailyMap,
        weekly: userWithoutWorkoutProfile.cardioWeeklyMap,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedStatisticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    await waitFor(() => {
      expect(result.current.cardio.dailyCardioMap).toEqual({});
    });

    await act(async () => {
      result.current.analysis.setExerciseTrackingMaps(userWithWorkoutAndHistoryProfile.exerciseTrackingMaps);
    });

    expect(result.current.statistics.selectedDate).toBe(today);
    expect(result.current.statistics.exerciseTrackingWithDateKey).toEqual(
      userWithWorkoutAndHistoryProfile.exerciseTrackingMaps?.byDate,
    );
    expect(result.current.statistics.exerciseTrackingWithETSIdKey).toEqual(
      userWithWorkoutAndHistoryProfile.exerciseTrackingMaps?.byETSId,
    );
    expect(result.current.statistics.exerciseTrackingByDate).toEqual(
      today === '2026-03-27' ? userWithWorkoutAndHistoryProfile.exerciseTrackingMaps?.byDate['2026-03-27'] : undefined,
    );
    expect(result.current.statistics.exerciseTrackingByDatePrev).toEqual([]);
  });

  it('hydrates cardio data for the selected day and current week through the real cardio context flow', async () => {
    const today = moment.tz('UTC').format('YYYY-MM-DD');
    const cardioPayload = createCardioCachePayload(today);

    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      analysis: {
        exerciseTrackingMaps: userWithoutWorkoutProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithoutWorkoutProfile.analyzedExerciseTrackingData,
      },
      cardio: cardioPayload,
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedStatisticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    await waitFor(() => {
      expect(result.current.cardio.dailyCardioMap).toEqual(cardioPayload.daily);
    });

    expect(result.current.statistics.selectedDate).toBe(today);
    expect(result.current.statistics.cardioByDate).toEqual(cardioPayload.daily[today]);
    expect(result.current.statistics.cardioForWeek).toEqual(
      cardioPayload.weekly[moment.tz(today, 'YYYY-MM-DD', 'UTC').startOf('week').format('YYYY-MM-DD')],
    );
  });
});
