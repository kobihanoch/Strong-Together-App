import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/providers/AuthProvider';
import { useMessages as useMessagesQuery } from '../hooks/use-messages.hook';
import { registerToMessagesListener } from '../messages.listeners';
import { UserMessage, UserMessages } from '../types/messages.types';

interface MessagesProviderValue {
  unreadMessages: UserMessages;
  allReceivedMessages: UserMessages;
  updateMessageToRead: (msgId: UserMessage['id']) => Promise<void>;
  deleteMessage: (msgId: UserMessage['id']) => Promise<void>;
  loadingStates: {
    isPending: boolean;
    isFetching: boolean;
    isUpdating: boolean;
    isLoading: boolean;
  };
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
    loadingStates: { isPending, isLoading, isFetching, isUpdating },
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
      loadingStates: {
        isPending,
        isFetching,
        isUpdating,
        isLoading,
      },
    }),
    [unreadMessages, allReceivedMessages, updateMessageToRead, deleteMessage, isPending, isFetching, isUpdating, isLoading],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
