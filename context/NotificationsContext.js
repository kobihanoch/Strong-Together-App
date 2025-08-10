import { createContext, useContext, useEffect, useState } from "react";
import { getAnotherUserData } from "../services/UserService";
import { filterMessagesByUnread } from "../utils/authUtils";
import { listenToMessags } from "../utils/realTimeUtils";
import supabase from "../src/supabaseClient";
import { Image } from "react-native";
import { getUserMessages } from "../services/MessagesService.js";

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

  // Load messages on start
  useEffect(() => {
    (async () => {
      if (user) {
        setLoadingMessages(true);
        try {
          const messages = await getUserMessages();
          // Load profile pics
          const { allUsersArray, imageMap } = await loadAllUsers(messages);

          setProfileImagesCache(imageMap);
          setAllReceivedMessages(messages);
          setUnreadMessages(filterMessagesByUnread(messages));
          setAllSendersUsersArr(allUsersArray);
        } finally {
          setLoadingMessages(false);
          console.log("SENDERSLOADED");
        }
      }
    })();
  }, [user]);

  /*// When getting a new message
  useEffect(() => {
    if (allReceivedMessages.length === 0) return;

    const loadSenders = async () => {
      const { allUsersArray, imageMap } = await loadAllUsers(
        allReceivedMessages
      );
      setAllSendersUsersArr(allUsersArray);
      setProfileImagesCache(imageMap);
    };

    loadSenders();
  }, [allReceivedMessages.length]);*/

  const loadAllUsers = async (messages) => {
    let allUsrsIdSet = new Set();
    messages.forEach((msg) => allUsrsIdSet.add(msg.sender_id));

    const userPromises = [...allUsrsIdSet].map((usrid) =>
      getAnotherUserData(usrid)
    );
    const allUsersArray = await Promise.all(userPromises);

    const imageMap = {};
    await Promise.all(
      allUsersArray.map(async (user) => {
        if (user?.profile_image_url) {
          await Image.prefetch(user.profile_image_url);
          imageMap[user.id] = { uri: user.profile_image_url };
        } else {
          if (user.gender == "Male") {
            imageMap[user.id] = require("../assets/man.png");
          } else {
            imageMap[user.id] = require("../assets/woman.png");
          }
        }
      })
    );

    return { allUsersArray, imageMap };
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
