import { useMutation } from '@tanstack/react-query';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import { useAuth } from '../../providers/AuthProvider';
import { useAppleAuth } from './use-apple-auth.hook';
import { useGoogleAuth } from './use-google-auth.hook';

/**
 * Provides the authenticated user's persisted messages server state.
 *
 * The query revalidates after server authentication, mutations synchronize
 * server changes with the shared cache, and the local updater allows live
 * WebSocket messages to update that same cache.
 *
 * @returns Message data, derived unread messages, loading states, and cache-aware actions.
 */
export const useOAuth = () => {
  const { completeAuthSession } = useAuth();
  const { signInWithGoogle } = useGoogleAuth();
  const { signInWithApple } = useAppleAuth();

  const googleSignIn = useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: async (data) => {
      await completeAuthSession(data.accessToken, data.refreshToken, data.user);
    },
    onError: (error) => {
      showErrorAlert('Error signing in with Google', error.message);
    },
  });

  const appleSignIn = useMutation({
    mutationFn: signInWithApple,
    onSuccess: async (data) => {
      await completeAuthSession(data.accessToken, data.refreshToken, data.user);
    },
    onError: (error) => {
      showErrorAlert('Error signing in with Apple', error.message);
    },
  });

  return {
    loadingStates: {
      isPending: googleSignIn.isPending || appleSignIn.isPending,
      isGooglePending: googleSignIn.isPending,
      isApplePending: appleSignIn.isPending,
    },
    actions: {
      googleSignIn: googleSignIn.mutateAsync,
      appleSignIn: appleSignIn.mutateAsync,
    },
  };
};
