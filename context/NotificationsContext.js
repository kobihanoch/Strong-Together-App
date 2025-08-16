import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getUserMessages,
  updateMsgReadStatus,
} from "../services/MessagesService.js";
import { filterMessagesByUnread } from "../utils/authUtils";
import { cacheProfileImagesAndGetMap } from "../utils/notificationsUtils.js";
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
  const { user, sessionLoading } = useAuth();

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
  const [loadingMessages, setLoadingMessages] = useState(true);

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
    if (sessionLoading) {
      setLoading(true);
      return;
    }
    (async () => {
      if (user) {
        setLoadingMessages(true);
        try {
          const messages = await getUserMessages();
          setAllReceivedMessages(messages.messages);
          setAllSendersUsersArr(messages.senders);
        } finally {
          setLoadingMessages(false);
        }
      }
    })();

    return logoutCleanup;
  }, [user, sessionLoading]);

  const logoutCleanup = useCallback(() => {
    setAllReceivedMessages([]);
    setAllSendersUsersArr([]);
    setProfileImagesCache({});
    setLoadingMessages(false);
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
