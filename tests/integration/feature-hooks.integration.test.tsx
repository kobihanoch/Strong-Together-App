import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React, { type PropsWithChildren } from 'react';
import api from '../../infrastructure/api/api-config/api';
import { useLogin } from '../../features/auth/hooks/use-login.hook';
import { AuthProvider, useAuth } from '../../features/auth/providers/AuthProvider';
import useDashboard from '../../features/dashboard/use-dashboard.hook';
import { useMessages } from '../../features/messages/hooks/use-messages.hook';
import { useWorkoutPlan } from '../../features/workouts/plan/hooks/use-workout-plan.hook';

// The HTTP adapter is the only application dependency replaced here. Everything
// between the provider, feature hooks, TanStack cache, and derived state is real.
jest.mock('../../infrastructure/api/api-config/api', () => ({
  __esModule: true,
  default: { defaults: { headers: { common: {} } }, get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('../../infrastructure/socket', () => ({ disconnectSocket: jest.fn() }));

const mockedApi = api as jest.Mocked<typeof api>;

const workoutPlan = {
  id: 7,
  numberOfSplits: 1,
  workoutSplits: [{ id: 11, name: 'Push', exercises: [] }],
};
const messages = [
  { id: 'unread', subject: 'Coach', msg: 'Train today', sentAt: '2026-09-07T08:00:00.000Z', isRead: false },
  { id: 'read', subject: 'Coach', msg: 'Good work', sentAt: '2026-09-06T08:00:00.000Z', isRead: true },
];

describe('core feature-hook integration', () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<PropsWithChildren>;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } } });
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
    mockedApi.post.mockImplementation(async (url) => {
      if (url === '/api/auth/login') return { data: { accessToken: 'access', refreshToken: 'refresh', user: 'user-1' } } as never;
      return { data: undefined } as never;
    });
    mockedApi.get.mockImplementation(async (url) => {
      if (url === '/api/workout-plan') return { data: { workoutPlan } } as never;
      if (url === '/api/messages') return { data: { messages } } as never;
      if (url === '/api/workout-statistics') return { data: { workoutCount: 4, currentStreak: 2 } } as never;
      return { data: {} } as never;
    });
  });

  afterEach(() => queryClient.clear());

  /**
   * Core path: a successful login must unlock authenticated queries. This checks
   * the real AuthProvider transition and three feature hooks sharing one cache.
   */
  it('authenticates once and loads the plan, messages, and dashboard through feature hooks', async () => {
    const { result } = renderHook(
      () => ({ auth: useAuth(), login: useLogin(), plan: useWorkoutPlan(), messages: useMessages(), dashboard: useDashboard() }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.auth.authPhase).toBe('guest'));
    await act(async () => result.current.login.actions.login({ identifier: 'athlete', password: 'secret' }));

    await waitFor(() => expect(result.current.plan.data.hasWorkoutPlan).toBe(true));
    await waitFor(() => expect(result.current.messages.data.allReceivedMessages).toHaveLength(2));
    await waitFor(() => expect(result.current.dashboard.data).toEqual({ workoutCount: 4, currentStreak: 2 }));
    expect(result.current.auth).toMatchObject({ authPhase: 'authed', userIdCache: 'user-1', isValidatedWithServer: true });
    expect(result.current.messages.data.unreadMessages.map((message) => message.id)).toEqual(['unread']);
  });

  /**
   * Core path: message mutations must update the shared cache only after the
   * server accepts them; consumers should immediately see read/delete results.
   */
  it('keeps message mutations and derived unread state consistent', async () => {
    const { result } = renderHook(() => ({ auth: useAuth(), login: useLogin(), messages: useMessages() }), { wrapper });
    await waitFor(() => expect(result.current.auth.authPhase).toBe('guest'));
    await act(async () => result.current.login.actions.login({ identifier: 'athlete', password: 'secret' }));
    await waitFor(() => expect(result.current.messages.data.allReceivedMessages).toHaveLength(2));

    await act(async () => result.current.messages.actions.updateMessageToRead('unread'));
    expect(mockedApi.patch).toHaveBeenCalledWith('/api/messages/unread/read');
    await waitFor(() => expect(result.current.messages.data.unreadMessages).toEqual([]));

    await act(async () => result.current.messages.actions.deleteMessage('read'));
    expect(mockedApi.delete).toHaveBeenCalledWith('/api/messages/read');
    await waitFor(() => expect(result.current.messages.data.allReceivedMessages.map((message) => message.id)).toEqual(['unread']));
  });

  /**
   * Core path: saving a changed plan must hit the API contract and invalidate
   * the exact authenticated plan query so all hook consumers refetch it.
   */
  it('updates a workout plan and refreshes its authenticated cache', async () => {
    const { result } = renderHook(() => ({ auth: useAuth(), login: useLogin(), plan: useWorkoutPlan() }), { wrapper });
    await waitFor(() => expect(result.current.auth.authPhase).toBe('guest'));
    await act(async () => result.current.login.actions.login({ identifier: 'athlete', password: 'secret' }));
    await waitFor(() => expect(result.current.plan.data.hasWorkoutPlan).toBe(true));

    await act(async () => result.current.plan.actions.updateWorkoutPlan([{ name: 'Pull', exercises: [] }] as never));

    expect(mockedApi.put).toHaveBeenCalledWith('/api/workout-plan', expect.objectContaining({ workoutData: [{ name: 'Pull', exercises: [] }] }));
    await waitFor(() => expect(mockedApi.get.mock.calls.filter(([url]) => url === '/api/workout-plan')).toHaveLength(2));
  });
});
