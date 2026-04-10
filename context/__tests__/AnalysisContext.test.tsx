/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import {
  guestProfile,
  userWithWorkoutAndHistoryProfile,
  userWithWorkoutNoHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../tests/fixtures/userProfiles';
import type { GetExerciseTrackingResponse } from '@strong-together/shared';

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
const mockGetUserExerciseTracking = jest.fn<() => Promise<GetExerciseTrackingResponse>>();

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
const getUserExerciseTrackingMock = () => mockGetUserExerciseTracking();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthState(),
}));

jest.mock('../../hooks/useCacheAndFetch', () => ({
  __esModule: true,
  default: useCacheAndFetchMock,
}));

jest.mock('../../hooks/useUpdateGlobalLoading', () => ({
  __esModule: true,
  default: useUpdateGlobalLoadingMock,
}));

jest.mock('../../services/WorkoutService', () => ({
  getUserExerciseTracking: getUserExerciseTrackingMock,
}));

import { AnalysisProvider, useAnalysisContext } from '../AnalysisContext';

const wrapper = ({ children }: { children: React.ReactNode }) => <AnalysisProvider>{children}</AnalysisProvider>;

const createHydratingUseCacheAndFetchMock = (payload: GetExerciseTrackingResponse | any) => {
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

const createPackedTrackingResponse = (): GetExerciseTrackingResponse => ({
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

describe('AnalysisContext', () => {
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
    mockGetUserExerciseTracking.mockResolvedValue(createPackedTrackingResponse());
  });

  it('keeps all analysis state empty for the guest profile', () => {
    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    expect(result.current.exerciseTrackingMaps).toBe(guestProfile.exerciseTrackingMaps);
    expect(result.current.analyzedExerciseTrackingData).toBe(guestProfile.analyzedExerciseTrackingData);
    expect(result.current.hasTrainedToday).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      guestProfile.user,
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      {
        exerciseTrackingMaps: null,
        exerciseTrackingAnalysisUnpacked: null,
      },
      'Analysis Context',
    );
  });

  it('hydrates empty tracking maps and no analyzed data for a signed-in user with no workout and no history', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        exerciseTrackingMaps: userWithoutWorkoutProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithoutWorkoutProfile.analyzedExerciseTrackingData,
      }),
    );

    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.exerciseTrackingMaps).toEqual(userWithoutWorkoutProfile.exerciseTrackingMaps);
    });

    expect(result.current.analyzedExerciseTrackingData).toBeNull();
    expect(result.current.hasTrainedToday).toBe(false);
  });

  it('hydrates empty tracking maps and no analyzed data for a user with workout but no history', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutNoHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        exerciseTrackingMaps: userWithWorkoutNoHistoryProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithWorkoutNoHistoryProfile.analyzedExerciseTrackingData,
      }),
    );

    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.exerciseTrackingMaps).toEqual(userWithWorkoutNoHistoryProfile.exerciseTrackingMaps);
    });

    expect(result.current.analyzedExerciseTrackingData).toBeNull();
    expect(result.current.hasTrainedToday).toBe(false);
  });

  it('hydrates cached unpacked analysis data for a user with workout and history', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        exerciseTrackingMaps: userWithWorkoutAndHistoryProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
      }),
    );

    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.exerciseTrackingMaps).toEqual(userWithWorkoutAndHistoryProfile.exerciseTrackingMaps);
    });

    expect(result.current.analyzedExerciseTrackingData).toEqual(
      userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
    );
    expect(result.current.hasTrainedToday).toBe(false);
  });

  it('unpacks packed API analysis data into the public derived shape', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(createHydratingUseCacheAndFetchMock(createPackedTrackingResponse()));

    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.analyzedExerciseTrackingData).toEqual(
        userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
      );
    });

    expect(result.current.exerciseTrackingMaps).toEqual(userWithWorkoutAndHistoryProfile.exerciseTrackingMaps);
  });

  it('updates hasTrainedToday when analyzed data is set to today through the exposed setter', async () => {
    const today = DateTime.now().setZone('UTC').toISODate()!;
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: 'UTC' }),
        }) as Intl.DateTimeFormat,
    );

    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        exerciseTrackingMaps: userWithWorkoutAndHistoryProfile.exerciseTrackingMaps,
        exerciseTrackingAnalysisUnpacked: userWithWorkoutAndHistoryProfile.analyzedExerciseTrackingData,
      }),
    );

    const { result } = renderHook(() => useAnalysisContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.analyzedExerciseTrackingData).not.toBeNull();
    });

    await act(async () => {
      result.current.setAnalyzedExerciseTrackingData((prev) =>
        prev
          ? {
              ...prev,
              lastWorkoutDate: today,
            }
          : prev,
      );
    });

    expect(result.current.hasTrainedToday).toBe(true);
    jest.restoreAllMocks();
  });
});
