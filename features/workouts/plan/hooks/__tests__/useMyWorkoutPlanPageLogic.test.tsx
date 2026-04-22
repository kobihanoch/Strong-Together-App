/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import {
  userWithWorkoutAndHistoryProfile,
  userWithWorkoutNoHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../../../../tests/fixtures/userProfiles';

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
const mockRefreshAndRotateTokens = jest.fn<
  () => Promise<{ accessToken: string; refreshToken: string; userId: string }>
>();
const mockFetchSelfUserData = jest.fn<() => Promise<typeof userWithWorkoutAndHistoryProfile.user>>();
const mockGetUserWorkout = jest.fn<
  () =>
    Promise<{
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

jest.mock('../../../../auth/shared/utils/token-storage.utils', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../../auth/shared/services/auth.service', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  fetchSelfUserData: () => mockFetchSelfUserData(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../services/workout-plan.service', () => ({
  getUserWorkout: () => mockGetUserWorkout(),
}));

jest.mock('../../../history/services/workout-history.service', () => ({
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
}));

jest.mock('../../../../../infrastructure/socket', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../../../../shared/hooks/use-network-status.hook', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../../auth/shared/hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../../auth/shared/hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../../../infrastructure/api/api-config/bootstrap', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../../auth/shared/utils/auth.utils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

import { WorkoutHistoryProvider } from '../../../shared/providers/WorkoutHistoryProvider';
import { AuthProvider, useAuth } from '../../../../auth/shared/providers/AuthProvider';
import { GlobalAppLoadingProvider } from '../../../../../shared/providers/GlobalAppLoadingProvider';
import { WorkoutPlanProvider } from '../../../shared/providers/WorkoutPlanProvider';
import { useMyWorkoutPlanPageLogic } from '../use-my-workout-plan-page-logic.hook';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutPlanProvider>
        <WorkoutHistoryProvider>{children}</WorkoutHistoryProvider>
      </WorkoutPlanProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedMyWorkoutPlanLogic = () => {
  const auth = useAuth();
  const logic = useMyWorkoutPlanPageLogic();
  return { auth, logic };
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
  auth?: unknown;
  workout?: unknown;
  analysis?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:WORKOUTPLAN:')) return workout ?? null;
    if (key.startsWith('CACHE:TRACKING:')) return analysis ?? null;
    return null;
  });
};

describe('useMyWorkoutPlanPageLogic integration', () => {
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

  it('starts empty while auth is still hydrating and the user is still null', async () => {
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

    const { result } = renderHook(() => useIntegratedMyWorkoutPlanLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user).toBeNull();
    });

    expect(result.current.logic.hasWorkout).toBe(false);
    expect(result.current.logic.selectedSplit).toBeNull();
    expect(result.current.logic.filteredExercises).toBeUndefined();
    expect(result.current.logic.exerciseCounter).toBeUndefined();
    expect(result.current.logic.splitTrainedCount).toBeUndefined();
    expect(result.current.logic.hasTrainedToday).toBe(false);

    userDeferred.resolve(userWithWorkoutAndHistoryProfile.user);
    workoutDeferred.resolve({
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
      workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
    });
    trackingDeferred.resolve(createPackedTrackingResponse());

    await waitFor(() => {
      expect(result.current.logic.hasWorkout).toBe(true);
    });

    expect(result.current.logic.selectedSplit?.name).toBe('A');
  });

  it('hydrates a signed-in user without a workout and keeps the hook in the empty plan state', async () => {
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

    const { result } = renderHook(() => useIntegratedMyWorkoutPlanLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.logic.workout).toBeNull();
    expect(result.current.logic.hasWorkout).toBe(false);
    expect(result.current.logic.workoutSplits).toEqual([]);
    expect(result.current.logic.allExercises).toEqual({});
    expect(result.current.logic.selectedSplit).toBeNull();
    expect(result.current.logic.filteredExercises).toBeUndefined();
    expect(result.current.logic.splitTrainedCount).toBeUndefined();
    expect(result.current.logic.exerciseCounter).toBeUndefined();
    expect(result.current.logic.hasTrainedToday).toBe(false);
  });

  it('hydrates a user with a workout and no history, selects the first split, and updates exercises when the split changes', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutNoHistoryProfile.user,
      workout: {
        workoutPlan: userWithWorkoutNoHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutNoHistoryProfile.workoutForEdit,
      },
      analysis: {
        exerciseTrackingMaps: userWithWorkoutNoHistoryProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithWorkoutNoHistoryProfile.analyzedExerciseTrackingData,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedMyWorkoutPlanLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.hasWorkout).toBe(true);
    });

    expect(result.current.logic.selectedSplit).toEqual({
      id: 11,
      name: 'A',
      muscleGroup: 'Chest(Major)',
    });
    expect(result.current.logic.filteredExercises).toEqual(
      userWithWorkoutNoHistoryProfile.workout?.workoutsplits?.[0].exercisetoworkoutsplit,
    );
    expect(result.current.logic.exerciseCounter).toEqual({
      A: 1,
      B: 1,
    });
    expect(result.current.logic.splitTrainedCount).toBeUndefined();
    expect(result.current.logic.hasTrainedToday).toBe(false);

    await act(async () => {
      result.current.logic.handleWorkoutSplitPress({
        id: 12,
        name: 'B',
        muscleGroup: 'Back(Lats)',
      });
    });

    expect(result.current.logic.selectedSplit).toEqual({
      id: 12,
      name: 'B',
      muscleGroup: 'Back(Lats)',
    });
    expect(result.current.logic.filteredExercises).toEqual(
      userWithWorkoutNoHistoryProfile.workout?.workoutsplits?.[1].exercisetoworkoutsplit,
    );
  });

  it('hydrates a user with workout history and derives the trained count for the selected split from analysis data', async () => {
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

    const { result } = renderHook(() => useIntegratedMyWorkoutPlanLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.selectedSplit?.name).toBe('A');
    });

    expect(result.current.logic.splitTrainedCount).toBe(1);
    expect(result.current.logic.exerciseCounter).toEqual({
      A: 1,
      B: 1,
    });
    expect(result.current.logic.hasTrainedToday).toBe(false);

    await act(async () => {
      result.current.logic.setSelectedSplit({
        id: 12,
        name: 'B',
        muscleGroup: 'Back(Lats)',
      });
    });

    expect(result.current.logic.selectedSplit?.name).toBe('B');
    expect(result.current.logic.splitTrainedCount).toBe(0);
    expect(result.current.logic.filteredExercises?.[0].exercise).toBe('Lat Pulldown');
  });
});

