/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import type { GetExerciseTrackingResponse } from '@strong-together/shared';

const mockUseCacheAndFetch = jest.fn();
const mockUseUpdateGlobalLoading = jest.fn();
const mockGetUserExerciseTracking = jest.fn();
let mockAuthState: { user: any; isValidatedWithServer: boolean };

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
  default: { expoConfig: { version: 'test-version' } },
}));
jest.mock('../../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));
jest.mock('../../../../../shared/hooks/use-cache-and-fetch.hook', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseCacheAndFetch(...args),
}));
jest.mock('../../../../../shared/hooks/use-update-global-loading.hook', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseUpdateGlobalLoading(...args),
}));
jest.mock('../../../history/services/workout-history.service', () => ({
  getUserExerciseTracking: () => mockGetUserExerciseTracking(),
}));

import { WorkoutHistoryProvider, useWorkoutHistoryContext } from '../WorkoutHistoryProvider';

const user = { id: 'user-1' };

const trackingItem = {
  exerciseTracking: {
    exerciseTrackingId: 9001,
    sets: [{ setIndex: 0, weight: 85, reps: 8 }],
    notes: null,
    exerciseAssignment: {
      exerciseToSplitId: 20,
      orderIndex: 0,
      exerciseId: 1,
      workoutSplitId: 11,
      workoutSplitName: 'A',
      exerciseName: 'Bench Press',
      targetMuscle: 'Chest',
      specificTargetMuscle: 'Pectoralis major',
    },
  },
};

const createTrackingResponse = (...dates: string[]): GetExerciseTrackingResponse => ({
  byDate: Object.fromEntries(dates.map((date) => [date, [trackingItem]])),
  byExerciseToSplitId: dates.length ? { 20: [trackingItem] } : {},
  bySplitName: dates.length ? { A: [trackingItem] } : {},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WorkoutHistoryProvider>{children}</WorkoutHistoryProvider>
);

const hydrateWith = (payload: GetExerciseTrackingResponse) => {
  let hydrated = false;
  mockUseCacheAndFetch.mockImplementation(
    (
      _user: unknown,
      _key: unknown,
      _validated: boolean,
      _fetch: unknown,
      onData: (data: GetExerciseTrackingResponse) => void,
    ) => {
      if (!hydrated) {
        hydrated = true;
        onData(payload);
      }
      return { loading: false };
    },
  );
};

describe('WorkoutHistoryProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockAuthState = { user: null, isValidatedWithServer: false };
    mockUseCacheAndFetch.mockReturnValue({ loading: false });
    mockGetUserExerciseTracking.mockResolvedValue(createTrackingResponse());
  });

  it('exposes empty context state before tracking data hydrates', () => {
    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });

    expect(result.current.exerciseTrackingMaps).toBeNull();
    expect(result.current.hasTrainedToday).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      null,
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      undefined,
      'Analysis Context',
    );
  });

  it('hydrates and caches the maps-only tracking response', async () => {
    const maps = createTrackingResponse('2026-08-20');
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(maps);

    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });

    await waitFor(() => expect(result.current.exerciseTrackingMaps).toEqual(maps));
    expect(result.current.hasTrainedToday).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      user,
      expect.any(Function),
      true,
      expect.any(Function),
      expect.any(Function),
      maps,
      'Analysis Context',
    );
  });

  it('handles an empty tracking response', async () => {
    const maps = createTrackingResponse();
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(maps);

    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });

    await waitFor(() => expect(result.current.exerciseTrackingMaps).toEqual(maps));
    expect(result.current.hasTrainedToday).toBe(false);
  });

  it('uses the latest date regardless of byDate key insertion order', async () => {
    const today = DateTime.now().setZone('UTC').toISODate()!;
    const maps = createTrackingResponse('2026-01-01', today, '2026-04-15');
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: 'UTC' }) }) as Intl.DateTimeFormat,
    );
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(maps);

    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });

    await waitFor(() => expect(result.current.hasTrainedToday).toBe(true));
  });

  it('recomputes hasTrainedToday after a local maps update', async () => {
    const today = DateTime.now().setZone('UTC').toISODate()!;
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: 'UTC' }) }) as Intl.DateTimeFormat,
    );
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(createTrackingResponse('2026-01-01'));

    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });
    await waitFor(() => expect(result.current.exerciseTrackingMaps).not.toBeNull());

    act(() => result.current.setExerciseTrackingMaps(createTrackingResponse(today)));

    expect(result.current.hasTrainedToday).toBe(true);
  });

  it('reports its loading state globally', () => {
    mockUseCacheAndFetch.mockReturnValue({ loading: true });

    const { result } = renderHook(() => useWorkoutHistoryContext(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(mockUseUpdateGlobalLoading).toHaveBeenLastCalledWith('Analysis', true);
  });
});

