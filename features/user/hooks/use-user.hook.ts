import { UpdateCurrentUserBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/providers/AuthProvider';
import { fetchSelfUserData, updateSelfUser } from '../services/user.service';
import { AppUser } from '../types/user.types';

type ModifiedUser = UpdateCurrentUserBody;

/**
 * Provides the authenticated user's persisted profile server state.
 *
 * Cached profile data remains available while the session is restored, and
 * server fetching is enabled only after token validation succeeds. Profile
 * mutations update the shared TanStack cache with the server response.
 *
 * @returns User data, loading states, and cache-aware profile actions.
 */
export const useUser = () => {
  const { userIdCache: userId, isValidatedWithServer } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['user', userId];

  const query = useQuery({
    queryKey,

    queryFn: async (): Promise<AppUser> => await fetchSelfUserData(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const updateSourceUser = useMutation({
    mutationFn: async (updatedUser: ModifiedUser): Promise<void> => {
      if (!userId) throw new Error('User is not authenticated');
      await updateSelfUser(updatedUser);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data: query.data,
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    },
    actions: {
      updateUser: updateSourceUser.mutateAsync,
      refetch: query.refetch,
    },
  };
};
