import axios from "axios";
import Constants from "expo-constants";
import { showErrorAlert } from "../errors/errorAlerts";
import { refreshAndRotateTokens } from "../services/AuthService";
import GlobalAuth from "../utils/authUtils";
import { openUpdateModal } from "../utils/imperativeUpdateModal";
import { saveRefreshToken } from "../utils/tokenStore";
import { API_BASE_URL } from "./apiConfig";
import {
  bootstrapApi,
  ensureBootstrap,
  isOpen,
  isTracked,
  responseMap,
} from "./bootstrapApi";
import {
  isDeviceOnline,
  notifyOffline,
  notifyServerDown,
} from "./networkCheck";
import buildDpopProof from "./DPoP/buildDpopProof";
import calculateJKT from "./DPoP/calculateJKT";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 12000 });

// === WRAP api.get ===

// Store the original axios get
const rawGet = api.get.bind(api);

// Replace api.get to support bootstrap fan-out on first load
api.get = async function wrappedGet(url, config) {
  // Intercept only during first-load for tracked endpoints
  if (isOpen() && isTracked(url)) {
    try {
      const data = await ensureBootstrap(); // single-flight
      const key = responseMap[url];
      const slice = data?.[key];

      if (slice === undefined) {
        // Fallback: no slice found
        return rawGet(url, config);
      }

      // Return shaped fake axios response
      return {
        data: slice,
        status: 200,
        headers: {},
        config: config ?? {},
        request: null,
      };
    } catch (e) {
      // Fallback on bootstrap error
      console.log("Error:", e);
      return rawGet(url, config);
    }
  }

  // Normal path
  return rawGet(url, config);
};

api.interceptors.request.use(
  async (config) => {
    console.log("[API]:", config.url);
    try {
      if (config.url.includes("login")) {
        // Build JKT for tokens signing (login)
        const res = await calculateJKT();
        config.headers.set("dpop-key-binding", res);
      } else {
        // Build DPoP for other requests
        const finalUrl = new URL(config.url, config.baseURL);
        const htu = `${finalUrl.origin}${finalUrl.pathname}`;
        const dpop = await buildDpopProof(config.method, htu);
        config.headers.set("dpop", dpop);
      }
    } catch {}
    config.headers.set("x-app-version", Constants.expoConfig.version);
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

    // Update required
    if (status === 426) {
      openUpdateModal(); // <-- imperative show
      error.isUpgradeRequired = true;
      return Promise.reject(error); // always reject
    }

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
