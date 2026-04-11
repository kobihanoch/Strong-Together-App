/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import { AxiosError } from 'axios';

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
  () => Promise<{
    workoutPlan: typeof userWithWorkoutAndHistoryProfile.workout;
    workoutPlanForEditWorkout: typeof userWithWorkoutAndHistoryProfile.workoutForEdit;
  }>
>();
const mockGetUserExerciseTracking = jest.fn<() => Promise<ReturnType<typeof createPackedTrackingResponse>>>();
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

jest.mock('../../../../../infrastructure/cache/cache.utils', () => {
  const actual = jest.requireActual('../../../../../infrastructure/cache/cache.utils') as Record<string, unknown>;
  return {
    ...actual,
    cacheGetJSON: (key: string) => mockCacheGetJSON(key),
    cacheSetJSON: (key: string, value: unknown, ttl: number) => mockCacheSetJSON(key, value, ttl),
    cacheDeleteAllCache: () => mockCacheDeleteAllCache(),
    cacheDeleteAllCacheWithoutStartWorkout: () => mockCacheDeleteAllCacheWithoutStartWorkout(),
  };
});

jest.mock('../../../../guest-user/auth/shared/utils/token-storage.utils', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../../guest-user/auth/shared/services/auth.service', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../../profile/services/user-update.service', () => ({
  fetchSelfUserData: () => mockFetchSelfUserData(),
}));

jest.mock('../../../workouts/plan/services/workout-plan.service', () => ({
  getUserWorkout: () => mockGetUserWorkout(),
}));

jest.mock('../../../workouts/history/services/workout-history.service', () => ({
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
}));

jest.mock('../../../../../infrastructure/socket', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../../guest-user/auth/shared/hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../../guest-user/auth/shared/hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../../../infrastructure/api/bootstrap-api', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../../guest-user/auth/shared/utils/auth.utils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

import { WorkoutHistoryProvider } from '../../../workouts/shared/providers/WorkoutHistoryProvider';
import { GlobalAppLoadingProvider } from '../../../../../shared/providers/GlobalAppLoadingProvider';
import { WorkoutPlanProvider } from '../../../workouts/shared/providers/WorkoutPlanProvider';
import useHomePageLogic from '../use-home-page-logic.hook';
import {
  userWithoutWorkoutProfile,
  userWithWorkoutAndHistoryProfile,
} from '../../../../../tests/fixtures/userProfiles';
import { AuthProvider, useAuth } from '../../../../guest-user/auth/shared/providers/AuthProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutPlanProvider>
        <WorkoutHistoryProvider>{children}</WorkoutHistoryProvider>
      </WorkoutPlanProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedHomeLogic = () => {
  const auth = useAuth();
  const { data } = useHomePageLogic();
  return {
    auth,
    data,
  };
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

const setupCacheForScenario = ({
  userId,
  auth,
  workout,
  analysis,
}: {
  userId: string | null;
  auth?: any;
  workout?: any;
  analysis?: any;
}) => {
  mockCacheGetJSON.mockImplementation(async (...args: [string]) => {
    const [key] = args;
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:WORKOUTPLAN:')) return workout ?? null;
    if (key.startsWith('CACHE:TRACKING:')) return analysis ?? null;
    return null;
  });
};

describe('useHomePageLogic integration', () => {
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

  it('shows the transient loading flow where user is still null before auth and data hydration complete', async () => {
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

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserWorkout.mockReturnValue(workoutDeferred.promise);
    mockGetUserExerciseTracking.mockReturnValue(trackingDeferred.promise);

    const { result } = renderHook(() => useIntegratedHomeLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.data.isLoading).toBe(true);
    });

    expect(result.current.auth.user).toBeNull();
    expect(result.current.data.username).toBe('');
    expect(result.current.data.hasAssignedWorkout).toBe(false);
    expect(result.current.data.hasTracking).toBe(false);

    userDeferred.resolve(userWithWorkoutAndHistoryProfile.user);
    workoutDeferred.resolve({
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
      workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
    });
    trackingDeferred.resolve(createPackedTrackingResponse());

    await waitFor(() => {
      expect(result.current.data.username).toBe('johnny');
    });

    expect(result.current.data.hasAssignedWorkout).toBe(true);
    expect(result.current.data.hasTracking).toBe(true);
    expect(result.current.data.workoutSplitsNumber).toBe(2);
    expect(result.current.data.isLoading).toBe(false);
  });

  it('hydrates a signed-in user without workout and without tracking from the real auth/workout/analysis context flow', async () => {
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
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedHomeLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.data).toEqual({
      username: 'johnny',
      userId: 'user-1',
      hasAssignedWorkout: false,
      hasTracking: false,
      profileImageUrl: '',
      firstName: 'John',
      lastWorkoutDate: 'none',
      totalWorkoutNumber: 0,
      workoutSplitsNumber: 0,
      mostFrequentSplit: null,
      PR: null,
      isLoading: false,
    });
    expect(mockFetchSelfUserData).not.toHaveBeenCalled();
    expect(mockGetUserWorkout).not.toHaveBeenCalled();
    expect(mockGetUserExerciseTracking).not.toHaveBeenCalled();
  });

  it('hydrates a signed-in user with workout and history and lets the full provider chain reach HomePageLogic', async () => {
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
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedHomeLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.data.hasTracking).toBe(true);
    });

    expect(result.current.auth.user).toEqual(userWithWorkoutAndHistoryProfile.user);
    expect(result.current.data).toEqual({
      username: 'johnny',
      userId: 'user-1',
      hasAssignedWorkout: true,
      hasTracking: true,
      profileImageUrl: '',
      firstName: 'John',
      lastWorkoutDate: '2026-03-27',
      totalWorkoutNumber: 1,
      workoutSplitsNumber: 2,
      mostFrequentSplit: {
        splitName: 'A',
        times: 1,
      },
      PR: {
        maxReps: 10,
        maxWeight: 85,
        maxExercise: 'Bench Press',
        maxDate: '2026-03-27',
      },
      isLoading: false,
    });
  });
});
