import { Dispatch, SetStateAction } from 'react';
import { getSocket } from './socketConfig';
import { NotificationsContextAllReceivedMessages } from '../context/types/notificationsContextTypes.dto';
import { MessageAfterSendResponse } from '../types/dto/messages.dto';

export const registerToMessagesListener = (
  setMsgs: Dispatch<SetStateAction<NotificationsContextAllReceivedMessages>>,
) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: MessageAfterSendResponse) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev: NotificationsContextAllReceivedMessages) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [msg, ...prev];
    });
  };

  // Registration
  socket.on('new_message', handler);

  // Cleanup
  return () => {
    socket.off('new_message', handler);
  };
};
