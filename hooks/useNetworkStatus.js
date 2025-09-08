import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { notifyOffline } from "../api/networkCheck";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const prevOnlineRef = useRef(undefined); // undefined means "no emission yet"

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Normalize reachable: treat null as "unknown" -> default to true
      const reachable = state.isInternetReachable;
      const connected =
        !!state.isConnected && (reachable === null ? true : !!reachable);

      // First emission: seed prev without notifying
      if (prevOnlineRef.current === undefined) {
        prevOnlineRef.current = connected;
        setIsOnline(connected);
        return;
      }

      // No real change -> do nothing
      if (prevOnlineRef.current === connected) {
        return;
      }

      // Real change -> update + notify
      prevOnlineRef.current = connected;
      setIsOnline(connected);

      if (connected) {
        Notifier.showNotification({
          title: "You are back online!",
          description: "Connection restored",
          Component: NotifierComponents.Alert,
          componentProps: { alertType: "success" },
          duration: 4000,
          showAnimationDuration: 300,
          hideOnPress: true,
        });
      } else {
        notifyOffline();
      }
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};
