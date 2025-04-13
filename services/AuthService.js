// services/AuthService.js
import { Alert } from "react-native";
import supabase from "../src/supabaseClient";
import { getEmailByUsername } from "./UserService";

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

export const loginUser = async (username, password) => {
  try {
    const userRow = await getEmailByUsername(username);

    console.log("Got email: " + userRow);

    if (!userRow) {
      Alert.alert("Username or password are incorrect");
      return { success: false, reason: "USERNAME_NOT_FOUND" };
    }

    const { data: authData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userRow,
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
