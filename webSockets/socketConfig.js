// English-only comments inside code
import { io } from "socket.io-client";
import api from "../api/api";
import { API_BASE_URL } from "../api/apiConfig";

let socket = null;

// Helper to mint a fresh short-lived ticket
async function mintTicket(username) {
  // NOTE: adjust path to match your api base (avoid double "api")
  const res = await api.post("api/ws/generateticket", { username });
  const ticket = res?.data?.ticket;
  if (!ticket) throw new Error("Failed to get socket ticket");
  return ticket;
}

// English-only comments: reconnect with a fresh ticket (idempotent)
async function reconnectWithFreshTicket(username) {
  if (!socket) return;
  try {
    const fresh = await mintTicket(username);
    socket.auth = { ticket: fresh };
    socket.connect();
  } catch (e) {
    console.error("[WebSocket]: Ticket refresh failed:", e?.message || e);
  }
}

export const connectSocket = async (username) => {
  // Reuse already-connected instance
  if (socket && socket.connected) return socket;

  // Create instance if needed
  if (!socket) {
    const firstTicket = await mintTicket(username);

    socket = io(API_BASE_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      upgrade: false,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      timeout: 15000,
      auth: { ticket: firstTicket },
    });

    socket.on("connect", () => {
      console.log("[WebSocket]: Socket connected");
      socket.emit("user_loggedin");
    });

    socket.on("disconnect", (reason) => {
      console.log("[WebSocket]: Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      const msg = err?.message || "";
      console.error("[WebSocket]: connect_error:", msg);
    });

    // Optional: when socket.io tries automatic reconnect, refresh ticket first
    socket.io.on("reconnect_attempt", async () => {
      await reconnectWithFreshTicket(username);
      console.log("[WebSocket]: Reconnected");
    });
  }

  socket.connect();
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (appStateSub) {
    appStateSub.remove();
    appStateSub = null;
  }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
