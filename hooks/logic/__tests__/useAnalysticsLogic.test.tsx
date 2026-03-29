/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import {
  userWithWorkoutAndHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../../tests/fixtures/userProfiles';

jest.mock('axios', () => ({
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
const mockGetUserWorkout = jest.fn<
  () =>
    Promise<{
      workoutPlan: typeof userWithWorkoutAndHistoryProfile.workout;
      workoutPlanForEditWorkout: typeof userWithWorkoutAndHistoryProfile.workoutForEdit;
    }>
>();
const mockGetUserExerciseTracking = jest.fn<() => Promise<ReturnType<typeof createPackedTrackingResponse>>>();
const mockGetTrackingAnalytics = jest.fn<() => Promise<ReturnType<typeof createAnalyticsResponseFromProfile>>>();
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
  getUserWorkout: () => mockGetUserWorkout(),
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
}));

jest.mock('../../../services/AnalyticsService', () => ({
  getTrackingAnalytics: () => mockGetTrackingAnalytics(),
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
import { GlobalAppLoadingProvider } from '../../../context/GlobalAppLoadingContext';
import { WorkoutProvider, useWorkoutContext } from '../../../context/WorkoutContext';
import useAnalysticsLogic from '../useAnalysticsLogic';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutProvider>
        <AnalysisProvider>{children}</AnalysisProvider>
      </WorkoutProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedAnalyticsLogic = () => {
  const auth = useAuth();
  const workout = useWorkoutContext();
  const analysis = useAnalysisContext();
  const analytics = useAnalysticsLogic();
  return { auth, workout, analysis, analytics };
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

const createAnalyticsResponseFromProfile = () => ({
  _1RM: {
    1: {
      exercise: userWithWorkoutAndHistoryProfile.exerciseTrackingMaps!.byETSId[101][0].exercise,
      pr_weight: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxWeight,
      pr_reps: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.pr.maxReps,
      max_1rm: 113.3,
    },
  },
  goals: {
    A: {
      [userWithWorkoutAndHistoryProfile.exerciseTrackingMaps!.byETSId[101][0].exercise]: {
        planned: 1,
        actual: 1,
        adherence_pct: 100,
      },
    },
  },
});

const setupCacheForScenario = ({
  userId,
  auth,
  workout,
  analysis,
  analytics,
}: {
  userId: string | null;
  auth?: unknown;
  workout?: unknown;
  analysis?: unknown;
  analytics?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:WORKOUTPLAN:')) return workout ?? null;
    if (key.startsWith('CACHE:TRACKING:')) return analysis ?? null;
    if (key.startsWith('CACHE:ANALYTICS:')) return analytics ?? null;
    return null;
  });
};

describe('useAnalysticsLogic integration', () => {
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

  it('starts empty while auth is still hydrating and there is no user yet', async () => {
    setupCacheForScenario({ userId: 'user-1' });
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'rotated-refresh-token',
      userId: 'user-1',
    });

    const userDeferred = createDeferred<typeof userWithWorkoutAndHistoryProfile.user>();
    const workoutDeferred = createDeferred<{
      workoutPlan: typeof userWithWorkoutAndHistoryProfile.workout;
      workoutPlanForEditWorkout: typeof userWithWorkoutAndHistoryProfile.workoutForEdit;
    }>();
    const trackingDeferred = createDeferred<ReturnType<typeof createPackedTrackingResponse>>();
    const analyticsDeferred = createDeferred<ReturnType<typeof createAnalyticsResponseFromProfile>>();

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserWorkout.mockReturnValue(workoutDeferred.promise);
    mockGetUserExerciseTracking.mockReturnValue(trackingDeferred.promise);
    mockGetTrackingAnalytics.mockReturnValue(analyticsDeferred.promise);

    const { result } = renderHook(() => useIntegratedAnalyticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user).toBeNull();
    });

    expect(result.current.analytics.hasData).toBe(false);
    expect(result.current.analytics.loading).toBe(false);
    expect(result.current.analytics.data.overview).toEqual({
      workoutCount: 0,
      splitsCounter: {},
      workoutPlan: null,
    });
    expect(result.current.analytics.data._1rms.rm).toEqual({});
    expect(result.current.analytics.data.adherence.adh).toEqual({});
  });

  it('keeps the analytics hook empty for a signed-in user without workout history', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      workout: {
        workoutPlan: userWithoutWorkoutProfile.workout,
        workoutPlanForEditWorkout: userWithoutWorkoutProfile.workoutForEdit,
      },
      analysis: {
        exerciseTrackingMaps: userWithoutWorkoutProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithoutWorkoutProfile.analyzedExerciseTrackingData,
      },
      analytics: null,
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedAnalyticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.analytics.hasData).toBe(false);
    expect(result.current.analytics.loading).toBe(true);
    expect(result.current.analytics.data.overview).toEqual({
      workoutCount: 0,
      splitsCounter: {},
      workoutPlan: null,
    });
    expect(result.current.analytics.data._1rms.rm).toEqual({});
    expect(result.current.analytics.data.adherence.adh).toEqual({});
    expect(mockGetTrackingAnalytics).not.toHaveBeenCalled();
  });

  it('hydrates overview from workout and analysis contexts and reads _1RM plus adherence from analytics cache', async () => {
    const analyticsPayload = createAnalyticsResponseFromProfile();
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutAndHistoryProfile.user,
      workout: {
        workoutPlan: userWithWorkoutAndHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
      },
      analysis: {
        exerciseTrackingMaps: userWithWorkoutAndHistoryProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
      },
      analytics: analyticsPayload,
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedAnalyticsLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.analytics.hasData).toBe(true);
    });

    expect(result.current.analytics.loading).toBe(false);
    expect(result.current.analytics.data.overview).toEqual({
      workoutCount: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.workoutCount,
      splitsCounter: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.splitDaysByName,
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
    });
    expect(result.current.analytics.data._1rms.rm).toEqual(analyticsPayload._1RM);
    expect(result.current.analytics.data.adherence.adh).toEqual(analyticsPayload.goals);
    expect(mockGetTrackingAnalytics).not.toHaveBeenCalled();
  });

  it('fetches analytics from the API after auth validation once analysis data exists and no analytics cache is present', async () => {
    setupCacheForScenario({ userId: 'user-1' });
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'rotated-refresh-token',
      userId: 'user-1',
    });

    const userDeferred = createDeferred<typeof userWithWorkoutAndHistoryProfile.user>();
    const workoutDeferred = createDeferred<{
      workoutPlan: typeof userWithWorkoutAndHistoryProfile.workout;
      workoutPlanForEditWorkout: typeof userWithWorkoutAndHistoryProfile.workoutForEdit;
    }>();
    const trackingDeferred = createDeferred<ReturnType<typeof createPackedTrackingResponse>>();
    const analyticsDeferred = createDeferred<ReturnType<typeof createAnalyticsResponseFromProfile>>();

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserWorkout.mockReturnValue(workoutDeferred.promise);
    mockGetUserExerciseTracking.mockReturnValue(trackingDeferred.promise);
    mockGetTrackingAnalytics.mockReturnValue(analyticsDeferred.promise);

    const { result } = renderHook(() => useIntegratedAnalyticsLogic(), { wrapper });

    userDeferred.resolve(userWithWorkoutAndHistoryProfile.user);
    workoutDeferred.resolve({
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
      workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
    });
    trackingDeferred.resolve(createPackedTrackingResponse());

    await waitFor(() => {
      expect(result.current.analytics.hasData).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.analytics.loading).toBe(true);
    });

    expect(result.current.analytics.data.overview).toEqual({
      workoutCount: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.workoutCount,
      splitsCounter: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData!.splitDaysByName,
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
    });

    analyticsDeferred.resolve(createAnalyticsResponseFromProfile());

    await waitFor(() => {
      expect(result.current.analytics.data._1rms.rm).toEqual(createAnalyticsResponseFromProfile()._1RM);
    });

    expect(result.current.analytics.data.adherence.adh).toEqual(createAnalyticsResponseFromProfile().goals);
    expect(result.current.analytics.loading).toBe(false);
    expect(mockGetTrackingAnalytics).toHaveBeenCalledTimes(1);
  });
});
