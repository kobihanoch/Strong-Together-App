import supabase from "../src/supabaseClient";
import { SUPABASE_EDGE_URL } from "@env";

// Update profile pic URL of user
export const updateProfilePictureURL = async (userId, picURL) => {
  const { data, error } = await supabase
    .from("users")
    .update({ profile_image_url: picURL })
    .eq("id", userId);

  if (error) {
    console.log("Service error while updating profile pic URL: " + error);
    throw error;
  } else {
    console.log("Service profile pic URL updated successfully");
  }
};

// Get user data
export const getUserData = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.log("Service error while fetching user data: " + error);
    throw error;
  }
  return data;
};

// Get another user data by RPC (returning only username, profilepic_url by uuid)
export const getAnotherUserData = async (userId) => {
  const { data, error } = await supabase.rpc("get_user_profile_by_id", {
    input_id: userId,
  });

  if (error) {
    console.error("Failed to load profile", error);
    return null;
  }

  return data[0];
};

// Get email of user (Before auth - has edge function)
/**
 * Calls Supabase Edge Function: getEmailByUsername
 */
export const getEmailByUsername = async (username) => {
  try {
    const response = await fetch(`${SUPABASE_EDGE_URL}/getEmailByUsername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch email");
    }

    const data = await response.json();
    console.log("Data from service: ", data);
    return data.email;
  } catch (error) {
    console.error("getEmailByUsername error:", error);
    return null;
  }
};

// Get username
export const getUsername = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Get messages
export const getUserMessages = async (userId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", userId)
    .order("sent_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch messages:", error.message);
    return [];
  }
  return data ?? [];
};

// Update push token
export const savePushTokenToDB = async (userId, token) => {
  const { error } = await supabase
    .from("users")
    .update({ push_token: token })
    .eq("id", userId);

  if (error) {
    console.error("Failed to save push token:", error.message);
  } else {
    console.log("Push token saved successfully");
  }
};
