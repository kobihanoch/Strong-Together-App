import { useCallback, useMemo } from "react";
import { Dialog } from "react-native-alert-notification";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import {
  deleteMessage,
  updateMsgReadStatus,
} from "../../services/MessagesService";

const useInboxLogic = () => {
  const { user } = useAuth();
  const { allReceivedMessages, setAllReceivedMessages } =
    useNotifications(user);

  const sortedMessages = useMemo(() => {
    return [...allReceivedMessages].sort(
      (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
    );
  }, [allReceivedMessages]);

  const markAsRead = useCallback(async (msgId) => {
    await updateMsgReadStatus(msgId);
    // Update state
    setAllReceivedMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m))
    );
  }, []);

  const confirmAndDeleteMessage = useCallback((msgId) => {
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
  }, []);

  return {
    sortedMessages,
    confirmAndDeleteMessage,
    markAsRead,
  };
};

export default useInboxLogic;
