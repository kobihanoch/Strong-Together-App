import api from "../api/api";
import supabase from "../src/supabaseClient";

export const updateMsgReadStatus = async (msgId) => {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", msgId);

  if (error) {
    throw error;
  }
};

// Get messages
export const getUserMessages = async () => {
  try {
    const response = await api.get("/api/messages/getmessages");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
