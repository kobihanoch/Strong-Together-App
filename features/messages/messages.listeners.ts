/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSocket } from '../../infrastructure/socket';
import type { IncomingMessage, UserMessages } from './types/messages.types';

export const registerToMessagesListener = (setMsgs: any) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: IncomingMessage) => {
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
