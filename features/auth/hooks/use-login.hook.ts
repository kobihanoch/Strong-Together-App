import { LoginRequestBody } from '@strong-together/shared';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../auth/providers/AuthProvider';
import { loginUser } from '../services/login.service';

/**
 * Provides the authenticated user's persisted messages server state.
 *
 * The query revalidates after server authentication, mutations synchronize
 * server changes with the shared cache, and the local updater allows live
 * WebSocket messages to update that same cache.
 *
 * @returns Message data, derived unread messages, loading states, and cache-aware actions.
 */
export const useLogin = () => {
  const { completeAuthSession } = useAuth();

  const login = useMutation({
    mutationFn: async (payload: LoginRequestBody) => await loginUser(payload.identifier, payload.password),
    onSuccess: async (data) => {
      await completeAuthSession(data.accessToken, data.refreshToken, data.user);
    },
  });

  return {
    loadingStates: {
      isPending: login.isPending,
    },
    actions: {
      login: login.mutateAsync,
    },
  };
};
