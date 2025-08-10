// services/AuthService.js
import { Alert } from "react-native";
import supabase from "../src/supabaseClient";
import { getEmailByUsername } from "./UserService";
import { SUPABASE_EDGE_URL } from "@env";
import api from "../api/api";
import { getRefreshToken } from "../utils/tokenStore";

// Rotate tokens
export const refreshAndRotateTokens = async () => {
  const rt = await getRefreshToken();
  if (!rt) throw new Error("No stored refresh token");

  const { data } = await api.post("/api/auth/refresh", null, {
    headers: { "X-Refresh-Token": `Bearer ${rt}` },
  });
  return data;
};

// Fetch self data
export const fetchSelfUserData = async () => {
  try {
    console.log("Calling fetch self");
    const response = await api.get("/api/users/get");
    return response;
  } catch (error) {
    throw error;
  }
};

// Login
export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    return response;
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
    const response = await fetch(`${SUPABASE_EDGE_URL}/register_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
        fullName,
        gender,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log("❌ REGISTER_USER EDGE ERROR:", result);
      return {
        success: false,
        reason: result.reason || "UNKNOWN_ERROR",
        error: result.error,
      };
    }

    console.log(result.error);
    return result;
  } catch (error) {
    console.error(error.message);
    return {
      success: false,
      reason: "NETWORK_ERROR",
      error: error.message,
    };
  }
};
