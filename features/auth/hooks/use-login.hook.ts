import { LoginRequestBody } from '@strong-together/shared';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../auth/providers/AuthProvider';
import { loginUser } from '../services/login.service';

/**
 * Runs credential login and completes the shared authentication session only
 * after the server returns a valid access-token, refresh-token, and user tuple.
 *
 * @returns Pending state and an async `login` action that rejects with the service error.
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
