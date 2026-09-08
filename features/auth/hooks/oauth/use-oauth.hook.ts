import { useMutation } from '@tanstack/react-query';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import { useAuth } from '../../providers/AuthProvider';
import { useAppleAuth } from './use-apple-auth.hook';
import { useGoogleAuth } from './use-google-auth.hook';

/**
 * Coordinates Google and Apple sign-in mutations with the shared AuthProvider.
 * Successful provider responses persist the resulting session; provider errors
 * are surfaced through the application's error alert boundary.
 *
 * @returns Combined/per-provider pending states and async actions for each OAuth provider.
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
