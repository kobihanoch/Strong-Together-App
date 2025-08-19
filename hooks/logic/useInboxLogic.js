import { Dialog } from "react-native-alert-notification";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { deleteMessage } from "../../services/MessagesService";

const useInboxLogic = () => {
  const { user } = useAuth();
  const {
    allReceivedMessages,
    setAllReceivedMessages,
    unreadMessages,
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
