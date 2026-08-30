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
  AxiosError: class AxiosError extends Error {},
}));

const mockNavigate = jest.fn<(screen: string) => void>();
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
const mockAddWorkout = jest.fn<(payload: unknown) => Promise<any>>();
const mockApiGet = jest.fn<(url: string) => Promise<{ data: unknown }>>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockHasBootstrapPayload = jest.fn<() => boolean>();
const mockResetBootstrap = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();
const mockDialogShow = jest.fn<(payload: unknown) => void>();
const mockDialogHide = jest.fn<() => void>();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: (screen: string) => mockNavigate(screen),
  }),
}));

jest.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    WARNING: 'WARNING',
  },
  Dialog: {
    show: (payload: unknown) => mockDialogShow(payload),
    hide: () => mockDialogHide(),
  },
}));

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

jest.mock('../../services/workout-editor.service', () => ({
  getUserWorkout: () => mockGetUserWorkout(),
  addWorkout: (payload: unknown) => mockAddWorkout(payload),
}));

jest.mock('../../../../../infrastructure/api/api-config/api', () => ({
  __esModule: true,
  default: {
    get: (url: string) => mockApiGet(url),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
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

import { AuthProvider } from '../../../../auth/shared/providers/AuthProvider';
import { GlobalAppLoadingProvider } from '../../../../../shared/providers/GlobalAppLoadingProvider';
import { WorkoutPlanProvider, useWorkoutPlan } from '../../../shared/providers/WorkoutPlanProvider';
import useCreateWorkoutLogic from '../use-create-workout-logic.hook';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutPlanProvider>{children}</WorkoutPlanProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedCreateWorkoutLogic = () => {
  const workoutContext = useWorkoutPlan();
  const logic = useCreateWorkoutLogic();
  return {
    workoutContext,
    logic,
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

const createExercisesMapFromProfile = () => ({
  Chest: [
    {
      id: userWithWorkoutNoHistoryProfile.workoutForEdit!.A[0].id,
      name: userWithWorkoutNoHistoryProfile.workoutForEdit!.A[0].name,
      specificTargetMuscle: userWithWorkoutNoHistoryProfile.workoutForEdit!.A[0].specificTargetMuscle,
    },
  ],
  Back: [
    {
      id: userWithWorkoutNoHistoryProfile.workoutForEdit!.B[0].id,
      name: userWithWorkoutNoHistoryProfile.workoutForEdit!.B[0].name,
      specificTargetMuscle: userWithWorkoutNoHistoryProfile.workoutForEdit!.B[0].specificTargetMuscle,
    },
  ],
});

const createAddWorkoutResponseFromProfile = () => ({
  message: 'Workout saved successfully',
  workoutPlan: userWithWorkoutNoHistoryProfile.workout!,
  workoutPlanForEditWorkout: userWithWorkoutNoHistoryProfile.workoutForEdit!,
});

const setupCacheForScenario = ({
  userId,
  auth,
  workout,
}: {
  userId: string | null;
  auth?: unknown;
  workout?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:WORKOUTPLAN:')) return workout ?? null;
    return null;
  });
};

describe('use-create-workout-logic.hook integration', () => {
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
    mockApiGet.mockResolvedValue({
      data: createExercisesMapFromProfile(),
    });
  });

  it('starts from the default empty builder state while auth is still hydrating', async () => {
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

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserWorkout.mockReturnValue(workoutDeferred.promise);

    const { result } = renderHook(() => useIntegratedCreateWorkoutLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.selectedSplit).toBe('A');
    });

    expect(result.current.logic.selectedExercises).toEqual({ A: [] });
    expect(result.current.logic.hasWorkout).toBe(false);
    expect(result.current.logic.exForSplit).toEqual([]);
    expect(result.current.logic.totalExercises).toBe(0);
    expect(result.current.logic.exerciseCountMap).toEqual({ A: 0 });
  });

  it('hydrates edit mode from the workout context and uses the existing workoutForEdit profile data', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutNoHistoryProfile.user,
      workout: {
        workoutPlan: userWithWorkoutNoHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutNoHistoryProfile.workoutForEdit,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedCreateWorkoutLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.hasWorkout).toBe(true);
    });

    expect(result.current.logic.selectedExercises).toEqual(userWithWorkoutNoHistoryProfile.workoutForEdit);
    expect(result.current.logic.splitsList).toEqual(['A', 'B']);
    expect(result.current.logic.exForSplit).toEqual(userWithWorkoutNoHistoryProfile.workoutForEdit?.A);
    expect(result.current.logic.exerciseCountMap).toEqual({
      A: 1,
      B: 1,
    });
    expect(result.current.logic.totalExercises).toBe(2);
    expect(result.current.logic.muscles).toEqual(['All', 'Chest', 'Back']);
  });

  it('blocks save when the workout has an empty split and shows the validation dialog', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      workout: {
        workoutPlan: userWithoutWorkoutProfile.workout,
        workoutPlanForEditWorkout: userWithoutWorkoutProfile.workoutForEdit,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedCreateWorkoutLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.selectedExercises).toEqual({ A: [] });
    });

    await act(async () => {
      await result.current.logic.saveWorkout();
    });

    expect(mockAddWorkout).not.toHaveBeenCalled();
    expect(mockDialogShow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Workout is incomplete',
      }),
    );
  });

  it('adds exercises, saves a new workout, updates the workout context, and navigates to MyWorkoutPlan', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      workout: {
        workoutPlan: userWithoutWorkoutProfile.workout,
        workoutPlanForEditWorkout: userWithoutWorkoutProfile.workoutForEdit,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());
    mockAddWorkout.mockResolvedValue(createAddWorkoutResponseFromProfile());

    const { result } = renderHook(() => useIntegratedCreateWorkoutLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.availableExercises).toEqual(createExercisesMapFromProfile());
    });

    await act(async () => {
      result.current.logic.controls.addExercise({
        id: 1,
        name: 'Bench Press',
        targetMuscle: 'Chest',
        specificTargetMuscle: 'Major',
      });
    });

    expect(result.current.logic.selectedExercises).toEqual({
      A: [
        {
          id: 1,
          name: 'Bench Press',
          targetMuscle: 'Chest',
          specificTargetMuscle: 'Major',
          sets: [10, 10, 10],
          orderIndex: 0,
        },
      ],
    });

    await act(async () => {
      await result.current.logic.saveWorkout();
    });

    await waitFor(() => {
      expect(result.current.workoutContext.workout).toEqual(userWithWorkoutNoHistoryProfile.workout);
    });

    expect(result.current.workoutContext.workoutForEdit).toEqual(userWithWorkoutNoHistoryProfile.workoutForEdit);
    expect(result.current.logic.hasWorkout).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('MyWorkoutPlan');
  });

  it('prevents duplicate save requests while a save is already in flight and resets isSaving after a failure', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      workout: {
        workoutPlan: userWithoutWorkoutProfile.workout,
        workoutPlanForEditWorkout: userWithoutWorkoutProfile.workoutForEdit,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const deferred = createDeferred<ReturnType<typeof createAddWorkoutResponseFromProfile>>();
    mockAddWorkout.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useIntegratedCreateWorkoutLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.logic.availableExercises).toEqual(createExercisesMapFromProfile());
    });

    await act(async () => {
      result.current.logic.controls.addExercise({
        id: 1,
        name: 'Bench Press',
        targetMuscle: 'Chest',
        specificTargetMuscle: 'Major',
      });
    });

    act(() => {
      result.current.logic.saveWorkout();
      result.current.logic.saveWorkout();
    });

    expect(mockAddWorkout).toHaveBeenCalledTimes(1);
    expect(result.current.logic.loadings.isSaving).toBe(true);

    await act(async () => {
      deferred.reject(new Error('save failed'));
      try {
        await deferred.promise;
      } catch {}
    });

    await waitFor(() => {
      expect(result.current.logic.loadings.isSaving).toBe(false);
    });
  });
});


