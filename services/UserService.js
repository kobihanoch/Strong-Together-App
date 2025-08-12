import api from "../api/api";
import supabase from "../src/supabaseClient";

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
