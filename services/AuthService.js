// services/AuthService.js
import { Alert } from "react-native";
import supabase from "../src/supabaseClient";
import { getEmailByUsername } from "./UserService";
import { SUPABASE_EDGE_URL } from "@env";

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

// Login
export const loginUser = async (username, password) => {
  const url = `${SUPABASE_EDGE_URL}/login_user_by_username`;

  // 0. Client-side missing fields
  if (!username || !password) {
    // Treat empty credentials as invalid
    throw new Error("Username or password are incorrect.");
  }

  // 1. Network request
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch (error) {
    console.error("Login error (EDGE):", error.message);
    // Network failure
    throw new Error(
      "Network error: please check your internet connection and try again."
    );
  }

  // 2. Parse response text
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error:", e.message);
    // Malformed server response
    throw new Error("Server error: received invalid response.");
  }

  // 3. Application-level success flag
  if (!data.success || data.reason === "USERNAME_NOT_FOUND") {
    console.error("Edge function returned failure:", data);
    // Map any failure to credential mismatch
    throw new Error("Username or password are incorrect.");
  }

  // 4. HTTP status errors
  if (!response.ok) {
    console.error("Edge function returned HTTP error:", data);
    // Always treat as generic server error
    throw new Error("Server error: please try again later.");
  }

  // 5. Return user and session on success
  return { user: data.user, session: data.session };
};

export const logoutUser = async () => {
  try {
    const { data: sessionBefore } = await supabase.auth.getSession();
    console.log("Session before logout:", sessionBefore);

    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error };
    }

    const { data: sessionAfter } = await supabase.auth.getSession();
    console.log("Session after logout:", sessionAfter);

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.message);
    return { success: false, error };
  }
};
