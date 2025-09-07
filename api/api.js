import axios from "axios";
import { GlobalAuth } from "../context/AuthContext.js";
import { showErrorAlert } from "../errors/errorAlerts";
import { refreshAndRotateTokens } from "../services/AuthService";
import { saveRefreshToken } from "../utils/tokenStore";
import { API_BASE_URL } from "./apiConfig";
import {
  isDeviceOnline,
  notifyOffline,
  notifyServerDown,
} from "./networkCheck";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 12000 });

// Attach access token to every outgoing request (if present)
api.interceptors.request.use(
  async (config) => {
    const at = GlobalAuth.getAccessToken && GlobalAuth.getAccessToken();
    if (at) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${at}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flow:
// Client -> Request -> Server
// CLient <- Response <- Server
//   ---If error---
//   V          V
// SKIP?   DO NOT SKIP?
//   V          V
// Throw      401 => -----Try to refresh---------
//                       V            V
//             Error => Log out /   Good => Call API again
//                       Reject

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      console.log("401 from API:", {
        url: original.url,
        method: original.method,
        resp: data,
        authHeader: original.headers?.Authorization?.slice(0, 32) + "...",
      });
    }

    // Detect if network error - no response
    const online = await isDeviceOnline();

    if (!online) {
      notifyOffline();
      error.isNetworkError = true;
      console.log("Offline");
      return Promise.reject(error);
    } else if (!error.response) {
      // Some other fetch/network problem (e.g., DNS, TLS fail)
      notifyServerDown();
      console.log("Server down");
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    // Don't go for refresh logic for them - just logout or keep logged out and reject
    const url = original?.url || "";
    if (
      original?._retry ||
      url.includes("/api/auth/refresh") ||
      url.includes("/api/auth/login") ||
      url.includes("/api/users/create") ||
      url.includes("/api/auth/logout")
    ) {
      // Some toast to show error
      showErrorAlert("Error", data?.message);
      return Promise.reject(error);
    }

    // If got 401 no access
    if (status === 401) {
      try {
        // Try to refresh
        // Flag for second retry
        original._retry = true;
        const { refreshToken, accessToken } = await refreshAndRotateTokens();
        await saveRefreshToken(refreshToken);
        GlobalAuth.setAccessToken(accessToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        // If got here failed at refresh
        if (refreshErr?.response?.status === 401) {
          if (GlobalAuth.logout) GlobalAuth.logout();
        }
        // Some toast to show error
        showErrorAlert("Error", data?.message);
        // Block
        return Promise.reject(refreshErr);
      }
    }

    showErrorAlert("Error", data?.message);
    // Bloack all types of error
    return Promise.reject(error);
  }
);

export default api;
