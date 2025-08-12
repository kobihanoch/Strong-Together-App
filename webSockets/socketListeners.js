import { getSocket } from "./socketConfig";

export const registerToMessagesListener = (setMsgs, setUnread) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg) => {
    setMsgs((prev) => [msg, ...prev]);
    setUnread((prev) => [msg, ...prev]);
  };

  // Registration
  socket.on("new_message", handler);

  // Cleanup
  return () => {
    socket.off("new_message", handler);
  };
};
