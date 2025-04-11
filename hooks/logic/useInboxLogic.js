import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { getUserData } from "../../services/UserService";

const useInboxLogic = () => {
  const { user } = useAuth();
  const {
    allReceivedMessages,
    unreadMessages,
    setUnreadMessages,
    loadingMessages,
    profileImagesCache,
    allSendersUsersArr,
  } = useNotifications(user);

  return {
    messages: {
      allReceivedMessages,
      unreadMessages,
      setUnreadMessages,
      loadingMessages,
      allSendersUsersArr,
    },
    media: {
      profileImagesCache,
    },
  };
};

export default useInboxLogic;
