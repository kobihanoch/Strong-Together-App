import supabase from "../src/supabaseClient";

export const deleteMessage = async (msgId) => {
  const { error } = await supabase.from("messages").delete().eq("id", msgId);
  if (error) {
    console.log(error);
    throw error;
  }
};
