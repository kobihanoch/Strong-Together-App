import { useCallback } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useMessages } from '../../../features/messages/hooks/use-messages.hook';
import type { UserMessage } from '../../../features/messages/types/messages.types';

const useInboxScreen = () => {
  const { data, loadingStates, actions } = useMessages();
  const { allReceivedMessages, unreadMessages } = data;
  const { updateMessageToRead, deleteMessage } = actions;

  const unreadMessagesCount = unreadMessages?.length;

  const confirmAndDeleteMessage = useCallback(
    (msgId: UserMessage['id']): void => {
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
    },
    [deleteMessage],
  );

  return {
    data: { allReceivedMessages, unreadMessagesCount },
    actions: { confirmAndDeleteMessage, markAsRead: updateMessageToRead },
    loadingStates: { isPending: loadingStates.isPending },
  };
};

export default useInboxScreen;
