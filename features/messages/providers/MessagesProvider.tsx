import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { keyInbox } from '../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { registerToMessagesListener } from '../messages.listeners';
import { getUserMessages, updateMsgReadStatus } from '../services/messages.service';
import { UserMessage, UserMessages } from '../types/messages.types';
import { filterMessagesByUnread } from '../utils/messages-context-utils';

interface MessagesProviderValue {
  unreadMessages: UserMessages;
  allReceivedMessages: UserMessages;
  updateMessageToRead: (msgId: UserMessage['id']) => Promise<void>;
  fetchLoading: boolean;
  updateLoading: boolean;
}

const MessagesContext = createContext<MessagesProviderValue | null>(null);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

/**
 * Provides authenticated message state to the application. It hydrates the
 * user's messages from cache, revalidates them after server authentication,
 * persists local message updates, derives the unread collection, and owns the
 * single app-wide listener for newly received messages.
 *
 * @param children Components that consume the shared message state.
 * @returns A context provider containing messages, unread messages, loading
 * state, and a setter that updates both context state and the local cache.
 */
export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();
  const fetchFn = useCallback(async () => (await getUserMessages()).messages, []);
  const cacheKey = useMemo(() => (user?.id ? keyInbox(user.id) : null), [user?.id]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const {
    data: allReceivedMessages,
    updateAndCache,
    loading: fetchLoading,
  } = useCacheAndFetch<UserMessages>(cacheKey, isValidatedWithServer, fetchFn, 'Messages Context');

  const unreadMessages = useMemo(() => filterMessagesByUnread(allReceivedMessages), [allReceivedMessages]);

  const updateMessageToRead = useCallback(
    async (msgId: UserMessage['id']) => {
      setUpdateLoading(true);

      try {
        await updateMsgReadStatus(msgId);
        await updateAndCache((prev) =>
          prev ? prev.map((m: UserMessages[number]) => (m.id === msgId ? { ...m, isRead: true } : m)) : prev,
        );
      } finally {
        setUpdateLoading(false);
      }
    },
    [updateAndCache],
  );

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(updateAndCache);
      return cleanup;
    }
    return;
  }, [updateAndCache, user]);

  const value = useMemo<MessagesProviderValue>(
    () => ({
      unreadMessages: unreadMessages ?? [],
      allReceivedMessages: allReceivedMessages ?? [],
      updateMessageToRead,
      fetchLoading,
      updateLoading,
    }),
    [unreadMessages, allReceivedMessages, updateMessageToRead, fetchLoading, updateLoading],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
