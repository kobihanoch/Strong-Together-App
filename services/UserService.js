import api from "../api/api";
import supabase from "../src/supabaseClient";
import { SUPABASE_EDGE_URL } from "@env";

// Update profile pic URL of user - RLS ENABLED
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

// Get another user data
export const getAnotherUserData = async (userId) => {
  try {
    const response = await api.get(
      `/api/users/getusernamepicandname/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
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
