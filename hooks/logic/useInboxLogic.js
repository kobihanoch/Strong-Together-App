import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { Alert } from "react-native";
import { deleteMessage } from "../../services/MessagesService";

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

  const confirmAndDeleteMessage = (msgId) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteMessage(msgId);
            } catch (err) {
              console.log("Delete failed:", err);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return {
    messages: {
      allReceivedMessages,
      unreadMessages,
      setUnreadMessages,
      loadingMessages,
      allSendersUsersArr,
      confirmAndDeleteMessage,
    },
    media: {
      profileImagesCache,
    },
  };
};

export default useInboxLogic;
