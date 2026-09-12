import type { ListCrewParticipantsParams } from '@strong-together/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { getCrewParticipants } from '../services/crews.service';
import { CrewParticipants } from '../types/crews.types';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Loads the active participants of one crew with cursor-based pagination.
 *
 * The query runs only after authentication is validated and a crew ID is
 * available. All fetched pages are flattened for direct use by an infinite
 * list while TanStack Query retains the individual pages in its cache.
 *
 * @param crewId - Identifier of the crew whose participants should be loaded.
 * @param limit - Maximum number of participants requested per page. Defaults to 20.
 * @returns Crew participants, pagination/loading state, and query actions.
 */
export const useCrewParticipants = (crewId: ListCrewParticipantsParams['crewId'] | undefined, limit = DEFAULT_PAGE_SIZE) => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryKey = ['social', 'crews', crewId, 'participants', userId, limit];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      if (!crewId) throw new Error('Crew ID is required');
      return getCrewParticipants(crewId, { limit, cursor: pageParam });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(isValidatedWithServer && userId && crewId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const participants: CrewParticipants = query.data?.pages.flatMap((page) => page.participants) ?? [];

  return {
    data: { participants },
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isFetchingNextPage: query.isFetchingNextPage,
    },
    pagination: { hasNextPage: query.hasNextPage },
    actions: { fetchNextPage: query.fetchNextPage, refetch: query.refetch },
  };
};
