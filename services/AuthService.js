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

// Using edge function to login
export const loginUser = async (username, password) => {
  try {
    const url = `${SUPABASE_EDGE_URL}/login_user_by_username`;
    //console.log("FULL URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const text = await response.text();
    console.log("RAW response:", text);

    let data = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message);
      return {
        success: false,
        reason: "INVALID_JSON_FROM_EDGE",
        raw: text,
      };
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        reason: data.reason || "UNKNOWN_ERROR",
        error: data.error,
      };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("Login error (EDGE):", error.message);
    return { success: false, reason: "EDGE_CALL_FAILED", error };
  }
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
