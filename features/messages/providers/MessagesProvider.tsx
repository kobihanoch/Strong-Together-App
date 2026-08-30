import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { keyInbox } from '../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { registerToMessagesListener } from '../messages.listeners';
import { getUserMessages } from '../services/messages.service';
import { MessagesProviderValue, UserMessages } from '../types/messages.types';
import { filterMessagesByUnread } from '../utils/messages-context-utils';

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

  const {
    data: allReceivedMessages,
    updateAndCache: setAllReceivedMessages,
    loading: loadingMessages,
  } = useCacheAndFetch<UserMessages>(cacheKey, isValidatedWithServer, fetchFn, 'Messages Context');

  const unreadMessages = useMemo(() => filterMessagesByUnread(allReceivedMessages), [allReceivedMessages]);

  // Report inbox loading to global loading
  useUpdateGlobalLoading('Messages', loadingMessages);

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(setAllReceivedMessages, allReceivedMessages);
      return cleanup;
    }
    return;
  }, [setAllReceivedMessages, user, allReceivedMessages]);

  const value = useMemo<MessagesProviderValue>(
    () => ({
      unreadMessages: unreadMessages ?? [],
      allReceivedMessages: allReceivedMessages ?? [],
      setAllReceivedMessages,
      loadingMessages,
    }),
    [unreadMessages, allReceivedMessages, setAllReceivedMessages, loadingMessages],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
