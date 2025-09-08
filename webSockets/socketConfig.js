// English comments only inside the code
import { io } from "socket.io-client";
import { API_BASE_URL } from "../api/apiConfig";

let socket = null;

export const connectSocket = (userId) => {
  if (socket && socket.connected) return socket;

  socket = io(API_BASE_URL, {
    path: "/socket.io", // must match server
    transports: ["polling", "websocket"], // allow polling warm-up, then upgrade
    upgrade: true,
    autoConnect: false, // attach listeners first
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
    timeout: 15000,
    auth: { userId }, // pass userId in handshake
  });

  socket.on("connect", () => {
    console.log("[WebSocket]: Socket connected");
    socket.emit("user_loggedin", userId); // emit only after connect
  });

  socket.on("disconnect", (reason) => {
    console.log("[WebSocket]: Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[WebSocket]: Socket connect_error:", err?.message || err);
  });

  socket.connect();
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
