import { Dispatch, SetStateAction } from 'react';
import { getSocket } from '../../infrastructure/socket';
import { UserMessages } from './types/messages.types';
import { MessageAfterSendResponse } from '@strong-together/shared';

export const registerToMessagesListener = (setMsgs: Dispatch<SetStateAction<UserMessages | undefined>>) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: MessageAfterSendResponse) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev: UserMessages | undefined) => {
      if (prev === undefined) return prev;
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
