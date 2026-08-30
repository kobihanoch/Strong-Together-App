import { getSocket } from '../../infrastructure/socket';
import type { IncomingMessage } from './types/messages.types';
import { UserMessages } from './types/messages.types';

export const registerToMessagesListener = (
  setMsgs: (message: UserMessages) => Promise<void>,
  allMessages: UserMessages | null | undefined,
) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: IncomingMessage) => {
    const msgs = allMessages ?? [];
    // Set all recieved messages at context.
    // Checks for duplications before
    const updatedMessages = (() => {
      if (msgs.some((m) => m.id === msg.id)) return msgs;
      return [msg, ...msgs];
    })();

    setMsgs(updatedMessages);
  };

  // Registration
  socket.on('new_message', handler);

  // Cleanup
  return () => {
    socket.off('new_message', handler);
  };
};
