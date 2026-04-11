/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import { AppState } from 'react-native';
import { GetExerciseTrackingResponse } from '@strong-together/shared';
import {
  userWithWorkoutAndHistoryProfile,
  userWithWorkoutNoHistoryProfile,
} from '../../../../../tests/fixtures/userProfiles';

jest.mock('axios', () => ({
  AxiosError: class AxiosError extends Error {},
}));

const mockReplace = jest.fn<(screen: string) => void>();
const mockCacheGetJSON = jest.fn<(key: string) => Promise<unknown>>();
const mockCacheSetJSON = jest.fn<(key: string, value: unknown, ttl: number) => Promise<void>>();
const mockCacheDeleteKey = jest.fn<(key: string) => Promise<void>>();
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
const mockGetUserExerciseTracking = jest.fn<() => Promise<GetExerciseTrackingResponse>>();
const mockSaveWorkoutData = jest.fn<
  (workout: unknown, startTime: number, endTime: number) => Promise<GetExerciseTrackingResponse>
>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockHasBootstrapPayload = jest.fn<() => boolean>();
const mockResetBootstrap = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();
const mockShowErrorAlert = jest.fn<(title: string, msg: string) => void>();
const mockAppStateRemove = jest.fn<() => void>();

jest.mock('@react-navigation/native', () => {
  const ReactLocal = jest.requireActual('react') as typeof React;
  return {
    useNavigation: () => ({
      replace: (screen: string) => mockReplace(screen),
    }),
    useFocusEffect: (effect: () => void | (() => void)) => {
      ReactLocal.useEffect(() => effect(), [effect]);
    },
  };
});

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

jest.mock('../../../../../cache/cacheUtils', () => {
  const actual = jest.requireActual('../../../../../cache/cacheUtils') as Record<string, unknown>;
  return {
    ...actual,
    cacheGetJSON: (key: string) => mockCacheGetJSON(key),
    cacheSetJSON: (key: string, value: unknown, ttl: number) => mockCacheSetJSON(key, value, ttl),
    cacheDeleteKey: (key: string) => mockCacheDeleteKey(key),
    cacheDeleteAllCache: () => mockCacheDeleteAllCache(),
    cacheDeleteAllCacheWithoutStartWorkout: () => mockCacheDeleteAllCacheWithoutStartWorkout(),
  };
});

jest.mock('../../../../../utils/tokenStore', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../../../services/AuthService', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../../../../services/UserService', () => ({
  fetchSelfUserData: () => mockFetchSelfUserData(),
}));

jest.mock('../../services/workout-session.service', () => ({
  getUserWorkout: () => mockGetUserWorkout(),
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
  saveWorkoutData: (workout: unknown, startTime: number, endTime: number) =>
    mockSaveWorkoutData(workout, startTime, endTime),
}));

jest.mock('../../../../../webSockets/socketConfig', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../../../hooks/oAuth/useGoogleAuth', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../../../hooks/oAuth/useAppleAuth', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../../../api/bootstrapApi', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../../../utils/authUtils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

jest.mock('../../../../../errors/errorAlerts', () => ({
  showErrorAlert: (title: string, msg: string) => mockShowErrorAlert(title, msg),
}));

import { keyStartWorkout, TTL_36H } from '../../../../../cache/cacheUtils';
import { WorkoutHistoryProvider, useWorkoutHistoryContext } from '../../../shared/providers/WorkoutHistoryProvider';
import { AuthProvider, useAuth } from '../../../../../context/AuthContext';
import { GlobalAppLoadingProvider } from '../../../../../context/GlobalAppLoadingContext';
import { WorkoutPlanProvider, useWorkoutPlanContext } from '../../../shared/providers/WorkoutPlanProvider';
import useStartWorkoutPageLogic from '../use-start-workout-page-logic.hook';

const baseWrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutPlanProvider>
        <WorkoutHistoryProvider>{children}</WorkoutHistoryProvider>
      </WorkoutPlanProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const ReadyGate = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { workout, loading: workoutLoading } = useWorkoutPlanContext();
  const { loading: analysisLoading } = useWorkoutHistoryContext();

  if (!user || !workout || workoutLoading || analysisLoading) return null;
  return <React.Fragment key="ready">{children}</React.Fragment>;
};

const readyWrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <WorkoutPlanProvider>
        <WorkoutHistoryProvider>
          <ReadyGate>{children}</ReadyGate>
        </WorkoutHistoryProvider>
      </WorkoutPlanProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

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

const createEmptyTrackingResponse = (): GetExerciseTrackingResponse => ({
  exerciseTrackingMaps: userWithWorkoutNoHistoryProfile.exerciseTrackingMaps!,
  exerciseTrackingAnalysis: {
    unique_days: 0,
    most_frequent_split: null,
    most_frequent_split_days: null,
    lastWorkoutDate: null,
    splitDaysByName: {},
    prs: {
      pr_max: null,
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

const createSelectedSplitFromProfile = () => ({
  id: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].id,
  name: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].name,
  muscleGroup: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].muscle_group,
});

const createResumedWorkoutFromProfile = () => ({
  workout: {
    [userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit[0].exercise!]: {
      etsid: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit[0].id,
      weight: [82.5],
      reps: [10],
      notes: 'Felt strong',
    },
  },
  startTime: Date.parse('2026-03-29T07:00:00.000Z'),
  lastPause: Date.parse('2026-03-29T07:15:00.000Z'),
  pausedTotal: 0,
});

const useIntegratedStartWorkoutPageLogic = (
  resumedWorkout?: ReturnType<typeof createResumedWorkoutFromProfile>,
) => {
  const auth = useAuth();
  const workout = useWorkoutPlanContext();
  const analysis = useWorkoutHistoryContext();
  const logic = useStartWorkoutPageLogic(createSelectedSplitFromProfile(), resumedWorkout);
  return { auth, workout, analysis, logic };
};

describe('use-start-workout-page-logic.hook integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppState, 'addEventListener').mockImplementation(
      () =>
        ({
          remove: () => mockAppStateRemove(),
        }) as any,
    );
    mockUseNetworkStatus.mockReturnValue(true);
    mockHasBootstrapPayload.mockReturnValue(false);
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockClearRefreshToken.mockResolvedValue(undefined);
    mockCacheSetJSON.mockResolvedValue(undefined);
    mockCacheDeleteKey.mockResolvedValue(undefined);
    mockCacheDeleteAllCache.mockResolvedValue(undefined);
    mockCacheDeleteAllCacheWithoutStartWorkout.mockResolvedValue(undefined);
    mockConnectSocket.mockResolvedValue(undefined);
    mockDisconnectSocket.mockReturnValue(undefined);
    mockGetUserExerciseTracking.mockResolvedValue(createEmptyTrackingResponse());
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('hydrates from the workout context, derives the selected split data, and writes the initial progress to start-workout cache', async () => {
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

    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(), { wrapper: readyWrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    const selectedExercise = userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit[0];

    expect(result.current.auth.isWorkoutMode).toBe(true);
    expect(result.current.logic.data.workoutName).toBe('A');
    expect(result.current.logic.data.exercisesForSelectedSplit).toEqual(
      userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit,
    );
    expect(result.current.logic.data.totalSets).toBe(selectedExercise.sets.length);
    expect(result.current.logic.data.setsDone).toBe(0);
    expect(result.current.logic.data.setsDoneWithExerciseNameKey).toEqual({
      [selectedExercise.exercise!]: {
        done: 0,
        planned: selectedExercise.sets.length,
      },
    });
    expect(result.current.logic.workoutProgressObj).toEqual({
      [selectedExercise.exercise!]: {
        etsid: selectedExercise.id,
        weight: [],
        reps: [],
        notes: null,
      },
    });

    await waitFor(() => {
      expect(mockCacheSetJSON).toHaveBeenCalledWith(
        keyStartWorkout('user-1'),
        expect.objectContaining({
          selectedSplit: {
            id: 11,
            name: 'A',
            muscleGroup: 'Chest(Major)',
          },
          workout: {
            [selectedExercise.exercise!]: {
              etsid: selectedExercise.id,
              weight: [],
              reps: [],
              notes: null,
            },
          },
          pausedTotal: 0,
        }),
        TTL_36H,
      );
    });
  });

  it('uses the resumed workout cache payload as the initial progress state and preserves the resumed timer fields', async () => {
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

    const resumedWorkout = createResumedWorkoutFromProfile();
    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(resumedWorkout), { wrapper: readyWrapper });

    await waitFor(() => {
      expect(result.current.logic.data.startTime).toBe(resumedWorkout.startTime);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    const exerciseName = userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit[0].exercise!;

    expect(result.current.logic.workoutProgressObj).toEqual(resumedWorkout.workout);
    expect(result.current.logic.data.pausedTotal).toBe(0);
    expect(result.current.logic.data.setsDone).toBe(1);
    expect(result.current.logic.data.setsDoneWithExerciseNameKey).toEqual({
      [exerciseName]: {
        done: 1,
        planned: 3,
      },
    });

    await waitFor(() => {
      expect(mockCacheSetJSON).toHaveBeenCalledWith(
        keyStartWorkout('user-1'),
        expect.objectContaining({
          workout: resumedWorkout.workout,
          startTime: resumedWorkout.startTime,
          pausedTotal: 0,
        }),
        TTL_36H,
      );
    });
  });

  it('updates workout progress through the controls and saves the finished workout into the analysis context', async () => {
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
    mockSaveWorkoutData.mockResolvedValue(createPackedTrackingResponse());

    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(), { wrapper: readyWrapper });

    await waitFor(() => {
      expect(result.current.logic.data.workoutName).toBe('A');
    });

    const selectedExercise = userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit[0];

    await act(async () => {
      result.current.logic.controls.addWeightRecord(selectedExercise.exercise!, 0, 80);
      result.current.logic.controls.addRepsRecord(selectedExercise.exercise!, 0, 10);
      result.current.logic.controls.addNotes(selectedExercise.exercise!, 'Solid top set');
    });

    await waitFor(() => {
      expect(result.current.logic.data.setsDone).toBe(1);
    });

    await act(async () => {
      await result.current.logic.saving.saveData();
    });

    expect(mockSaveWorkoutData).toHaveBeenCalledWith(
      [
        {
          exercisetosplit_id: selectedExercise.id,
          weight: [80],
          reps: [10],
          notes: 'Solid top set',
        },
      ],
      expect.any(Number),
      expect.any(Number),
    );
    expect(result.current.analysis.exerciseTrackingMaps).toEqual(userWithWorkoutAndHistoryProfile.exerciseTrackingMaps);
    expect(result.current.analysis.analyzedExerciseTrackingData).toEqual(
      userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
    );
    expect(result.current.auth.isWorkoutMode).toBe(false);
    expect(mockCacheDeleteKey).toHaveBeenCalledWith(keyStartWorkout('user-1'));
    expect(mockReplace).toHaveBeenCalledWith('Statistics');
  });

  it('blocks save when no set was actually performed and keeps the user inside the workout flow', async () => {
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

    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(), { wrapper: readyWrapper });

    await waitFor(() => {
      expect(result.current.logic.data.workoutName).toBe('A');
    });

    await act(async () => {
      await result.current.logic.saving.saveData();
    });

    expect(mockShowErrorAlert).toHaveBeenCalledWith('Saving Error', 'Please perform at least one set');
    expect(mockSaveWorkoutData).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalledWith('Statistics');
    expect(result.current.auth.isWorkoutMode).toBe(true);
  });

  it('clears the cached workout and navigates back to MyWorkoutPlan when exiting the workout', async () => {
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

    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(), { wrapper: readyWrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    await act(async () => {
      await result.current.logic.onExit();
    });

    expect(mockCacheDeleteKey).toHaveBeenCalledWith(keyStartWorkout('user-1'));
    expect(mockReplace).toHaveBeenCalledWith('MyWorkoutPlan');
  });

  it('stays safe while auth is still hydrating and user is still null on the first render', async () => {
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

    const { result } = renderHook(() => useIntegratedStartWorkoutPageLogic(), { wrapper: baseWrapper });

    expect(result.current.auth.user).toBeNull();
    expect(result.current.logic.data.exercisesForSelectedSplit).toEqual([]);
    expect(result.current.logic.data.totalSets).toBe(0);
    expect(result.current.logic.data.setsDone).toBe(0);
    expect(result.current.logic.workoutProgressObj).toEqual({});
    expect(result.current.auth.isWorkoutMode).toBe(true);

    userDeferred.resolve(userWithWorkoutAndHistoryProfile.user);
    workoutDeferred.resolve({
      workoutPlan: userWithWorkoutAndHistoryProfile.workout,
      workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
    });
    trackingDeferred.resolve(createPackedTrackingResponse());

    await waitFor(() => {
      expect(result.current.logic.data.totalSets).toBe(3);
    });
  });
});


