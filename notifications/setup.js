// notifications/setup.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import api from "../api/api";

export async function setupPush(userId) {
  try {
    if (!userId) return null;
    if (!Device.isDevice) return null;

    // Android configuration
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    // Allowences
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
      if (status !== "granted") return null;
    }

    // If expo project id exists
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId ||
      undefined;

    const tokenObj = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenObj?.data;
    if (!token) return null;

    // Add to DB
    await api.put("/api/users/pushtoken", { token: token });

    return token;
  } catch (e) {
    console.log("setupPush error:", e?.message || e);
    return null;
  }
}
