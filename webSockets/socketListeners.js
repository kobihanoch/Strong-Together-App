import { getSocket } from "./socketConfig";

export const registerToMessagesListener = (setMsgs) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [msg, ...prev];
    });
  };

  // Registration
  socket.on("new_message", handler);

  // Cleanup
  return () => {
    socket.off("new_message", handler);
  };
};
