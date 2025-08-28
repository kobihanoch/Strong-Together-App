import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cacheGetJSON, keyInbox, TTL_48H } from "../cache/cacheUtils.js";
import useUpdateCache from "../hooks/useUpdateCache.js";
import {
  getUserMessages,
  updateMsgReadStatus,
} from "../services/MessagesService.js";
import { filterMessagesByUnread } from "../utils/notificationsContextUtils.js";
import { cacheProfileImagesAndGetMap } from "../utils/notificationsContextUtils.js";
import { registerToMessagesListener } from "../webSockets/socketListeners";
import { useAuth } from "./AuthContext.js";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext.js";
import useGetCache from "../hooks/useGetCache.js";

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
  // Global loading
  const { setLoading: setGlobalLoading } = useGlobalAppLoadingContext();

  const { user, sessionLoading } = useAuth();

  // Stable cache key (unify 45 days usage)
  const msgKey = useMemo(() => (user ? keyInbox(user.id) : null), [user?.id]);

  // Get cache
  // Triggers on plan key builded
  const { cached, hydrated: cacheHydrated } = useGetCache(msgKey);

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

  // Loading
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Flag for API data hydration to enable cache writing
  // Flag stays true until context is unmounting on logout (guard against initial refrence building)
  const [APIDataHydrated, setAPIDataHydrated] = useState(false);

  // Cache payload
  const cachedPayload = useMemo(() => {
    return {
      messages: allReceivedMessages,
      senders: allSendersUsersArr,
    };
  }, [allReceivedMessages, allSendersUsersArr]);
  useUpdateCache(msgKey, cachedPayload, TTL_48H, APIDataHydrated);

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

  // Load messages on start
  // Load senders on start (same API call)
  useEffect(() => {
    (async () => {
      if (cacheHydrated && user && msgKey) {
        try {
          if (cached) {
            console.log("[Notifications Context]: Cached");
            setAllReceivedMessages(cached.messages);
            setAllSendersUsersArr(cached.senders);
            setLoadingMessages(false);
          } else {
            setLoadingMessages(true);
          }

          // Call API
          const messages = await getUserMessages();
          const { messages: msgs, senders } = messages;
          setAllReceivedMessages(msgs);
          setAllSendersUsersArr(senders);
          setAPIDataHydrated(true);
          // Storage in cache happens alone with dependencies
        } finally {
          setLoadingMessages(false);
        }
      }
    })();

    return logoutCleanup;
  }, [cacheHydrated, user, msgKey]);

  useEffect(() => {
    setGlobalLoading("notifications", loadingMessages);
    return () => setGlobalLoading("notifications", false);
  }, [loadingMessages]);

  const logoutCleanup = useCallback(() => {
    setAllReceivedMessages([]);
    setAllSendersUsersArr([]);
    setProfileImagesCache({});
    setLoadingMessages(false);
    setAPIDataHydrated(false);
  }, []);

  // Prefetch images and return mapping of profile images when senders updated
  useEffect(() => {
    (async () => {
      const map = await cacheProfileImagesAndGetMap(allSendersUsersArr);
      setProfileImagesCache(map);
    })();
  }, [allSendersUsersArr]);

  const markAsRead = async (msgId) => {
    await updateMsgReadStatus(msgId);
    // Update state
    setAllReceivedMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m))
    );
  };

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
