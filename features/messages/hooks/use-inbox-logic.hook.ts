import type { UserMessage } from '../types/messages.types';
import { useCallback } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useMessages } from '../providers/MessagesProvider';
import { deleteMessage, updateMsgReadStatus } from '../services/messages.service';
import { UserMessages } from '../types/messages.types';

const useInboxLogic = () => {
  const { allReceivedMessages, setAllReceivedMessages, unreadMessages } = useMessages();

  const unreadMessagesCount = unreadMessages?.length;

  const markAsRead = useCallback(async (msgId: UserMessage['id']): Promise<void> => {
    await updateMsgReadStatus(msgId);
    // Update state
    setAllReceivedMessages((prev: UserMessages | undefined) =>
      prev ? prev.map((m: UserMessages[number]) => (m.id === msgId ? { ...m, isRead: true } : m)) : prev,
    );
  }, [setAllReceivedMessages]);

  const confirmAndDeleteMessage = useCallback((msgId: UserMessage['id']): void => {
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
          setAllReceivedMessages((prev: UserMessages | undefined) =>
            prev ? prev.filter((m: UserMessages[number]) => m.id !== msgId) : prev,
          );
        } catch (err) {
          console.log('Delete failed:', err);
        }
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [setAllReceivedMessages]);

  return {
    allReceivedMessages,
    unreadMessagesCount,
    confirmAndDeleteMessage,
    markAsRead,
  };
};

export default useInboxLogic;
