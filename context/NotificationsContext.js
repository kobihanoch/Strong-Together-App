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
import {
  getUserMessages,
  updateMsgReadStatus,
} from "../services/MessagesService.js";
import {
  cacheProfileImagesAndGetMap,
  filterMessagesByUnread,
} from "../utils/notificationsContextUtils.js";
import { registerToMessagesListener } from "../webSockets/socketListeners";
import { useAuth } from "./AuthContext.js";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext.js";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading.js";

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

  /// All senders
  const [allSendersUsersArr, setAllSendersUsersArr] = useState([]);

  // ALl profile images
  const [profileImagesCache, setProfileImagesCache] = useState({});

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserMessages(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    setAllReceivedMessages(data?.messages);
    setAllSendersUsersArr(data?.senders);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({ messages: allReceivedMessages, senders: allSendersUsersArr }),
    [allReceivedMessages, allSendersUsersArr]
  );

  // Hook usage
  const { loading: loadingMessages } = useCacheAndFetch(
    user, // user prop
    keyInbox, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Notifications Context" // log
  );

  // Report inbox loading to global loading
  useUpdateGlobalLoading("Notifications", loadingMessages);

  // Load listener
  useEffect(() => {
    if (user) {
      const cleanup = registerToMessagesListener(
        setAllReceivedMessages,
        setAllSendersUsersArr
      );
      return cleanup;
    }
  }, [user]);

  // Prefetch images and return mapping of profile images when senders updated
  useEffect(() => {
    (async () => {
      const map = await cacheProfileImagesAndGetMap(allSendersUsersArr);
      setProfileImagesCache(map);
    })();
  }, [allSendersUsersArr]);

  const markAsRead = useCallback(async (msgId) => {
    await updateMsgReadStatus(msgId);
    // Update state
    setAllReceivedMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m))
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        unreadMessages,
        allReceivedMessages,
        setAllReceivedMessages,
        loadingMessages,
        profileImagesCache,
        allSendersUsersArr,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
