import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { Alert } from "react-native";
import { deleteMessage } from "../../services/MessagesService";
import { Dialog } from "react-native-alert-notification";

const useInboxLogic = () => {
  const { user } = useAuth();
  const {
    allReceivedMessages,
    setAllReceivedMessages,
    unreadMessages,
    setUnreadMessages,
    loadingMessages,
    profileImagesCache,
    allSendersUsersArr,
  } = useNotifications(user);

  const confirmAndDeleteMessage = (msgId) => {
    let pressedYes = false;

    Dialog.show({
      type: "WARNING",
      title: "Delete Message",
      textBody: "Are you sure you want to delete this message?",
      button: "Yes",
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        try {
          await deleteMessage(msgId);
          setAllReceivedMessages((prev) => prev.filter((m) => m.id !== msgId));
          setUnreadMessages((prev) => prev.filter((m) => m.id !== msgId));
        } catch (err) {
          console.log("Delete failed:", err);
        }
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
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
