import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { useMessages as useMessagesQuery } from '../hooks/use-messages.hook';
import { registerToMessagesListener } from '../messages.listeners';
import { UserMessage, UserMessages } from '../types/messages.types';

interface MessagesProviderValue {
  unreadMessages: UserMessages;
  allReceivedMessages: UserMessages;
  updateMessageToRead: (msgId: UserMessage['id']) => Promise<void>;
  deleteMessage: (msgId: UserMessage['id']) => Promise<void>;
  fetchLoading: boolean;
  isFetching: boolean;
  updateLoading: boolean;
}

const MessagesContext = createContext<MessagesProviderValue | null>(null);

export const useMessagesContext = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessagesContext must be used within a MessagesProvider');
  }
  return context;
};

// Backwards-compatible context consumer. TanStack state lives in the feature hook.
export const useMessages = useMessagesContext;

/**
 * Provides authenticated message state to the application. It hydrates the
 * It exposes TanStack-backed message state and owns the single app-wide
 * listener for newly received WebSocket messages.
 *
 * @param children Components that consume the shared message state.
 * @returns A context provider containing messages, unread messages, loading
 * state, and a setter that updates both context state and the local cache.
 */
export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const { userIdCache: userId } = useAuth();
  const {
    data: { allReceivedMessages, unreadMessages },
    loadingStates: { isLoading: fetchLoading, isFetching, isUpdating: updateLoading },
    actions: { updateMessageToRead, deleteMessage, updateLocalMessages },
  } = useMessagesQuery();

  // Load listener
  useEffect(() => {
    if (userId) {
      const cleanup = registerToMessagesListener(updateLocalMessages);
      return cleanup;
    }
    return;
  }, [updateLocalMessages, userId]);

  const value = useMemo<MessagesProviderValue>(
    () => ({
      unreadMessages: unreadMessages ?? [],
      allReceivedMessages: allReceivedMessages ?? [],
      updateMessageToRead,
      deleteMessage,
      fetchLoading,
      isFetching,
      updateLoading,
    }),
    [unreadMessages, allReceivedMessages, updateMessageToRead, deleteMessage, fetchLoading, isFetching, updateLoading],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
