// notifications/NotificationsManager.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";

// Get device token
export const requestPushToken = async () => {
  if (!Device.isDevice) {
    Alert.alert("You must use a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Permission not granted for push notifications");
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  return token;
};

export const sendPushNotification = async (expoPushToken, subject, message) => {
  console.log("TOKEN IS:", expoPushToken);
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: "default",
        title: subject,
        body: message,
      }),
    });

    const data = await response.json();
    console.log("📨 Expo Push response:", data);
  } catch (error) {
    console.error("❌ Failed to send push:", error);
  }
};
