import api from "../api/api";
import supabase from "../src/supabaseClient";

// Fetch self data
export const fetchSelfUserData = async () => {
  try {
    const response = await api.get("/api/users/get");
    return response;
  } catch (error) {
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
