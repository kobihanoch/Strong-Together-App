import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import useUpdateGlobalLoading from '../../../shared/hooks/use-update-global-loading.hook';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import useMessagesCacheHandler from '../hooks/use-messages-cache-handler.hook';
import { registerToMessagesListener } from '../messages.listeners';
import { MessagesProviderValue } from './types/messages-context.types';

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

  const { allReceivedMessages, setAllReceivedMessages, unreadMessages, loadingMessages } = useMessagesCacheHandler({
    user,
    isValidatedWithServer,
  });

  // Report inbox loading to global loading
  useUpdateGlobalLoading('Messages', loadingMessages);

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(setAllReceivedMessages);
      return cleanup;
    }
    return;
  }, [setAllReceivedMessages, user]);

  const value = useMemo<MessagesProviderValue>(
    () => ({
      unreadMessages: unreadMessages === undefined ? [] : unreadMessages,
      allReceivedMessages: allReceivedMessages === undefined ? [] : allReceivedMessages,
      setAllReceivedMessages,
      loadingMessages,
    }),
    [unreadMessages, allReceivedMessages, setAllReceivedMessages, loadingMessages],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};
