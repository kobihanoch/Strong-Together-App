import supabase from "../src/supabaseClient";
import { getUserMessages } from "../services/UserService";
import { filterMessagesByUnread } from "./authUtils";
import * as Notifications from "expo-notifications";
import { sendPushNotification } from "../notifications/NotificationsManager";
import { getUserData } from "../services/UserService";
import { Image } from "react-native";

// New message
export const listenToMessags = async (
  user,
  setAllReceivedMessages,
  setUnreadMessages,
  setAllSendersUsersArr,
  allSendersUsersArr,
  setProfileImagesCache
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

        // Get the new message sender
        const userIdSent = payload.new.sender_id;
        //console.log(">>>>>>>>>>> SENDER ID: " + userIdSent);

        // Check if in the array
        const inArr = allSendersUsersArr.some((user) => user.id === userIdSent);
        //console.log(">>>>>>>>>>>>>>>>> Already in arr? " + inArr);

        // If not in array add him
        if (!inArr) {
          //console.log(">>>>>>>>>>Getting user data");
          const fullUser = await getUserData(userIdSent);
          /*console.log(
            ">>>>>>>>>>User got: " + JSON.stringify(fullUser, null, 2)
          );*/
          setAllSendersUsersArr((prev) => [...prev, fullUser]);
          //console.log(">>>>>>>>>>Updated set array!");

          /*console.log("REALTIME: RAW URL VALUE:", fullUser.profile_image_url);
          console.log("TYPE OF:", typeof fullUser.profile_image_url);
          console.log(
            "IS TRIMMED EMPTY?",
            fullUser.profile_image_url?.trim() === ""
          );*/

          // Prefetch + add to imageMap
          if (
            typeof fullUser.profile_image_url === "string" &&
            fullUser.profile_image_url.trim() !== ""
          ) {
            try {
              await Image.prefetch(fullUser.profile_image_url);
              setProfileImagesCache((prev) => ({
                ...prev,
                [fullUser.id]: { uri: fullUser.profile_image_url },
              }));
              console.log("✅ Image cached successfully");
            } catch (err) {
              console.error("❌ Error prefetching image:", err);
            }
          }
        }

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
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      },
      async (payload) => {
        console.log("MSG READ! ", payload.new.subject);

        const userMessages = await getUserMessages(user.id);
        setAllReceivedMessages(userMessages);
        setUnreadMessages(filterMessagesByUnread(userMessages));
      }
    )

    .subscribe();

  return channel;
};
