import supabase from "../src/supabaseClient";

export const sendSystemMessageToUser = async (user, header, message) => {
  console.log("Got here");
  const { error } = await supabase.from("messages").insert({
    sender_id: "8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a",
    receiver_id: user.id,
    subject: header,
    msg: message,
  });

  if (error) {
    console.log(error);
    throw error;
  }
  console.log("Message sent susccefully. ", message);
};
