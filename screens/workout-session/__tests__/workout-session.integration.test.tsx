import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React, { type PropsWithChildren } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../../../infrastructure/api/api-config/api';
import { AuthProvider, useAuth } from '../../../features/auth/providers/AuthProvider';
import { useWorkoutSessionStore } from '../../../features/workouts/session/hooks/use-workout-session-store.hook';
import { useWorkoutSession } from '../../../features/workouts/session/hooks/use-workout-session.hook';
import { AppThemeProvider } from '../../../shared/providers/AppThemeProvider';
import useWorkoutSessionScreen from '../hooks/use-workout-session-screen.hook';

// HTTP and navigation are client boundaries; session state, feature hooks,
// validation, normalization, persistence, and query invalidation remain real.
jest.mock('../../../infrastructure/api/api-config/api', () => ({
  __esModule: true,
  default: { defaults: { headers: { common: {} } }, get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../../infrastructure/socket', () => ({ disconnectSocket: jest.fn() }));
jest.mock('../../../shared/hooks/use-toggle-status-bar-color.hook', () => ({ __esModule: true, default: jest.fn() }));

const mockedApi = api as jest.Mocked<typeof api>;
const navigation = { replace: jest.fn() };
const split = {
  id: 11,
  name: 'Push',
  exercises: [
    {
      exerciseId: 1,
      exerciseToSplitId: 101,
      name: 'Bench Press',
      sets: [{ orderIndex: 0, reps: 8 }, { orderIndex: 1, reps: 8 }],
    },
  ],
} as never;

describe('Workout Session core paths and edge cases', () => {
  let wrapper: React.ComponentType<PropsWithChildren>;
  let queryClient: QueryClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    await useWorkoutSessionStore.getState().resetWorkout();
    await SecureStore.setItemAsync('refresh_token', 'refresh');
    await SecureStore.setItemAsync('authenticated_user_id', 'user-1');
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } } });
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider><AppThemeProvider>{children}</AppThemeProvider></AuthProvider>
      </QueryClientProvider>
    );
    mockedApi.post.mockImplementation(async (url) => {
      if (url === '/api/auth/refresh') return { data: { accessToken: 'access', refreshToken: 'rotated', userId: 'user-1' } } as never;
      return { data: undefined } as never;
    });
    mockedApi.get.mockImplementation(async (url) => {
      if (url === '/api/exercise-history') return { data: { byExerciseToSplitId: {} } } as never;
      if (url === '/api/personal-records') return { data: { prs: {} } } as never;
      if (url === '/api/exercises') return { data: { Chest: [{ id: 1, name: 'Bench Press' }] } } as never;
      return { data: {} } as never;
    });
  });

  afterEach(() => queryClient.clear());

  const renderSession = async () => {
    const hook = renderHook(
      () => ({ auth: useAuth(), rawSession: useWorkoutSession(), session: useWorkoutSessionScreen(split, navigation as never) }),
      { wrapper },
    );
    await waitFor(() => expect(hook.result.current.auth.authPhase).toBe('authed'));
    await waitFor(() => expect(hook.result.current.session.data.sets).toHaveLength(2));
    return hook;
  };

  it('allows consecutive sets on an exercise added during the workout', async () => {
    const session = await renderSession();
    const { result } = session;

    act(() => result.current.session.actions.addExercise({ id: 2, name: 'Cable Fly' } as never));
    await waitFor(() => expect(result.current.session.data.isActiveExerciseAdded).toBe(true));
    expect(result.current.session.data.sets).toHaveLength(1);
    expect(result.current.session.data.canAddExtraSet).toBe(false);

    act(() => result.current.session.actions.updateWeight(20));
    act(() => result.current.session.actions.updateReps(12));
    await waitFor(() => expect(result.current.session.data.canCompleteActiveSet).toBe(true));
    await act(async () => {
      result.current.session.actions.completeSet();
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.session.data.canAddExtraSet).toBe(true));

    act(() => result.current.session.actions.addSet());
    await waitFor(() => expect(result.current.session.data.sets).toHaveLength(2));
    expect(result.current.session.data.setIndex).toBe(1);
    expect(result.current.session.data.canAddExtraSet).toBe(false);

    act(() => result.current.session.actions.updateWeight(20));
    act(() => result.current.session.actions.updateReps(10));
    await act(async () => {
      result.current.session.actions.completeSet();
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.session.data.canAddExtraSet).toBe(true));

    act(() => result.current.session.actions.addSet());
    await waitFor(() => expect(result.current.session.data.sets).toHaveLength(3));
    session.unmount();
  });

  /**
   * Edge case: invalid metrics cannot be completed. Negative edits are clamped,
   * and repeated completion cannot duplicate progress or advance past bounds.
   */
  it('guards set input and preserves a failed draft before normalized retry submission', async () => {
    const session = await renderSession();
    const { result } = session;
    expect(result.current.session.data.canCompleteActiveSet).toBe(false);

    act(() => result.current.session.actions.updateWeight(-20));
    expect(result.current.session.data.activeSet?.weight).toBe(0);
    await act(async () => {
      result.current.session.actions.completeSet();
      await Promise.resolve();
    });
    expect(result.current.session.data.completedCount).toBe(0);

    act(() => result.current.session.actions.updateWeight(80));
    await waitFor(() => expect(result.current.session.data.activeSet?.weight).toBe(80));
    act(() => result.current.session.actions.updateReps(8));
    await waitFor(() => expect(result.current.session.data.canCompleteActiveSet).toBe(true));
    await act(async () => {
      result.current.session.actions.completeSet();
      await Promise.resolve();
    });
    expect(result.current.session.data.completedSetKeys).toEqual(['101:0']);
    expect(result.current.session.data.setIndex).toBe(1);

    act(() => result.current.session.actions.selectSet(0));
    act(() => result.current.session.actions.completeSet());
    expect(result.current.session.data.completedSetKeys).toEqual(['101:0']);

    mockedApi.post.mockRejectedValueOnce(new Error('offline'));
    await act(async () => { await expect(result.current.rawSession.actions.saveWorkout()).rejects.toThrow('offline'); });
    expect(useWorkoutSessionStore.getState().draft).not.toBeNull();

    mockedApi.post.mockResolvedValueOnce({ data: undefined } as never);
    await act(async () => {
      await result.current.rawSession.actions.saveWorkout();
    });

    const submission = mockedApi.post.mock.calls.find(([url]) => url === '/api/workout-sessions')?.[1] as any;
    expect(submission.workout).toEqual([expect.objectContaining({ trackedSets: [{ setIndex: 0, weight: 80, reps: 8 }] })]);
    expect(useWorkoutSessionStore.getState().draft).toBeNull();
    session.unmount();
  });

});
