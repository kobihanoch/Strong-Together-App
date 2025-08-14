import { getSocket } from "./socketConfig";

export const registerToMessagesListener = (setMsgs, setSenders) => {
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

    // Set all senders
    // Checks for duplications before
    setSenders((prev) => {
      if (prev.some((s) => s.sender_id === msg.sender_id)) return prev;
      const next = [
        ...prev,
        {
          sender_id: msg.sender_id,
          sender_username: msg.sender_username,
          sender_full_name: msg.sender_full_name,
          sender_profile_image_url: msg.sender_profile_image_url || null,
        },
      ];
      return next;
    });
  };

  // Registration
  socket.on("new_message", handler);

  // Cleanup
  return () => {
    socket.off("new_message", handler);
  };
};
