import type { GetAllUserMessagesResponse } from '@strong-together/shared';
import { useCallback, useMemo, useState } from 'react';
import { keyInbox } from '../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../auth/shared/types/auth.types';
import { getUserMessages } from '../services/messages.service';
import { UserMessages } from '../types/messages.types';
import { filterMessagesByUnread } from '../utils/messages-context-utils';

type UseMessagesCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useMessagesCacheHandler = ({ user, isValidatedWithServer }: UseMessagesCacheHandlerProps) => {
  // All user's received messages
  const [allReceivedMessages, setAllReceivedMessages] = useState<UserMessages | undefined>(undefined);

  // Filter messages to read/unread => Everytime all messages is updated (when receiving a new message), filter is executed
  const unreadMessages = useMemo((): UserMessages | undefined => {
    return filterMessagesByUnread(allReceivedMessages);
  }, [allReceivedMessages]);

  // Fetch function
  const fetchFn = useCallback(async () => await getUserMessages(), []);

  // On data function
  const onDataFn = useCallback((data: GetAllUserMessagesResponse): void => {
    setAllReceivedMessages(data.messages);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => (allReceivedMessages === undefined ? undefined : { messages: allReceivedMessages }),
    [allReceivedMessages],
  );

  // Hook usage
  const { loading: loadingMessages } = useCacheAndFetch<GetAllUserMessagesResponse>(
    user, // user prop
    keyInbox, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Messages Context', // log
  );

  return { allReceivedMessages, setAllReceivedMessages, unreadMessages, loadingMessages };
};

export default useMessagesCacheHandler;
