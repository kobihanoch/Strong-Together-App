// services/AuthService.js
import { Alert } from "react-native";
import supabase from "../src/supabaseClient";

export const registerUser = async (
  email,
  password,
  username,
  fullName,
  gender
) => {
  try {
    const { data: existingUser, error: checkUserError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (checkUserError) {
      throw checkUserError;
    }

    if (existingUser) {
      Alert.alert("Username is taken.");
      return { success: false, reason: "USERNAME_TAKEN" };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      throw signUpError;
    }

    const userId = authData.user.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        username,
        name: fullName,
        gender,
        level: 0,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    return { success: true, email, username, password };
  } catch (error) {
    console.error("Error during registration:", error.message);
    return { success: false, reason: "REGISTRATION_FAILED", error };
  }
};

export const loginUser = async (username, password) => {
  try {
    const { data: userRow, error: fetchEmailError } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single();

    if (fetchEmailError || !userRow) {
      return { success: false, reason: "USERNAME_NOT_FOUND" };
    }

    const { data: authData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userRow.email,
        password,
      });

    if (loginError || !authData.session) {
      return {
        success: false,
        reason: "INVALID_CREDENTIALS",
        error: loginError,
      };
    }

    const { data: fullUser, error: fetchUserError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchUserError || !fullUser) {
      return {
        success: false,
        reason: "FAILED_TO_LOAD_USER",
        error: fetchUserError,
      };
    }

    return { success: true, user: fullUser };
  } catch (error) {
    console.error("Login error:", error.message);
    return { success: false, reason: "UNEXPECTED_ERROR", error };
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
