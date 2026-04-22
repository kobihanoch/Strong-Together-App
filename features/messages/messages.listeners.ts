import { Dispatch, SetStateAction } from 'react';
import { getSocket } from '../../infrastructure/socket';
import { UserMessages } from './types/messages.types';
import { MessageAfterSendResponse } from '@strong-together/shared';

export const registerToMessagesListener = (setMsgs: Dispatch<SetStateAction<UserMessages>>) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: MessageAfterSendResponse) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev: UserMessages) => {
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
