import { useCallback, useEffect, useMemo, useState } from "react";
import * as Notifications from "expo-notifications";

const useSettingsLogic = () => {
  // "granted" | "denied" | "undetermined" | null (initial)
  const [notificationsPermissionStatus, setNotificationsPermissionStatus] =
    useState(null);

  // Derived boolean for UI logic
  const hasNotificationsPermission =
    notificationsPermissionStatus === "granted";

  // Check current permission without prompting
  const checkNotificationsPermission = async () => {
    const perm = await Notifications.getPermissionsAsync();
    setNotificationsPermissionStatus(perm.status);
    return perm;
  };

  // Ask the user for permission (only if not already granted)
  const requestNotificationsPermission = async () => {
    const before = await Notifications.getPermissionsAsync();
    if (before.status === "granted") {
      setNotificationsPermissionStatus("granted");
      return before;
    }

    const after = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    setNotificationsPermissionStatus(after.status);
    return after;
  };

  useEffect(() => {
    checkNotificationsPermission();
  }, [checkNotificationsPermission]);

  // Optional: label for settings screen
  const notificationsPermissionLabel = useMemo(() => {
    switch (notificationsPermissionStatus) {
      case "granted":
        return "Notifications: Allowed";
      case "denied":
        return "Notifications: Denied";
      case "undetermined":
        return "Notifications: Not determined";
      default:
        return "Notifications: Checking…";
    }
  }, [notificationsPermissionStatus]);

  return {
    notificationsPermissionStatus,
    hasNotificationsPermission,
    notificationsPermissionLabel,
    checkNotificationsPermission,
    requestNotificationsPermission,
  };
};

export default useSettingsLogic;
