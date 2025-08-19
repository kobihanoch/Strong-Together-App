import React, { useEffect, useRef, useState } from "react";
import { View, Switch, Linking, AppState } from "react-native";
import { Dialog, ALERT_TYPE } from "react-native-alert-notification";
import useSettingsLogic from "../hooks/logic/useSettingsLogic";
import { Notifier, NotifierComponents } from "react-native-notifier";

function notify(type, title, description) {
  // Map logical type -> Notifier "alertType"
  const alertType =
    type === "success"
      ? "success"
      : type === "warning"
      ? "warn"
      : type === "error"
      ? "error"
      : "info";

  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    componentProps: { alertType },
    duration: 4000,
    showAnimationDuration: 300,
    hideOnPress: true,
  });
}

export default function NotificationsToggle() {
  const {
    hasNotificationsPermission,
    notificationsPermissionStatus,
    checkNotificationsPermission,
    requestNotificationsPermission,
  } = useSettingsLogic();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Keep UI toggle in sync with OS permission
  useEffect(() => {
    setIsEnabled(!!hasNotificationsPermission);
  }, [hasNotificationsPermission]);

  // Re-check permission when returning from Settings
  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if ((prev === "background" || prev === "inactive") && next === "active") {
        checkNotificationsPermission();
      }
    });
    return () => sub.remove();
  }, [checkNotificationsPermission]);

  const handleToggle = async (nextValue) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      if (nextValue) {
        // Turning ON: request permission if needed
        if (notificationsPermissionStatus !== "granted") {
          const res = await requestNotificationsPermission();
          const granted = res?.status === "granted";
          setIsEnabled(granted);
          notify(
            granted ? "success" : "warning",
            granted ? "Notifications enabled" : "Permission not granted",
            granted
              ? "You will receive notifications."
              : "Enable notifications in Settings to receive alerts."
          );
        } else {
          setIsEnabled(true);
          notify(
            "success",
            "Notifications enabled",
            "You will receive notifications."
          );
        }
      } else {
        // Turning OFF: cannot revoke in-app; ask to open OS settings
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Turn off notifications",
          textBody:
            "To disable notifications, open your device settings and turn them off for this app.",
          button: "Open Settings",
          closeOnOverlayTap: true,
          onPressButton: async () => {
            try {
              await Linking.openSettings();
              // AppState listener will refresh status when returning
            } catch (e) {
              checkNotificationsPermission();
              notify(
                "error",
                "Could not open settings",
                "Please open settings manually."
              );
            }
          },
        });
        // Do not flip the switch; reflect real OS state when it changes
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <View style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}>
      <Switch
        trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
        thumbColor={isEnabled ? "#22C55E" : "#F9FAFB"}
        ios_backgroundColor="#D1D5DB"
        onValueChange={handleToggle}
        value={isEnabled}
        disabled={isBusy}
      />
    </View>
  );
}
