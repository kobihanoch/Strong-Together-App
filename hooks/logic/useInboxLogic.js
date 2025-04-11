import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";

const useInboxLogic = () => {
  const { user } = useAuth();
  const {
    allReceivedMessages,
    unreadMessages,
    setUnreadMessages,
    loadingMessages,
  } = useNotifications(user);

  useEffect(() => {
    // TODO: fetch or logic here
  }, []);

  return {
    messages: {
      allReceivedMessages,
      unreadMessages,
      setUnreadMessages,
      loadingMessages,
    },
  };
};

export default useInboxLogic;
