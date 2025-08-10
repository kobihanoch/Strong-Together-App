import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { GlobalAuth } from "../context/AuthContext.js";
import { getRefreshToken, saveRefreshToken } from "../utils/tokenStore";
import { refreshAndRotateTokens } from "../services/AuthService";

const api = axios.create({ baseURL: API_BASE_URL });

// Concurrency guard for refresh
let refreshingPromise = null;
let refreshSubscribers = [];
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

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
  (error) => Promise.reject(error)
);

// Handle 401 responses with single-flight refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network/timeout errors without a response object
    if (!error.response) {
      return Promise.reject(error);
    }

    const skipRefreshRoutes = [
      "/api/auth/login",
      "/api/users/create",
      "/api/auth/checkauth",
      "/api/auth/logout",
    ];
    if (
      originalRequest?.url &&
      skipRefreshRoutes.some((r) => originalRequest.url.includes(r))
    ) {
      return Promise.reject(error);
    }

    // If refresh endpoint itself failed → force logout
    if (originalRequest?.url?.includes("/api/auth/refresh")) {
      if (GlobalAuth.logout) GlobalAuth.logout();
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      // If we've already retried this request, logout to avoid loops
      if (originalRequest._retry) {
        if (GlobalAuth.logout) GlobalAuth.logout();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        // If a refresh is already in-flight, wait and then retry with the new token
        if (refreshingPromise) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        refreshingPromise = (async () => {
          // get new tokens
          const { accessToken, refreshToken } = await refreshAndRotateTokens();

          // save & publish
          GlobalAuth.setAccessToken && GlobalAuth.setAccessToken(accessToken);
          if (refreshToken) await saveRefreshToken(refreshToken);

          // make sure new requests use the fresh token
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          onTokenRefreshed(accessToken);
          return accessToken;
        })();

        const newToken = await refreshingPromise;
        refreshingPromise = null;

        // Retry the original request with the fresh token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        refreshingPromise = null;
        if (GlobalAuth.logout) GlobalAuth.logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
