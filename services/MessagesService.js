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
