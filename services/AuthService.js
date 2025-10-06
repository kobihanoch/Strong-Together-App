// services/AuthService.js
import axios from "axios";
import api from "../api/api";
import { API_BASE_URL } from "../api/apiConfig";
import { getRefreshToken } from "../utils/tokenStore";

// Rotate tokens
export const refreshAndRotateTokens = async () => {
  const rt = await getRefreshToken();
  if (!rt) throw new Error("No stored refresh token");

  const { data } = await api.post(`/api/auth/refresh`, null, {
    headers: { "x-refresh-token": `Bearer ${rt}` },
  });
  return data;
};

// Login
export const loginUser = async (username, password) => {
  try {
    const { data } = await api.post("/api/auth/login", { username, password });
    return data;
  } catch (error) {
    throw error;
  }
};

// Log out a user
export const logoutUser = async () => {
  try {
    const refreshToken = await getRefreshToken();
    const response = await api.post(
      "/api/auth/logout",
      {},
      {
        headers: {
          "x-refresh-token": `Bearer ${refreshToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Using edge function to register
export const registerUser = async (
  email,
  password,
  username,
  fullName,
  gender
) => {
  try {
    await api.post("/api/users/create", {
      username,
      fullName,
      email,
      password,
      gender,
    });
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (username, password, newEmail) => {
  await api.put("api/auth/changeemailverify", {
    username,
    password,
    newEmail,
  });
};

export const forgotPassword = async (email) => {
  await api.post("api/auth/forgotpassemail", { email });
};

export const checkUserVerify = async (username) => {
  const { data } = await api.get(
    `api/auth/checkuserverify?username=${username}`
  );
  return data;
};
