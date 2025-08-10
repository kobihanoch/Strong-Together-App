import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { GlobalAuth } from "../context/AuthContext.js";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor for requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip beacuse if there are errors -
    // don't catch them by refresh token error (The will pass the condition because user is not authenticated yet)
    const skipRefreshRoutes = ["/api/auth/login", "/api/users/create"];
    if (
      skipRefreshRoutes.some((route) => originalRequest.url.includes(route))
    ) {
      return Promise.reject(error);
    }

    // If refreshing 2nd time - don't try again - set user to null - for refresh token failures
    if (originalRequest.url.includes("/api/auth/refresh")) {
      GlobalAuth.logout();
      return Promise.reject(error); // Throw error
    }

    // If first time - try to refresh if not already retried - try to generate a new access token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        GlobalAuth.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
