import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { keyInbox } from "../cache/cacheUtils.js";
import useCacheAndFetch from "../hooks/useCacheAndFetch.js";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading.js";
import { getUserMessages } from "../services/MessagesService.js";
import { filterMessagesByUnread } from "../utils/notificationsContextUtils.js";
import { registerToMessagesListener } from "../webSockets/socketListeners";
import { useAuth } from "./AuthContext.js";

/**
 * Notifications Flow:
 * 1. On mount (if user exists) → fetch messages + senders in one API call.
 * 2. Store messages in allReceivedMessages, senders in allSendersUsersArr.
 * 3. Derive unreadMessages via useMemo(filterMessagesByUnread).
 * 4. Prefetch profile images on senders change → build profileImagesCache.
 * 5. Listen to "new_message" socket events → append message/sender if new.
 * 6. markAsRead → API call + local state update.
 * 7. On logout → clear all state.
 */

export const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { user, isValidatedWithServer } = useAuth();

  // All user's received messages
  const [allReceivedMessages, setAllReceivedMessages] = useState([]);

  // Filter messages to read/unread => Everytime all messages is updated (when receiving a new message), filter is executed
  const unreadMessages = useMemo(() => {
    return filterMessagesByUnread(allReceivedMessages);
  }, [allReceivedMessages]);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserMessages(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    setAllReceivedMessages(data?.messages);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({ messages: allReceivedMessages }),
    [allReceivedMessages]
  );

  // Hook usage
  const { loading: loadingMessages, cacheKnown } = useCacheAndFetch(
    user, // user prop
    keyInbox, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Notifications Context" // log
  );

  // Report inbox loading to global loading
  useUpdateGlobalLoading("Notifications", cacheKnown ? loadingMessages : true);

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(setAllReceivedMessages);
      return cleanup;
    }
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{
        unreadMessages,
        allReceivedMessages,
        setAllReceivedMessages,
        loadingMessages,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
