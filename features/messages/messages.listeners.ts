/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from 'socket.io-client';
import type { IncomingMessage } from './types/messages.types';

export const registerToMessagesListener = (socket: Socket, updateMessages: any) => {
  const handler = (message: IncomingMessage) => {
    updateMessages((previous: any[]) => {
      if (!previous) return previous;
      if (previous.some((item) => item.id === message.id)) {
        return previous;
      }

      return [message, ...previous];
    });
  };

  socket.on('new_message', handler);

  return () => {
    socket.off('new_message', handler);
  };
};
