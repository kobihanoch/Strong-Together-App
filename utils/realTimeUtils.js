import supabase from "../src/supabaseClient";
import { getUserMessages } from "../services/UserService";
import { filterMessagesByUnread } from "./authUtils";
import * as Notifications from "expo-notifications";
import { sendPushNotification } from "../notifications/NotificationsManager";

// New message
export const listenToMessags = async (
  user,
  setAllReceivedMessages,
  setUnreadMessages
) => {
  if (!user) {
    return;
  }
  const channel = supabase
    .channel("messages-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      },
      async (payload) => {
        console.log("NEW MESSAGE!", payload.new);
        const userMessages = await getUserMessages(user.id);
        setAllReceivedMessages(userMessages);
        setUnreadMessages(filterMessagesByUnread(userMessages));
        await sendPushNotification(
          user.push_token,
          payload.new.subject,
          payload.new.msg
        );
      }
    )

    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      },
      async (payload) => {
        console.log("MSG DELETED! ", payload.old);

        const userMessages = await getUserMessages(user.id);
        setAllReceivedMessages(userMessages);
        setUnreadMessages(filterMessagesByUnread(userMessages));
      }
    )

    .subscribe();

  return channel;
};
