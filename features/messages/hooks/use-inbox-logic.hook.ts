import { useCallback } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useMessages } from '../providers/MessagesProvider';
import type { UserMessage } from '../types/messages.types';

const useInboxLogic = () => {
  const { allReceivedMessages, unreadMessages, updateMessageToRead, deleteMessage } = useMessages();

  const unreadMessagesCount = unreadMessages?.length;

  const markAsRead = useCallback(async (msgId: UserMessage['id']): Promise<void> => {
    await updateMessageToRead(msgId);
  }, [updateMessageToRead]);

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
        } catch (err) {
          console.log('Delete failed:', err);
        }
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [deleteMessage]);

  return {
    allReceivedMessages,
    unreadMessagesCount,
    confirmAndDeleteMessage,
    markAsRead,
  };
};

export default useInboxLogic;
