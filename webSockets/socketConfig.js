import { API_BASE_URL } from "../api/apiConfig";
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = async (userId) => {
  if (socket && socket.connected) return socket;

  socket = io(API_BASE_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    timeout: 10000,
  });

  socket.emit("user_loggedin", userId);

  socket.on("connect", () => console.log("SOCKET connected" /*, socket.id*/));
  socket.on("disconnect", (r) => console.log("SOCKET disconnected:", r));
  socket.on("connect_error", (e) =>
    console.log("SOCKET connect_error:", e?.message)
  );
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
