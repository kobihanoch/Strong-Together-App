import NetInfo from "@react-native-community/netinfo";
import { Notifier, NotifierComponents } from "react-native-notifier";

let lock = false;
const once = (fn, delay = 1500) => {
  if (lock) return;
  lock = true;
  try {
    fn();
  } finally {
    setTimeout(() => {
      lock = false;
    }, delay);
  }
};

export const notifyOffline = () =>
  once(() =>
    Notifier.showNotification({
      title: "No Internet",
      description: "You're offline. Check your connection.",
      duration: 2500,
      showAnimationDuration: 250,
      hideOnPress: true,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "warn", // "success" | "warn" | "error"
        titleStyle: { fontSize: 16 },
        descriptionStyle: { fontSize: 14 },
      },
    })
  );

export const notifyServerDown = () =>
  once(() =>
    Notifier.showNotification({
      title: "Server error",
      description: "Server is down. Please try again shortly.",
      duration: 2500,
      showAnimationDuration: 250,
      hideOnPress: true,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "error",
        titleStyle: { fontSize: 16 },
        descriptionStyle: { fontSize: 14 },
      },
    })
  );

// Helper: check network connection
export const isDeviceOnline = async () => {
  const state = await NetInfo.fetch();
  if (state.isInternetReachable === false) return false;
  return !!state.isConnected;
};
