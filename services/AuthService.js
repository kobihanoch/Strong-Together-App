// services/AuthService.js
import { Alert } from "react-native";
import supabase from "../src/supabaseClient";
import { getEmailByUsername } from "./UserService";
import { SUPABASE_EDGE_URL } from "@env";

export const registerUser = async (
  email,
  password,
  username,
  fullName,
  gender
) => {
  try {
    const existingUser = await getEmailByUsername(username);

    if (existingUser) {
      Alert.alert("Username is taken.");
      return { success: false, reason: "USERNAME_TAKEN" };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.log(signUpError);
    }

    const userId = authData.user.id;

    const { error: insertError } = await supabase.rpc("register_user", {
      input_id: userId,
      input_email: email,
      input_username: username,
      input_name: fullName,
      input_gender: gender,
    });

    if (insertError) {
      console.log(insertError);
    }

    return { success: true, email, username, password };
  } catch (error) {
    console.log("Error during registration:", error.message);
    return { success: false, reason: "REGISTRATION_FAILED", error };
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
    return { success: true, user: data.user };
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
