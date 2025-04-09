import { createContext, useContext, useEffect, useState } from "react";
import { getUserMessages } from "../services/UserService";
import { filterMessagesByUnread } from "../utils/authUtils";
import { listenToMessags } from "../utils/realTimeUtils";
import supabase from "../src/supabaseClient";

export const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ user, children }) => {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [allReceivedMessages, setAllReceivedMessages] = useState([]);

  // Update messages on live with listener
  useEffect(() => {
    if (!user) return;

    const channel = listenToMessags(
      user,
      setAllReceivedMessages,
      setUnreadMessages
    );

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [allReceivedMessages]);

  // Load messages on start
  useEffect(() => {
    (async () => {
      if (user) {
        const messages = await getUserMessages(user?.id);
        setAllReceivedMessages(messages);
        setUnreadMessages(filterMessagesByUnread(messages));
      }
    })();
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{
        unreadMessages,
        setUnreadMessages,
        allReceivedMessages,
        setAllReceivedMessages,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
