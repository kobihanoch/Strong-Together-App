import supabase from "../src/supabaseClient";

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
