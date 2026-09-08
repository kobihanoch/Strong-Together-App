import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMessages } from '../../../features/messages/hooks/use-messages.hook';
import type { UserMessage } from '../../../features/messages/types/messages.types';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const useInboxScreen = () => {
  const { colors: theme } = useAppTheme();
  const { data, loadingStates, actions } = useMessages();
  const { updateMessageToRead, deleteMessage } = actions;
  const [selectedMessageId, setSelectedMessageId] = useState<UserMessage['id'] | null>(null);

  const openMessage = useCallback(
    async (message: UserMessage) => {
      setSelectedMessageId(message.id);
      if (!message.isRead) {
        try {
          await updateMessageToRead(message.id);
        } catch {
          showErrorAlert('Could not update message', 'The message was opened, but its read status could not be saved.');
        }
      }
    },
    [updateMessageToRead],
  );

  const closeMessage = useCallback(() => setSelectedMessageId(null), []);

  const confirmAndDeleteMessage = useCallback(
    (messageId: UserMessage['id']) => {
      Alert.alert('Delete message?', 'This message will be permanently removed.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage(messageId);
              setSelectedMessageId((current) => (current === messageId ? null : current));
            } catch {
              showErrorAlert('Could not delete message', 'Please try again.');
            }
          },
        },
      ]);
    },
    [deleteMessage],
  );

  return {
    data: {
      allReceivedMessages: data.allReceivedMessages,
      unreadMessagesCount: data.unreadMessages.length,
      selectedMessageId,
      theme,
    },
    actions: { openMessage, closeMessage, confirmAndDeleteMessage },
    loadingStates: { isPending: loadingStates.isPending, isUpdating: loadingStates.isUpdating },
  };
};

export default useInboxScreen;
