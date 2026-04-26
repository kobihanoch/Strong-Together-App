import { GetAllUserMessagesResponse } from '@strong-together/shared';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { keyInbox } from '../../../infrastructure/cache/cache-keys.utils';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import useUpdateGlobalLoading from '../../../shared/hooks/use-update-global-loading.hook';
import { registerToMessagesListener } from '../messages.listeners';
import { getUserMessages } from '../services/messages.service';
import { UserMessages } from '../types/messages.types';
import { filterMessagesByUnread } from '../utils/messages-context-utils';
import { MessagesProviderCachePayload, MessagesProviderValue } from './types/messages-context.types';

/**
 * Notifications Flow:
 * 1. On mount (if user exists) -> fetch messages + senders in one API call.
 * 2. Store messages in allReceivedMessages, senders in allSendersUsersArr.
 * 3. Derive unreadMessages via useMemo(filterMessagesByUnread).
 * 4. Prefetch profile images on senders change -> build profileImagesCache.
 * 5. Listen to "new_message" socket events -> append message/sender if new.
 * 6. markAsRead -> API call + local state update.
 * 7. On logout -> clear all state.
 */

const MessagesContext = createContext<MessagesProviderValue | null>(null);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isValidatedWithServer } = useAuth();

  // All user's received messages
  const [allReceivedMessages, setAllReceivedMessages] = useState<UserMessages | undefined>(undefined);

  // Filter messages to read/unread => Everytime all messages is updated (when receiving a new message), filter is executed
  const unreadMessages = useMemo((): UserMessages | undefined => {
    return filterMessagesByUnread(allReceivedMessages);
  }, [allReceivedMessages]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserMessages(), []);

  // On data function
  const onDataFn = useCallback((data: GetAllUserMessagesResponse | MessagesProviderCachePayload): void => {
    if (!data) return;
    setAllReceivedMessages(data.messages);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => (allReceivedMessages === undefined ? undefined : { messages: allReceivedMessages }),
    [allReceivedMessages],
  );

  // Hook usage
  const { loading: loadingMessages } = useCacheAndFetch<MessagesProviderCachePayload, GetAllUserMessagesResponse>(
    user, // user prop
    keyInbox, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Messages Context', // log
  );

  // Report inbox loading to global loading
  useUpdateGlobalLoading('Messages', loadingMessages);

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(setAllReceivedMessages);
      return cleanup;
    }
    return;
  }, [user]);

  const value = useMemo<MessagesProviderValue>(
    () => ({
      unreadMessages,
      allReceivedMessages,
      setAllReceivedMessages,
      loadingMessages,
    }),
    [unreadMessages, allReceivedMessages, loadingMessages],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
