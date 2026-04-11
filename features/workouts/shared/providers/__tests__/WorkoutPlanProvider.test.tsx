/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  guestProfile,
  userWithWorkoutAndHistoryProfile,
  userWithWorkoutNoHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../../../../tests/fixtures/userProfiles';

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

type UseCacheAndFetchReturn = { loading: boolean; cacheKnown: boolean };
type UseCacheAndFetchMockFn = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => UseCacheAndFetchReturn;

const mockAuthState = jest.fn<
  () => {
    user: typeof userWithoutWorkoutProfile.user;
    isValidatedWithServer: boolean;
  }
>();
const mockUseCacheAndFetch = jest.fn<UseCacheAndFetchMockFn>();
const mockUseUpdateGlobalLoading = jest.fn<(key: string, value: boolean) => void>();
const mockGetUserWorkout = jest.fn<() => Promise<any>>();

const useCacheAndFetchMock = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => mockUseCacheAndFetch(user, keyBuilderFn, isValidatedByServerFlag, fetchFn, onDataFn, cachedPayload, logLabel);

const useUpdateGlobalLoadingMock = (key: string, value: boolean) => mockUseUpdateGlobalLoading(key, value);
const getUserWorkoutMock = () => mockGetUserWorkout();

jest.mock('../../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState(),
}));

jest.mock('../../../../../hooks/use-cache-and-fetch.hook', () => ({
  __esModule: true,
  default: useCacheAndFetchMock,
}));

jest.mock('../../../../../hooks/use-update-global-loading.hook', () => ({
  __esModule: true,
  default: useUpdateGlobalLoadingMock,
}));

jest.mock('../../../plan/services/workout-plan.service', () => ({
  getUserWorkout: getUserWorkoutMock,
}));

import { WorkoutPlanProvider, useWorkoutPlanContext } from '../WorkoutPlanProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WorkoutPlanProvider>{children}</WorkoutPlanProvider>
);

const createHydratingUseCacheAndFetchMock = (payload: {
  workoutPlan: typeof userWithWorkoutNoHistoryProfile.workout;
  workoutPlanForEditWorkout: typeof userWithWorkoutNoHistoryProfile.workoutForEdit;
}) => {
  let hydrated = false;
  return (
    user: unknown,
    keyBuilderFn: unknown,
    isValidated: boolean,
    fetchFn: unknown,
    onDataFn: (data: any) => void,
    cachedPayload: unknown,
    label: string,
  ) => {
    if (!hydrated) {
      hydrated = true;
      onDataFn(payload);
    }
    return {
      loading: false,
      cacheKnown: true,
    };
  };
};

describe('WorkoutPlanContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState.mockReturnValue({
      user: guestProfile.user,
      isValidatedWithServer: false,
    });
    mockUseCacheAndFetch.mockReturnValue({
      loading: false,
      cacheKnown: true,
    });
    mockGetUserWorkout.mockResolvedValue({
      workoutPlan: null,
      workoutPlanForEditWorkout: null,
    });
  });

  it('keeps all workout state empty for the guest profile', () => {
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    expect(result.current.workout).toBe(guestProfile.workout);
    expect(result.current.workoutForEdit).toBe(guestProfile.workoutForEdit);
    expect(result.current.workoutSplits).toEqual([]);
    expect(result.current.exercises).toEqual({});
    expect(result.current.loading).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      guestProfile.user,
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      {
        workoutPlan: null,
        workoutPlanForEditWorkout: null,
      },
      'Workout Context',
    );
  });

  it('keeps workout state null for a signed-in user with no workout plan', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        workoutPlan: userWithoutWorkoutProfile.workout,
        workoutPlanForEditWorkout: userWithoutWorkoutProfile.workoutForEdit,
      }),
    );

    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.workout).toBeNull();
    });

    expect(result.current.workoutForEdit).toBeNull();
    expect(result.current.workoutSplits).toEqual([]);
    expect(result.current.exercises).toEqual({});
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      userWithoutWorkoutProfile.user,
      expect.any(Function),
      true,
      expect.any(Function),
      expect.any(Function),
      {
        workoutPlan: null,
        workoutPlanForEditWorkout: null,
      },
      'Workout Context',
    );
  });

  it('hydrates workout and derived split state for a user with a workout but no history', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutNoHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        workoutPlan: userWithWorkoutNoHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutNoHistoryProfile.workoutForEdit,
      }),
    );

    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.workout).toEqual(userWithWorkoutNoHistoryProfile.workout);
    });

    expect(result.current.workoutForEdit).toEqual(userWithWorkoutNoHistoryProfile.workoutForEdit);
    expect(result.current.workoutSplits).toEqual([
      {
        name: 'A',
        id: 11,
        muscleGroup: 'Chest(Major)',
      },
      {
        name: 'B',
        id: 12,
        muscleGroup: 'Back(Lats)',
      },
    ]);
    expect(result.current.exercises).toEqual({
      A: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![0].exercisetoworkoutsplit,
      B: userWithWorkoutNoHistoryProfile.workout!.workoutsplits![1].exercisetoworkoutsplit,
    });
  });

  it('keeps the same workout-derived state for a user with workout and history because history belongs elsewhere', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        workoutPlan: userWithWorkoutAndHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutAndHistoryProfile.workoutForEdit,
      }),
    );

    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.workout).toEqual(userWithWorkoutAndHistoryProfile.workout);
    });

    expect(result.current.workoutForEdit).toEqual(userWithWorkoutAndHistoryProfile.workoutForEdit);
    expect(result.current.workoutSplits).toHaveLength(2);
    expect(result.current.exercises.A[0].exercise).toBe('Bench Press');
    expect(result.current.exercises.B[0].exercise).toBe('Lat Pulldown');
  });

  it('allows direct local state updates through the exposed setters after initial hydration', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutNoHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        workoutPlan: userWithWorkoutNoHistoryProfile.workout,
        workoutPlanForEditWorkout: userWithWorkoutNoHistoryProfile.workoutForEdit,
      }),
    );

    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.workout).toEqual(userWithWorkoutNoHistoryProfile.workout);
    });

    await act(async () => {
      result.current.setWorkout(null);
      result.current.setWorkoutForEdit(null);
    });

    expect(result.current.workout).toBeNull();
    expect(result.current.workoutForEdit).toBeNull();
    expect(result.current.workoutSplits).toEqual([]);
    expect(result.current.exercises).toEqual({});
  });
});

