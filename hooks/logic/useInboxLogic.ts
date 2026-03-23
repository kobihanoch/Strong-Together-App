import { useCallback } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useNotifications } from '../../context/NotificationsContext';
import { deleteMessage, updateMsgReadStatus } from '../../services/MessagesService';
import { MessageEntity } from '../../types/entities/message.entity';

const useInboxLogic = () => {
  const { allReceivedMessages, setAllReceivedMessages, unreadMessages } = useNotifications();

  const unreadMessagesCount = unreadMessages?.length;

  const markAsRead = useCallback(async (msgId: MessageEntity['id']): Promise<void> => {
    await updateMsgReadStatus(msgId);
    // Update state
    setAllReceivedMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m)));
  }, []);

  const confirmAndDeleteMessage = useCallback((msgId: MessageEntity['id']): void => {
    let pressedYes = false;

    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Delete Message',
      textBody: 'Are you sure you want to delete this message?',
      button: 'Yes',
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        try {
          await deleteMessage(msgId);
          setAllReceivedMessages((prev) => prev.filter((m) => m.id !== msgId));
        } catch (err) {
          console.log('Delete failed:', err);
        }
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, []);

  return {
    allReceivedMessages,
    unreadMessagesCount,
    confirmAndDeleteMessage,
    markAsRead,
  };
};

export default useInboxLogic;
