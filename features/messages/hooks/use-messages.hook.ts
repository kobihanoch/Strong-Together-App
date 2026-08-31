import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { deleteMessage, getUserMessages, updateMsgReadStatus } from '../services/messages.service';
import { UserMessage, UserMessages } from '../types/messages.types';
import { filterMessagesByUnread } from '../utils/messages-context-utils';

type MessagesUpdater = UserMessages | undefined | ((previous: UserMessages | undefined) => UserMessages | undefined);

/**
 * Provides the authenticated user's persisted messages server state.
 *
 * The query revalidates after server authentication, mutations synchronize
 * server changes with the shared cache, and the local updater allows live
 * WebSocket messages to update that same cache.
 *
 * @returns Message data, derived unread messages, loading states, and cache-aware actions.
 */
export const useMessages = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['messages', userId];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<UserMessages> => (await getUserMessages()).messages,
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const updateMessageToReadMutation = useMutation({
    mutationFn: async (messageId: UserMessage['id']): Promise<void> => {
      if (!userId) throw new Error('User is not authenticated');
      await updateMsgReadStatus(messageId);
    },
    onSuccess: (_, messageId) => {
      queryClient.setQueryData<UserMessages>(queryKey, (previous) =>
        previous?.map((message) => (message.id === messageId ? { ...message, isRead: true } : message)),
      );
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: UserMessage['id']): Promise<void> => {
      if (!userId) throw new Error('User is not authenticated');
      await deleteMessage(messageId);
    },
    onSuccess: (_, messageId) => {
      queryClient.setQueryData<UserMessages>(queryKey, (previous) =>
        previous?.filter((message) => message.id !== messageId),
      );
    },
  });

  const updateLocalMessages = useCallback(
    (updater: MessagesUpdater) => {
      if (userId) queryClient.setQueryData<UserMessages | undefined>(queryKey, updater);
    },
    [queryClient, userId],
  );

  const allReceivedMessages = query.data ?? [];
  const unreadMessages = useMemo(() => filterMessagesByUnread(allReceivedMessages) ?? [], [allReceivedMessages]);

  return {
    data: { allReceivedMessages, unreadMessages },
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isUpdating: updateMessageToReadMutation.isPending || deleteMessageMutation.isPending,
    },
    actions: {
      updateMessageToRead: updateMessageToReadMutation.mutateAsync,
      deleteMessage: deleteMessageMutation.mutateAsync,
      updateLocalMessages,
      refetch: query.refetch,
    },
  };
};
