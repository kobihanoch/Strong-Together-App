import { createContext, useContext, useEffect, useState } from "react";
import { getUserData, getUserMessages } from "../services/UserService";
import { filterMessagesByUnread } from "../utils/authUtils";
import { listenToMessags } from "../utils/realTimeUtils";
import supabase from "../src/supabaseClient";
import { Image } from "react-native";

export const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ user, children }) => {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [allReceivedMessages, setAllReceivedMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // All senders
  const [allSendersUsersArr, setAllSendersUsersArr] = useState(null);

  // ALl profile images
  const [profileImagesCache, setProfileImagesCache] = useState({});

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
        setLoadingMessages(true);
        try {
          const messages = await getUserMessages(user?.id);
          const { allUsersArray, imageMap } = await loadAllUsers(messages);

          setProfileImagesCache(imageMap);
          setAllReceivedMessages(messages);
          setUnreadMessages(filterMessagesByUnread(messages));
          setAllSendersUsersArr(allUsersArray);
        } finally {
          setLoadingMessages(false);
        }
      }
    })();
  }, [user]);

  const loadAllUsers = async (messages) => {
    let allUsrsIdSet = new Set();
    messages.forEach((msg) => allUsrsIdSet.add(msg.sender_id));

    const userPromises = [...allUsrsIdSet].map((usrid) => getUserData(usrid));
    const allUsersArray = await Promise.all(userPromises);

    const imageMap = {};
    await Promise.all(
      allUsersArray.map(async (user) => {
        if (user?.profile_image_url) {
          await Image.prefetch(user.profile_image_url);
          imageMap[user.id] = { uri: user.profile_image_url };
        } else {
          imageMap[user.id] = require("../assets/profile.png");
        }
      })
    );

    return { allUsersArray, imageMap };

    return allUsersArray;
  };

  return (
    <NotificationsContext.Provider
      value={{
        unreadMessages,
        setUnreadMessages,
        allReceivedMessages,
        setAllReceivedMessages,
        loadingMessages,
        profileImagesCache,
        allSendersUsersArr,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
