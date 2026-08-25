/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockUseCacheAndFetch = jest.fn<(...args: any[]) => { loading: boolean }>();
const mockUseUpdateGlobalLoading = jest.fn();
const mockGetUserWorkout = jest.fn<() => Promise<any>>();
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

jest.mock('../../../../auth/shared/providers/AuthProvider', () => ({ useAuth: () => mockAuthState }));
jest.mock('../../../../../shared/hooks/use-cache-and-fetch.hook', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseCacheAndFetch(...args),
}));
jest.mock('../../../../../shared/hooks/use-update-global-loading.hook', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseUpdateGlobalLoading(...args),
}));
jest.mock('../../../plan/services/workout-plan.service', () => ({ getUserWorkout: () => mockGetUserWorkout() }));

import { WorkoutPlanProvider, useWorkoutPlanContext } from '../WorkoutPlanProvider';

const user = { id: 'user-1' };
const workout = {
  id: 7,
  numberOfSplits: 2,
  createdAt: '2026-03-20T08:00:00.000Z',
  userId: '00000000-0000-4000-8000-000000000001',
  isActive: true,
  updatedAt: '2026-03-26T08:00:00.000Z',
  workoutSplits: [
    {
      id: 11, workoutId: 7, name: 'A', orderIndex: 0, createdAt: '2026-03-20T08:00:00.000Z',
      muscleGroup: 'Chest', isActive: true,
      exercises: [{
        exerciseToSplitId: 20, exerciseId: 1, name: 'Bench Press',
        sets: [{ orderIndex: 0, reps: 10 }, { orderIndex: 1, reps: 8 }],
        orderIndex: 0, isActive: true, targetMuscle: 'Chest', specificTargetMuscle: 'Pectoralis major',
      }],
    },
    {
      id: 12, workoutId: 7, name: 'B', orderIndex: 1, createdAt: '2026-03-20T08:00:00.000Z',
      muscleGroup: 'Back', isActive: true, exercises: [],
    },
  ],
};

const wrapper = ({ children }: { children: React.ReactNode }) => <WorkoutPlanProvider>{children}</WorkoutPlanProvider>;

const hydrateWith = (workoutPlan: any) => {
  let hydrated = false;
  mockUseCacheAndFetch.mockImplementation(
    (_user: unknown, _key: unknown, _validated: boolean, _fetch: unknown, onData: (data: any) => void) => {
      if (!hydrated) {
        hydrated = true;
        onData({ workoutPlan });
      }
      return { loading: false };
    },
  );
};

describe('WorkoutPlanProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState = { user: null, isValidatedWithServer: false };
    mockUseCacheAndFetch.mockReturnValue({ loading: false });
    mockGetUserWorkout.mockResolvedValue({ workoutPlan: null });
  });

  it('exposes an empty plan while no plan has hydrated', () => {
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });
    expect(result.current.workout).toBeNull();
    expect(result.current.workoutSplits).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('hydrates a null workout and caches the new response shape', async () => {
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(null);
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => expect(result.current.workout).toBeNull());
    expect(result.current.workoutSplits).toEqual([]);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      user, expect.any(Function), true, expect.any(Function), expect.any(Function),
      { workoutPlan: null }, 'Workout Context',
    );
  });

  it('exposes full nested splits without deriving a second exercise map', async () => {
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(workout);
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });

    await waitFor(() => expect(result.current.workout).toEqual(workout));
    expect(result.current.workoutSplits).toEqual(workout.workoutSplits);
    expect(result.current.workoutSplits[0].exercises[0].name).toBe('Bench Press');
    expect(result.current.workoutSplits[0].exercises[0].sets).toHaveLength(2);
  });

  it('updates derived splits when setWorkout changes the plan', async () => {
    mockAuthState = { user, isValidatedWithServer: true };
    hydrateWith(workout);
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });
    await waitFor(() => expect(result.current.workout).toEqual(workout));

    act(() => result.current.setWorkout(null));
    expect(result.current.workout).toBeNull();
    expect(result.current.workoutSplits).toEqual([]);
  });

  it('reports its loading state globally', () => {
    mockUseCacheAndFetch.mockReturnValue({ loading: true });
    const { result } = renderHook(() => useWorkoutPlanContext(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(mockUseUpdateGlobalLoading).toHaveBeenLastCalledWith('WorkoutPlan', true);
  });
});
