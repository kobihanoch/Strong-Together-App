import { UpdateUserBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import { updateSelfUser } from '../../../profile/services/user-update.service';
import { fetchSelfUserData } from '../services/auth.service';
import { AppUser } from '../types/auth.types';
import { useAuth } from '../providers/AuthProvider';

type ModifiedUser = UpdateUserBody;

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
    mutationFn: async (updatedUser: ModifiedUser): Promise<AppUser> => {
      if (!userId) throw new Error('User is not authenticated');
      const { user } = await updateSelfUser(updatedUser);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData<AppUser>(queryKey, user);
    },
  });

  const updateLocalUser = (updater: SetStateAction<AppUser | null | undefined>) => {
    if (userId) queryClient.setQueryData<AppUser | null | undefined>(queryKey, updater);
  };

  return {
    data: query.data,
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isUpdating: updateSourceUser.isPending,
    },
    actions: {
      updateUser: updateSourceUser.mutateAsync,
      updateLocalUser,
      refetch: query.refetch,
    },
  };
};
