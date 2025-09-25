import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Use a separate axios instance to avoid circular import
export const bootstrapApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

bootstrapApi.interceptors.request.use(
  async (config) => {
    console.log("[Bootstrap]:", config.url);
    return config; // << MUST return config
  },
  (err) => {
    Promise.reject(err);
  }
);

let inflight = null; // shared promise while /bootstrap is in flight
let payload = null; // cached /bootstrap response
let closed = false; // once true, we stop intercepting
let graceT = null; // short grace so late requests still get slices

export const responseMap = {
  "/api/workouts/gettracking": "tracking",
  "/api/aerobics/get": "aerobics",
  "/api/messages/getmessages": "messages",
  "/api/workouts/getworkout": "workout",
};

export const isTracked = (url) =>
  Object.prototype.hasOwnProperty.call(responseMap, url);

// Interception is open until we mark it closed
export const isOpen = () => !closed;

// Single-flight bootstrap fetch
export async function ensureBootstrap() {
  if (payload) return payload;
  if (inflight) {
    return inflight;
  }
  inflight = (async () => {
    const res = await bootstrapApi.get("/api/bootstrap/get"); // real server call
    payload = res?.data || {};

    // Give a short grace window so "just-arrived" requests still use the payload
    if (graceT) clearTimeout(graceT);
    graceT = setTimeout(() => {
      closed = true;
    }, 500);

    inflight = null;
    return payload;
  })();

  return inflight;
}

// Optional: reset on logout/account switch
export function resetBootstrap() {
  inflight = null;
  payload = null;
  closed = false;
  if (graceT) {
    clearTimeout(graceT);
    graceT = null;
  }
}
