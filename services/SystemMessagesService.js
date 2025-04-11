import supabase from "../src/supabaseClient";

export const sendSystemMessageToUser = async (userId, header, message) => {
  if (!userId) {
    return;
  }
  console.log("SNDINGMESSAGE FOR", userId);
  const { error } = await supabase.from("messages").insert({
    sender_id: "8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a",
    receiver_id: userId,
    subject: header,
    msg: message,
  });

  if (error) {
    console.log("Fount error: " + error);
    throw error;
  }
  console.log("Message sent susccefully. ", message);
};
