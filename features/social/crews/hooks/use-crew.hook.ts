import type { CreateCrewBody } from '@strong-together/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { createCrew } from '../services/crews.service';

/**
 * Provides the authenticated crew-creation mutation.
 *
 * After a crew is created, the hook invalidates discoverable-crew queries so
 * active crew lists refresh with the latest server state.
 *
 * @returns Crew mutation loading state and the asynchronous create action.
 */
export const useCrew = () => {
  const { userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();

  const createCrewMutation = useMutation({
    mutationFn: (body: CreateCrewBody) => {
      if (!userId) throw new Error('User is not authenticated');
      return createCrew(body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social', 'crews', 'discoverable'] }),
  });

  return {
    loadingStates: { isCreating: createCrewMutation.isPending },
    actions: { createCrew: createCrewMutation.mutateAsync },
  };
};
